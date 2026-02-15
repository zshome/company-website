from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.core.config import settings
from app.core.database import SessionLocal, init_db
from app.core.init_db import init_db_data
from app.api.v1 import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("正在初始化数据库...")
    try:
        init_db()
        print("数据库表创建成功")
        
        db = SessionLocal()
        try:
            init_db_data(db)
            print("初始数据加载成功")
        except Exception as e:
            print(f"初始数据加载警告: {e}")
        finally:
            db.close()
    except Exception as e:
        print(f"数据库初始化错误: {e}")
    
    if not os.path.exists("uploads"):
        os.makedirs("uploads")
    
    print(f"服务启动: {settings.PROJECT_NAME}")
    print(f"API文档: http://localhost:8000/docs")
    
    yield
    
    print("服务关闭")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="福建省宜然焕新科技有限公司官网后端API",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "宜然焕新API服务运行正常"}


@app.get("/")
async def root():
    return {
        "message": "宜然焕新官网API",
        "docs": "/docs",
        "health": "/health"
    }
