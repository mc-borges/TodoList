import firebase_admin
from firebase_admin import credentials, firestore
from config import settings
import os

class FirebaseService:
    def __init__(self):
        self.db = None
        self.initialize_firebase()
    
    def initialize_firebase(self):
        """Initialize Firebase Admin SDK"""
        try:
            # Check if Firebase is already initialized
            firebase_admin.get_app()
        except ValueError:
            # Firebase not initialized yet
            cred_path = os.path.join(os.path.dirname(__file__), settings.firebase_credentials_path)
            
            if os.path.exists(cred_path):
                # Use service account credentials
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
            else:
                # Use default credentials (for development/testing)
                firebase_admin.initialize_app()
        
        self.db = firestore.client()
    
    def get_db(self):
        """Get Firestore database instance"""
        return self.db

# Global Firebase service instance
firebase_service = FirebaseService()
