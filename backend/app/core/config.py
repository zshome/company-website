from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    PROJECT_NAME: str = "宜然焕新官网"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    DATABASE_URL: str = "sqlite:///./data/yiran_huanxin.db"
    
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://localhost:8000",
    ]
    
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"
        case_sensitive = True
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if isinstance(self.ALLOWED_ORIGINS, str):
            try:
                self.ALLOWED_ORIGINS = json.loads(self.ALLOWED_ORIGINS)
            except:
                self.ALLOWED_ORIGINS = [x.strip() for x in self.ALLOWED_ORIGINS.split(',')]


settings = Settings()
