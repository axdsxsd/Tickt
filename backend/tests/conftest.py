import uuid
import pytest
from sqlalchemy.orm import Session
from fastapi.testclient import TestClient

from app.main import app
from app.database import Base, engine, SessionLocal
from app.deps import get_db
from app.crud import create_user
from app.models import User
from app.auth import create_access_token

# ===========================
# Настройка тестового клиента
# ===========================
client = TestClient(app)

# Переопределяем get_db для тестов
def override_get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Создаём таблицы один раз перед тестами
Base.metadata.create_all(bind=engine)

# ===========================
# Фикстуры для тестов
# ===========================
@pytest.fixture
def db_session():
    """
    Фикстура для работы с базой данных.
    Сессия откатывается после теста.
    """
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.rollback()
        db.close()


@pytest.fixture
def client():
    """Возвращает тестовый клиент FastAPI."""
    return TestClient(app)


@pytest.fixture
def test_user(db_session) -> User:
    """
    Создаёт уникального пользователя для теста.
    """
    unique_email = f"user_{uuid.uuid4()}@example.com"
    user = create_user(db_session, unique_email, "password")
    return user


@pytest.fixture
def auth_headers(test_user: User, db_session: Session):
    """
    Возвращает заголовки с валидным access token для авторизации.
    """
    payload = {"sub": str(test_user.id), "email": test_user.email}
    token = create_access_token(payload)
    return {"Authorization": f"Bearer {token}"}