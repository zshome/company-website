from fastapi import APIRouter
from app.api.v1.endpoints import contacts, news, cases, auth, users, company, services, dashboard, upload, page_views

api_router = APIRouter()

api_router.include_router(contacts.router)
api_router.include_router(news.router)
api_router.include_router(cases.router)
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(company.router)
api_router.include_router(services.router)
api_router.include_router(dashboard.router)
api_router.include_router(upload.router)
api_router.include_router(page_views.router)
