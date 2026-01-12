from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    # DATABASE
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str

    # JWT
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int

    # SMTP
    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_USER: str
    SMTP_PASSWORD: str
    SMTP_FROM: str

    # APP
    APP_NAME: str
    APP_VERSION: str
    APP_DESCRIPTION: str

    class Config:
        env_file = Path(__file__).parent.parent / ".env"

settings = Settings()