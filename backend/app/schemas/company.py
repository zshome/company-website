from pydantic import BaseModel
from typing import Optional, List


class CompanyBase(BaseModel):
    name: str
    short_name: Optional[str] = None
    logo: Optional[str] = None
    description: Optional[str] = None
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None
    wechat: Optional[str] = None
    weibo: Optional[str] = None
    copyright_text: Optional[str] = None
    icp: Optional[str] = None
    business_hours: Optional[str] = None
    banner_images: Optional[List[str]] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    short_name: Optional[str] = None
    logo: Optional[str] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    wechat: Optional[str] = None
    weibo: Optional[str] = None
    copyright_text: Optional[str] = None
    icp: Optional[str] = None
    business_hours: Optional[str] = None
    banner_images: Optional[List[str]] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class CompanyResponse(BaseModel):
    id: int
    name: str
    short_name: Optional[str] = None
    logo: Optional[str] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    wechat: Optional[str] = None
    weibo: Optional[str] = None
    copyright_text: Optional[str] = None
    icp: Optional[str] = None
    business_hours: Optional[str] = None
    banner_images: List[str] = []
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    class Config:
        from_attributes = True
