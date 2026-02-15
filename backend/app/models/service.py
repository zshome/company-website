from sqlalchemy import Column, Integer, String, Text, Boolean
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from app.core.database import Base


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(50), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(100), nullable=True)
    image = Column(Text, nullable=True)
    features = Column(Text, nullable=True)
    price_range = Column(String(100), nullable=True)
    duration = Column(String(50), nullable=True)
    is_featured = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
