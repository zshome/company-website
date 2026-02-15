from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import json


class ServiceCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    image: Optional[str] = None
    features: Optional[List[str]] = None
    price_range: Optional[str] = None
    duration: Optional[str] = None
    is_featured: Optional[bool] = False
    sort_order: Optional[int] = 0


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    image: Optional[str] = None
    features: Optional[List[str]] = None
    price_range: Optional[str] = None
    duration: Optional[str] = None
    is_featured: Optional[bool] = None
    sort_order: Optional[int] = None


class ServiceResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str]
    icon: Optional[str]
    image: Optional[str]
    features: List[str] = []
    price_range: Optional[str]
    duration: Optional[str]
    is_featured: bool
    sort_order: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
