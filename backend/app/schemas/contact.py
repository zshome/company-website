from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class ContactCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    service_type: Optional[str] = None
    message: Optional[str] = None


class ContactResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: Optional[str]
    address: Optional[str]
    service_type: Optional[str]
    message: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
