from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import json


class CaseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    service_type: Optional[str] = None
    area: Optional[str] = None
    cover_image: Optional[str] = None
    images: Optional[List[str]] = None
    is_featured: Optional[int] = 0


class CaseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    service_type: Optional[str] = None
    area: Optional[str] = None
    cover_image: Optional[str] = None
    images: Optional[List[str]] = None
    is_featured: Optional[int] = None


class CaseResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    location: Optional[str]
    service_type: Optional[str]
    area: Optional[str]
    cover_image: Optional[str]
    images: List[str] = []
    is_featured: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

    @classmethod
    def from_orm_with_images(cls, case):
        images = []
        if case.images:
            try:
                images = json.loads(case.images)
            except:
                images = []
        return cls(
            id=case.id,
            title=case.title,
            description=case.description,
            location=case.location,
            service_type=case.service_type,
            area=case.area,
            cover_image=case.cover_image,
            images=images,
            is_featured=case.is_featured,
            created_at=case.created_at,
        )
