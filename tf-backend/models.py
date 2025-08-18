from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User models
class UserBase(BaseModel):
    email: EmailStr
    name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    phone: Optional[str] = None
    access_token: str
    token_type: str = "bearer"

# Checklist models
class ChecklistItemBase(BaseModel):
    title: str
    completed: bool = False
    description: Optional[str] = None

class ChecklistItemCreate(ChecklistItemBase):
    pass

class ChecklistItem(ChecklistItemBase):
    id: str
    checklist_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ChecklistBase(BaseModel):
    name: str
    category: Optional[str] = None
    description: Optional[str] = None
    limit_date: Optional[datetime] = None
    change_color_by_date: bool = False
    show_motivational_msg: bool = False

class ChecklistCreate(ChecklistBase):
    pass

class ChecklistUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    limit_date: Optional[datetime] = None
    change_color_by_date: Optional[bool] = None
    show_motivational_msg: Optional[bool] = None

class Checklist(ChecklistBase):
    id: str
    user_id: str
    items: List[ChecklistItem] = []
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Token models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
