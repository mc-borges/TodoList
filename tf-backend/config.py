import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "TodoList Backend"
    debug: bool = True
    
    # Firebase configuration
    firebase_project_id: str = "project-tafeito"
    firebase_credentials_path: str = "firebase-credentials.json"
    
    # CORS settings
    allowed_origins: List[str] = [
        "http://localhost:4200",  # Angular dev server
        "http://localhost:3000",
        "https://localhost:4200"
    ]
    
    # JWT settings
    secret_key: str = "your-secret-key-here-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings()
