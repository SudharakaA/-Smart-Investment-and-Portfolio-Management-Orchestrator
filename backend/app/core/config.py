import os
from functools import lru_cache
from typing import List

from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str
    app_env: str
    app_port: int
    allow_origins: str
    yahoo_api_key: str
    alpha_vantage_api_key: str
    news_api_key: str
    redis_url: str
    auth_db_url: str
    auth_session_hours: int

    @property
    def origins(self) -> List[str]:
        return [origin.strip() for origin in self.allow_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings(
        app_name=os.getenv("APP_NAME", "InvestX Agent Orchestrator"),
        app_env=os.getenv("APP_ENV", "development"),
        app_port=int(os.getenv("APP_PORT", "8000")),
        allow_origins=os.getenv("ALLOW_ORIGINS", "http://localhost:5173"),
        yahoo_api_key=os.getenv("YAHOO_API_KEY", ""),
        alpha_vantage_api_key=os.getenv("ALPHA_VANTAGE_API_KEY", ""),
        news_api_key=os.getenv("NEWS_API_KEY", ""),
        redis_url=os.getenv("REDIS_URL", "redis://localhost:6379"),
        auth_db_url=os.getenv(
            "AUTH_DB_URL",
            f"sqlite:///{os.getenv('AUTH_DB_PATH', 'data/investx.db')}",
        ),
        auth_session_hours=int(os.getenv("AUTH_SESSION_HOURS", "24")),
    )
