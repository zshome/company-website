from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from app.core.database import get_db
from app.models.news import News
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.news import NewsCreate, NewsUpdate, NewsResponse

router = APIRouter(prefix="/news", tags=["news"])


def news_to_response(news: News) -> dict:
    images = []
    if news.images:
        try:
            images = json.loads(news.images)
        except:
            images = []
    return {
        "id": news.id,
        "title": news.title,
        "summary": news.summary,
        "content": news.content,
        "cover_image": news.cover_image,
        "images": images,
        "category": news.category,
        "is_published": news.is_published,
        "view_count": news.view_count,
        "created_at": news.created_at,
    }


@router.get("/", response_model=List[NewsResponse])
def get_news_list(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    published: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(News)
    if category:
        query = query.filter(News.category == category)
    if published is not None:
        query = query.filter(News.is_published == published)
    news_list = query.order_by(News.created_at.desc()).offset(skip).limit(limit).all()
    return [news_to_response(n) for n in news_list]


@router.get("/{news_id}", response_model=NewsResponse)
def get_news(news_id: int, db: Session = Depends(get_db)):
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="新闻不存在")
    news.view_count += 1
    db.commit()
    return news_to_response(news)


@router.post("/", response_model=NewsResponse)
def create_news(
    news: NewsCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    news_data = news.model_dump()
    if news_data.get("images"):
        news_data["images"] = json.dumps(news_data["images"])
    db_news = News(**news_data)
    db.add(db_news)
    db.commit()
    db.refresh(db_news)
    return news_to_response(db_news)


@router.put("/{news_id}", response_model=NewsResponse)
def update_news(
    news_id: int,
    news: NewsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_news = db.query(News).filter(News.id == news_id).first()
    if not db_news:
        raise HTTPException(status_code=404, detail="新闻不存在")
    update_data = news.model_dump(exclude_unset=True)
    if "images" in update_data and update_data["images"] is not None:
        update_data["images"] = json.dumps(update_data["images"])
    for key, value in update_data.items():
        setattr(db_news, key, value)
    db.commit()
    db.refresh(db_news)
    return news_to_response(db_news)


@router.delete("/{news_id}")
def delete_news(
    news_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_news = db.query(News).filter(News.id == news_id).first()
    if not db_news:
        raise HTTPException(status_code=404, detail="新闻不存在")
    db.delete(db_news)
    db.commit()
    return {"message": "新闻已删除"}
