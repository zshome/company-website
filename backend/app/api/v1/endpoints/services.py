from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from app.core.database import get_db
from app.models.service import Service
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse

router = APIRouter(prefix="/services", tags=["services"])


def service_to_response(service: Service) -> dict:
    features = []
    if service.features:
        try:
            features = json.loads(service.features)
        except:
            features = []
    return {
        "id": service.id,
        "name": service.name,
        "slug": service.slug,
        "description": service.description,
        "icon": service.icon,
        "image": service.image,
        "features": features,
        "price_range": service.price_range,
        "duration": service.duration,
        "is_featured": service.is_featured,
        "sort_order": service.sort_order,
        "created_at": service.created_at,
    }


@router.get("/", response_model=List[ServiceResponse])
def get_services(
    featured: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Service)
    if featured is not None:
        query = query.filter(Service.is_featured == featured)
    services = query.order_by(Service.sort_order, Service.created_at.desc()).all()
    return [service_to_response(s) for s in services]


@router.get("/{service_slug}", response_model=ServiceResponse)
def get_service(service_slug: str, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.slug == service_slug).first()
    if not service:
        raise HTTPException(status_code=404, detail="服务不存在")
    return service_to_response(service)


@router.post("/", response_model=ServiceResponse)
def create_service(
    service: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(Service).filter(Service.slug == service.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="服务标识已存在")
    
    service_data = service.model_dump()
    if service_data.get("features") is not None:
        service_data["features"] = json.dumps(service_data["features"])
    else:
        service_data["features"] = json.dumps([])
    db_service = Service(**service_data)
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return service_to_response(db_service)


@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: int,
    service: ServiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if not db_service:
        raise HTTPException(status_code=404, detail="服务不存在")
    
    update_data = service.model_dump(exclude_unset=True)
    if "slug" in update_data and update_data["slug"] != db_service.slug:
        existing = db.query(Service).filter(Service.slug == update_data["slug"]).first()
        if existing:
            raise HTTPException(status_code=400, detail="服务标识已存在")
    
    if "features" in update_data:
        if update_data["features"] is not None:
            update_data["features"] = json.dumps(update_data["features"])
        else:
            update_data["features"] = json.dumps([])
    
    for key, value in update_data.items():
        setattr(db_service, key, value)
    db.commit()
    db.refresh(db_service)
    return service_to_response(db_service)


@router.delete("/{service_id}")
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if not db_service:
        raise HTTPException(status_code=404, detail="服务不存在")
    db.delete(db_service)
    db.commit()
    return {"message": "服务已删除"}
