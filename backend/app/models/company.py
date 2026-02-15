from sqlalchemy import Column, Integer, String, Text, Float
from app.core.database import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="福建省宜然焕新科技有限公司")
    short_name = Column(String(50), nullable=True)
    logo = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    phone = Column(String(20), default="400-888-8888")
    email = Column(String(100), default="contact@yiran-huanxin.com")
    address = Column(String(200), default="福建省福州市鼓楼区")
    wechat = Column(String(50), nullable=True)
    weibo = Column(String(50), nullable=True)
    copyright_text = Column(String(200), default="© 2024 福建省宜然焕新科技有限公司 版权所有")
    icp = Column(String(50), nullable=True)
    business_hours = Column(String(100), nullable=True)
    banner_images = Column(Text, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
