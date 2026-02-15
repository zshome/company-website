from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.contact import Contact
from app.schemas.contact import ContactCreate, ContactResponse
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/contacts", tags=["contacts"])


@router.post("/", response_model=ContactResponse)
def create_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    db_contact = Contact(**contact.model_dump())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact


@router.get("/", response_model=List[ContactResponse])
def get_contacts(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contacts = db.query(Contact).offset(skip).limit(limit).all()
    return contacts


@router.get("/{contact_id}", response_model=ContactResponse)
def get_contact(
    contact_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="联系记录不存在")
    return contact


@router.put("/{contact_id}/status", response_model=ContactResponse)
def update_contact_status(
    contact_id: int, 
    status: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="联系记录不存在")
    contact.status = status
    db.commit()
    db.refresh(contact)
    return contact
