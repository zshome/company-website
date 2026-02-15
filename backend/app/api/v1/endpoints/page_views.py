from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date, timedelta
from app.core.database import get_db
from app.models.page_view import PageView
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter(prefix="/page-views", tags=["page-views"])


@router.post("/record")
def record_page_view(
    page: str,
    request: Request,
    db: Session = Depends(get_db)
):
    page_view = PageView(
        page=page,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent", "")[:500] if request.headers.get("user-agent") else None,
        view_date=date.today(),
    )
    db.add(page_view)
    db.commit()
    return {"status": "ok"}


@router.get("/stats")
def get_page_view_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    yesterday = today - timedelta(days=1)
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    
    total_views = db.query(func.count(PageView.id)).scalar() or 0
    today_views = db.query(func.count(PageView.id)).filter(PageView.view_date == today).scalar() or 0
    yesterday_views = db.query(func.count(PageView.id)).filter(PageView.view_date == yesterday).scalar() or 0
    week_views = db.query(func.count(PageView.id)).filter(PageView.view_date >= week_ago).scalar() or 0
    month_views = db.query(func.count(PageView.id)).filter(PageView.view_date >= month_ago).scalar() or 0
    
    daily_stats = db.query(
        PageView.view_date,
        func.count(PageView.id).label('count')
    ).filter(
        PageView.view_date >= week_ago
    ).group_by(
        PageView.view_date
    ).order_by(
        PageView.view_date
    ).all()
    
    daily_data = [{"date": str(stat.view_date), "count": stat.count} for stat in daily_stats]
    
    page_stats = db.query(
        PageView.page,
        func.count(PageView.id).label('count')
    ).group_by(
        PageView.page
    ).order_by(
        func.count(PageView.id).desc()
    ).limit(10).all()
    
    page_data = [{"page": stat.page, "count": stat.count} for stat in page_stats]
    
    return {
        "total_views": total_views,
        "today_views": today_views,
        "yesterday_views": yesterday_views,
        "week_views": week_views,
        "month_views": month_views,
        "daily_stats": daily_data,
        "page_stats": page_data,
    }
