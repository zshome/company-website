from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from app.models.user import User
    from app.models.news import News
    from app.models.case import Case
    from app.models.contact import Contact
    from app.models.company import Company
    from app.models.service import Service
    from app.models.page_view import PageView
    
    Base.metadata.create_all(bind=engine)
