import os
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/upload", tags=["upload"])

UPLOAD_DIR = "uploads"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="只能上传图片文件")
    
    ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    filename = f"{datetime.now().strftime('%Y%m%d')}_{uuid.uuid4().hex[:8]}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)
    
    return {"url": f"/uploads/{filename}"}


@router.post("/images")
async def upload_images(
    files: list[UploadFile] = File(...),
    current_user: User = Depends(get_current_user)
):
    urls = []
    for file in files:
        if not file.content_type or not file.content_type.startswith("image/"):
            continue
        
        ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
        filename = f"{datetime.now().strftime('%Y%m%d')}_{uuid.uuid4().hex[:8]}{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        
        content = await file.read()
        with open(filepath, "wb") as f:
            f.write(content)
        
        urls.append(f"/uploads/{filename}")
    
    return {"urls": urls}
