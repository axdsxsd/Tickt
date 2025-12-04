from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int

    APP_NAME: str
    APP_VERSION: str
    APP_DESCRIPTION: str

    class Config:
        env_file = Path(__file__).parent.parent / ".env"

settings = Settings()