from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from app.core.database import get_db
from app.models.case import Case
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.case import CaseCreate, CaseUpdate, CaseResponse

router = APIRouter(prefix="/cases", tags=["cases"])


def case_to_response(case: Case) -> dict:
    images = []
    if case.images:
        try:
            images = json.loads(case.images)
        except:
            images = []
    return {
        "id": case.id,
        "title": case.title,
        "description": case.description,
        "location": case.location,
        "service_type": case.service_type,
        "area": case.area,
        "cover_image": case.cover_image,
        "images": images,
        "is_featured": case.is_featured,
        "created_at": case.created_at,
    }


@router.get("/", response_model=List[CaseResponse])
def get_cases(
    skip: int = 0,
    limit: int = 100,
    service_type: Optional[str] = None,
    featured: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Case)
    if service_type:
        query = query.filter(Case.service_type == service_type)
    if featured is not None:
        if featured:
            query = query.filter(Case.is_featured == 1)
        else:
            query = query.filter(Case.is_featured == 0)
    cases = query.order_by(Case.created_at.desc()).offset(skip).limit(limit).all()
    return [case_to_response(c) for c in cases]


@router.get("/{case_id}", response_model=CaseResponse)
def get_case(case_id: int, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="案例不存在")
    return case_to_response(case)


@router.post("/", response_model=CaseResponse)
def create_case(
    case: CaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    case_data = case.model_dump()
    if case_data.get("images"):
        case_data["images"] = json.dumps(case_data["images"])
    db_case = Case(**case_data)
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return case_to_response(db_case)


@router.put("/{case_id}", response_model=CaseResponse)
def update_case(
    case_id: int,
    case: CaseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_case = db.query(Case).filter(Case.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="案例不存在")
    update_data = case.model_dump(exclude_unset=True)
    if "images" in update_data and update_data["images"] is not None:
        update_data["images"] = json.dumps(update_data["images"])
    for key, value in update_data.items():
        setattr(db_case, key, value)
    db.commit()
    db.refresh(db_case)
    return case_to_response(db_case)


@router.delete("/{case_id}")
def delete_case(
    case_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_case = db.query(Case).filter(Case.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="案例不存在")
    db.delete(db_case)
    db.commit()
    return {"message": "案例已删除"}
