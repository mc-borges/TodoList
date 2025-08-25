from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, List
import uuid

from config import settings
from models import (
    User, UserCreate, UserLogin, UserResponse,
    Checklist, ChecklistCreate, ChecklistUpdate,
    ChecklistItem, ChecklistItemCreate, ChecklistItemUpdate, ChecklistItemsBulkUpdate,
    Token, TokenData
)
from firebase_service import firebase_service

app = FastAPI(title=settings.app_name, debug=settings.debug)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    # Get user from Firestore
    db = firebase_service.get_db()
    users_ref = db.collection('users')
    user_query = users_ref.where('email', '==', token_data.email).limit(1)
    users = user_query.stream()
    
    user_doc = None
    for user in users:
        user_doc = user
        break
    
    if user_doc is None:
        raise credentials_exception
    
    user_data = user_doc.to_dict()
    user_data['id'] = user_doc.id
    return user_data

# Routes
@app.get("/")
async def root():
    return {"message": "TodoList Backend API"}

@app.post("/auth/signup", response_model=UserResponse)
async def signup(user: UserCreate):
    db = firebase_service.get_db()
    
    # Check if user already exists
    users_ref = db.collection('users')
    existing_user = users_ref.where('email', '==', user.email).limit(1)
    
    if len(list(existing_user.stream())) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este e-mail já existe."
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    user_data = {
        "email": user.email,
        "name": user.name,
        "phone": user.phone,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    # Add user to Firestore
    doc_ref = users_ref.add(user_data)
    user_id = doc_ref[1].id
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return UserResponse(
        id=user_id,
        email=user.email,
        name=user.name,
        phone=user.phone,
        access_token=access_token
    )

@app.post("/auth/login", response_model=UserResponse)
async def login(user_credentials: UserLogin):
    db = firebase_service.get_db()
    users_ref = db.collection('users')
    
    # Find user by email
    user_query = users_ref.where('email', '==', user_credentials.email).limit(1)
    users = list(user_query.stream())
    
    if not users:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail e/ou senha incorreta."
        )
    
    user_doc = users[0]
    user_data = user_doc.to_dict()
    
    # Verify password
    if not verify_password(user_credentials.password, user_data['password']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail e/ou senha incorreta."
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user_credentials.email}, expires_delta=access_token_expires
    )
    
    return UserResponse(
        id=user_doc.id,
        email=user_data['email'],
        name=user_data['name'],
        phone=user_data.get('phone'),
        access_token=access_token
    )

@app.get("/auth/me", response_model=dict)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user['id'],
        "email": current_user['email'],
        "name": current_user['name'],
        "phone": current_user.get('phone')
    }

@app.post("/checklists", response_model=dict)
async def create_checklist(checklist: ChecklistCreate, current_user: dict = Depends(get_current_user)):
    db = firebase_service.get_db()
    
    # Convert datetime to timestamp if provided
    limit_date_timestamp = None
    if checklist.limit_date:
        limit_date_timestamp = checklist.limit_date
    
    checklist_data = {
        "name": checklist.name,
        "category": checklist.category,
        "description": checklist.description,
        "limit_date": limit_date_timestamp,
        "change_color_by_date": bool(checklist.change_color_by_date),
        "show_motivational_msg": bool(checklist.show_motivational_msg),
        "user_id": current_user['id'],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Add checklist to Firestore
    checklists_ref = db.collection('checklists')
    doc_ref = checklists_ref.add(checklist_data)
    checklist_id = doc_ref[1].id
    
    # Prepare response data with proper serialization
    response_data = {
        "id": checklist_id,
        "name": checklist_data["name"],
        "category": checklist_data["category"],
        "description": checklist_data["description"],
        "limit_date": checklist_data["limit_date"].isoformat() if checklist_data["limit_date"] else None,
        "change_color_by_date": checklist_data["change_color_by_date"],
        "show_motivational_msg": checklist_data["show_motivational_msg"],
        "user_id": checklist_data["user_id"],
        "created_at": checklist_data["created_at"].isoformat(),
        "updated_at": checklist_data["updated_at"].isoformat(),
        "items": []
    }
    
    return response_data

@app.get("/checklists", response_model=List[dict])
async def get_user_checklists(current_user: dict = Depends(get_current_user)):
    db = firebase_service.get_db()
    
    # Get user's checklists
    checklists_ref = db.collection('checklists')
    user_checklists = checklists_ref.where('user_id', '==', current_user['id']).stream()
    
    checklists = []
    for checklist_doc in user_checklists:
        checklist_data = checklist_doc.to_dict()
        
        # Prepare response data with proper serialization
        response_checklist = {
            "id": checklist_doc.id,
            "name": checklist_data.get("name"),
            "category": checklist_data.get("category"),
            "description": checklist_data.get("description"),
            "limit_date": checklist_data.get("limit_date").isoformat() if checklist_data.get("limit_date") else None,
            "change_color_by_date": bool(checklist_data.get("change_color_by_date", False)),
            "show_motivational_msg": bool(checklist_data.get("show_motivational_msg", False)),
            "user_id": checklist_data.get("user_id"),
            "created_at": checklist_data.get("created_at").isoformat() if checklist_data.get("created_at") else None,
            "updated_at": checklist_data.get("updated_at").isoformat() if checklist_data.get("updated_at") else None
        }
        
        # Get checklist items
        items_ref = db.collection('checklist_items')
        items_query = items_ref.where('checklist_id', '==', checklist_doc.id).stream()
        
        items = []
        for item_doc in items_query:
            item_data = item_doc.to_dict()
            item_response = {
                "id": item_doc.id,
                "title": item_data.get("title"),
                "completed": bool(item_data.get("completed", False)),
                "description": item_data.get("description"),
                "checklist_id": item_data.get("checklist_id"),
                "created_at": item_data.get("created_at").isoformat() if item_data.get("created_at") else None,
                "updated_at": item_data.get("updated_at").isoformat() if item_data.get("updated_at") else None
            }
            items.append(item_response)
        
        response_checklist['items'] = items
        checklists.append(response_checklist)
    
    return checklists

@app.get("/checklists/{checklist_id}", response_model=dict)
async def get_checklist(checklist_id: str, current_user: dict = Depends(get_current_user)):
    db = firebase_service.get_db()
    
    # Get checklist
    checklist_ref = db.collection('checklists').document(checklist_id)
    checklist_doc = checklist_ref.get()
    
    if not checklist_doc.exists:
        raise HTTPException(status_code=404, detail="Checklist not found")
    
    checklist_data = checklist_doc.to_dict()
    
    # Verify ownership
    if checklist_data['user_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Prepare response data with proper serialization
    response_checklist = {
        "id": checklist_doc.id,
        "name": checklist_data.get("name"),
        "category": checklist_data.get("category"),
        "description": checklist_data.get("description"),
        "limit_date": checklist_data.get("limit_date").isoformat() if checklist_data.get("limit_date") else None,
        "change_color_by_date": bool(checklist_data.get("change_color_by_date", False)),
        "show_motivational_msg": bool(checklist_data.get("show_motivational_msg", False)),
        "user_id": checklist_data.get("user_id"),
        "created_at": checklist_data.get("created_at").isoformat() if checklist_data.get("created_at") else None,
        "updated_at": checklist_data.get("updated_at").isoformat() if checklist_data.get("updated_at") else None
    }
    
    # Get checklist items
    items_ref = db.collection('checklist_items')
    items_query = items_ref.where('checklist_id', '==', checklist_id).stream()
    
    items = []
    for item_doc in items_query:
        item_data = item_doc.to_dict()
        item_response = {
            "id": item_doc.id,
            "title": item_data.get("title"),
            "completed": bool(item_data.get("completed", False)),
            "description": item_data.get("description"),
            "checklist_id": item_data.get("checklist_id"),
            "created_at": item_data.get("created_at").isoformat() if item_data.get("created_at") else None,
            "updated_at": item_data.get("updated_at").isoformat() if item_data.get("updated_at") else None
        }
        items.append(item_response)
    
    response_checklist['items'] = items
    
    return response_checklist

@app.put("/checklists/{checklist_id}", response_model=dict)
async def update_checklist(checklist_id: str, checklist_update: ChecklistUpdate, current_user: dict = Depends(get_current_user)):
    db = firebase_service.get_db()
    
    # Get checklist
    checklist_ref = db.collection('checklists').document(checklist_id)
    checklist_doc = checklist_ref.get()
    
    if not checklist_doc.exists:
        raise HTTPException(status_code=404, detail="Checklist not found")
    
    checklist_data = checklist_doc.to_dict()
    
    # Verify ownership
    if checklist_data['user_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Update only provided fields
    update_data = {}
    if checklist_update.name is not None:
        update_data['name'] = checklist_update.name
    if checklist_update.category is not None:
        update_data['category'] = checklist_update.category
    if checklist_update.description is not None:
        update_data['description'] = checklist_update.description
    if checklist_update.limit_date is not None:
        update_data['limit_date'] = checklist_update.limit_date
    if checklist_update.change_color_by_date is not None:
        update_data['change_color_by_date'] = bool(checklist_update.change_color_by_date)
    if checklist_update.show_motivational_msg is not None:
        update_data['show_motivational_msg'] = bool(checklist_update.show_motivational_msg)
    
    update_data['updated_at'] = datetime.utcnow()
    
    # Update in Firestore
    checklist_ref.update(update_data)
    
    # Return updated checklist with proper serialization
    updated_doc = checklist_ref.get()
    updated_data = updated_doc.to_dict()
    
    response_data = {
        "id": checklist_id,
        "name": updated_data.get("name"),
        "category": updated_data.get("category"),
        "description": updated_data.get("description"),
        "limit_date": updated_data.get("limit_date").isoformat() if updated_data.get("limit_date") else None,
        "change_color_by_date": bool(updated_data.get("change_color_by_date", False)),
        "show_motivational_msg": bool(updated_data.get("show_motivational_msg", False)),
        "user_id": updated_data.get("user_id"),
        "created_at": updated_data.get("created_at").isoformat() if updated_data.get("created_at") else None,
        "updated_at": updated_data.get("updated_at").isoformat() if updated_data.get("updated_at") else None
    }
    
    return response_data

@app.delete("/checklists/{checklist_id}")
async def delete_checklist(checklist_id: str, current_user: dict = Depends(get_current_user)):
    db = firebase_service.get_db()
    
    # Get checklist
    checklist_ref = db.collection('checklists').document(checklist_id)
    checklist_doc = checklist_ref.get()
    
    if not checklist_doc.exists:
        raise HTTPException(status_code=404, detail="Checklist not found")
    
    checklist_data = checklist_doc.to_dict()
    
    # Verify ownership
    if checklist_data['user_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Delete all checklist items first
    items_ref = db.collection('checklist_items')
    items_query = items_ref.where('checklist_id', '==', checklist_id).stream()
    
    for item_doc in items_query:
        item_doc.reference.delete()
    
    # Delete checklist
    checklist_ref.delete()
    
    return {"message": "Checklist deleted successfully"}

@app.put("/checklists/{checklist_id}/items", response_model=dict)
async def update_checklist_items(checklist_id: str, items_data: ChecklistItemsBulkUpdate, current_user: dict = Depends(get_current_user)):
    """
    Update all items in a checklist in bulk.
    Creates new items (items without id) and updates existing items (items with id).
    Removes items that are not in the request.
    """
    db = firebase_service.get_db()
    
    # Verify checklist exists and user owns it
    checklist_ref = db.collection('checklists').document(checklist_id)
    checklist_doc = checklist_ref.get()
    
    if not checklist_doc.exists:
        raise HTTPException(status_code=404, detail="Checklist not found")
    
    checklist_data = checklist_doc.to_dict()
    if checklist_data['user_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get current items
    current_items_query = db.collection('checklist_items').where('checklist_id', '==', checklist_id)
    current_items_docs = current_items_query.stream()
    current_items_ids = {doc.id for doc in current_items_docs}
    
    # Track which items we're keeping/updating
    items_to_keep = set()
    updated_items = []
    
    # Process each item from the request
    for item in items_data.items:
        item_data = {
            "title": item.title,
            "description": item.description,
            "completed": item.completed,
            "checklist_id": checklist_id,
            "updated_at": datetime.utcnow()
        }
        
        if item.id and item.id in current_items_ids:
            # Update existing item
            item_ref = db.collection('checklist_items').document(item.id)
            item_ref.update(item_data)
            items_to_keep.add(item.id)
            
            # Get updated data
            updated_doc = item_ref.get()
            updated_item_data = updated_doc.to_dict()
            updated_item_data['id'] = item.id
            updated_items.append(updated_item_data)
            
        else:
            # Create new item
            item_data["created_at"] = datetime.utcnow()
            items_ref = db.collection('checklist_items')
            doc_ref = items_ref.add(item_data)
            new_item_id = doc_ref[1].id
            
            item_data['id'] = new_item_id
            updated_items.append(item_data)
            items_to_keep.add(new_item_id)
    
    # Delete items that are not in the new list
    items_to_delete = current_items_ids - items_to_keep
    for item_id in items_to_delete:
        db.collection('checklist_items').document(item_id).delete()
    
    return {
        "message": "Checklist items updated successfully",
        "items": updated_items,
        "created_count": len([item for item in items_data.items if not item.id or item.id not in current_items_ids]),
        "updated_count": len([item for item in items_data.items if item.id and item.id in current_items_ids]),
        "deleted_count": len(items_to_delete)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
