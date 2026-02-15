import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.company import Company
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.company import CompanyUpdate, CompanyResponse

router = APIRouter(prefix="/company", tags=["company"])


def company_to_response(company: Company) -> dict:
    banner_images = []
    if company.banner_images:
        try:
            banner_images = json.loads(company.banner_images)
        except:
            banner_images = []
    
    return {
        "id": company.id,
        "name": company.name,
        "short_name": company.short_name,
        "logo": company.logo,
        "description": company.description,
        "phone": company.phone,
        "email": company.email,
        "address": company.address,
        "wechat": company.wechat,
        "weibo": company.weibo,
        "copyright_text": company.copyright_text,
        "icp": company.icp,
        "business_hours": company.business_hours,
        "banner_images": banner_images,
        "latitude": company.latitude,
        "longitude": company.longitude,
    }


@router.get("/", response_model=CompanyResponse)
def get_company(db: Session = Depends(get_db)):
    company = db.query(Company).first()
    if not company:
        company = Company(
            name="福建省宜然焕新科技有限公司",
            short_name="宜然焕新",
            phone="400-888-8888",
            email="contact@yiran-huanxin.com",
            address="福建省福州市鼓楼区",
            copyright_text="© 2024 福建省宜然焕新科技有限公司 版权所有",
            business_hours="周一至周日 8:00-20:00",
            latitude=26.0745,
            longitude=119.2965,
        )
        db.add(company)
        db.commit()
        db.refresh(company)
    return company_to_response(company)


@router.put("/", response_model=CompanyResponse)
def update_company(
    company_update: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="权限不足")
    
    company = db.query(Company).first()
    if not company:
        company = Company()
        db.add(company)
    
    update_data = company_update.model_dump(exclude_unset=True)
    
    if "banner_images" in update_data and update_data["banner_images"] is not None:
        update_data["banner_images"] = json.dumps(update_data["banner_images"])
    
    for key, value in update_data.items():
        setattr(company, key, value)
    
    db.commit()
    db.refresh(company)
    return company_to_response(company)
