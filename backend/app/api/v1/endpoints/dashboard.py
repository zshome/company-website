from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User
from app.models.news import News
from app.models.case import Case
from app.models.contact import Contact
from app.models.service import Service
from datetime import datetime

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    pending_contacts = db.query(Contact).filter(Contact.status == "pending").count()
    total_contacts = db.query(Contact).count()
    total_news = db.query(News).count()
    total_cases = db.query(Case).count()
    total_services = db.query(Service).count()
    
    today = datetime.now().date()
    month_start = today.replace(day=1)
    
    contacts_this_month = db.query(Contact).filter(
        Contact.created_at >= month_start
    ).count()
    
    return {
        "pending_contacts": pending_contacts,
        "total_contacts": total_contacts,
        "total_news": total_news,
        "total_cases": total_cases,
        "total_services": total_services,
        "contacts_this_month": contacts_this_month,
    }


@router.get("/recent-contacts")
def get_recent_contacts(
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contacts = db.query(Contact).order_by(Contact.created_at.desc()).limit(limit).all()
    
    result = []
    for contact in contacts:
        phone = contact.phone or ""
        masked_phone = phone[:3] + "****" + phone[-4:] if len(phone) >= 7 else phone
        result.append({
            "id": contact.id,
            "name": contact.name,
            "phone": masked_phone,
            "service_type": contact.service_type,
            "status": contact.status,
            "created_at": contact.created_at.isoformat() if contact.created_at else None,
        })
    
    return result
