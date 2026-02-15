import sys
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.getcwd())

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash, verify_password

def fix_user():
    db: Session = SessionLocal()
    try:
        # 查找 hongzs 用户
        user = db.query(User).filter(User.username == "hongzs").first()
        
        if user:
            print(f"Found user: {user.username}")
            print(f"Is Active: {user.is_active}")
            
            # 重置密码并激活
            new_password = "hongzs123"
            user.hashed_password = get_password_hash(new_password)
            user.is_active = True
            db.commit()
            
            print(f"\nPassword reset to: {new_password}")
            print(f"Is Active: {user.is_active}")
            
            # 验证
            result = verify_password(new_password, user.hashed_password)
            print(f"Password verification: {result}")
        else:
            print("User 'hongzs' not found. Creating...")
            new_user = User(
                username="hongzs",
                email="hongzs@yiran-huanxin.com",
                hashed_password=get_password_hash("hongzs123"),
                is_active=True,
                is_superuser=False,
            )
            db.add(new_user)
            db.commit()
            print("User created!")
            print("Username: hongzs")
            print("Password: hongzs123")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_user()
