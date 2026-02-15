from sqlalchemy import Column, Integer, String, Date, DateTime
from datetime import datetime, date
from app.core.database import Base


class PageView(Base):
    __tablename__ = "page_views"

    id = Column(Integer, primary_key=True, index=True)
    page = Column(String(100), nullable=False)
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(500), nullable=True)
    view_date = Column(Date, default=date.today)
    created_at = Column(DateTime, default=datetime.utcnow)
