import sys
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.getcwd())

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, init_db, engine
from app.models.user import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def reset_admin_password():
    print("Initializing database...")
    init_db()
    
    db: Session = SessionLocal()
    try:
        user = db.query(User).filter(User.username == "admin").first()
        
        if user:
            print(f"Found admin user: {user.username}")
            user.hashed_password = pwd_context.hash("admin123")
            db.commit()
            print("Admin password reset to: admin123")
        else:
            print("Creating admin user...")
            admin_user = User(
                username="admin",
                email="admin@yiran-huanxin.com",
                hashed_password=pwd_context.hash("admin123"),
                is_superuser=True,
                is_active=True,
            )
            db.add(admin_user)
            db.commit()
            print("Admin user created with password: admin123")
        
        print("\nLogin credentials:")
        print("  Username: admin")
        print("  Password: admin123")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    reset_admin_password()
