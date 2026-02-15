from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import json


class NewsCreate(BaseModel):
    title: str
    summary: Optional[str] = None
    content: str
    cover_image: Optional[str] = None
    images: Optional[List[str]] = None
    category: Optional[str] = "公司新闻"
    is_published: Optional[bool] = True


class NewsUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None
    images: Optional[List[str]] = None
    category: Optional[str] = None
    is_published: Optional[bool] = None


class NewsResponse(BaseModel):
    id: int
    title: str
    summary: Optional[str]
    content: str
    cover_image: Optional[str]
    images: List[str] = []
    category: str
    is_published: bool
    view_count: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
