from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import random, string
from . import models, auth
from .models import User, Image

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, email: str, password: str):
    hashed = auth.hash_password(password)
    user = models.User(email=email, hashed_password=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def set_user_avatar(db: Session, user: User, image: Image):
    user.avatar_id = image.id
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not auth.verify_password(password, user.hashed_password):
        return None
    return user

def get_todos(db: Session, user_id: int):
    return db.query(models.Todo).filter(models.Todo.user_id == user_id).all()

def get_todo(db: Session, todo_id: int):
    return db.query(models.Todo).filter(models.Todo.id == todo_id).first()

def create_todo(db: Session, todo, user_id: int):
    new_todo = models.Todo(
        **todo.model_dump(),
        user_id=user_id
    )
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo

def update_todo(db: Session, todo_id: int, data, user_id: int):
    todo = db.query(models.Todo).filter(
        models.Todo.id == todo_id,
        models.Todo.user_id == user_id
    ).first()

    if not todo:
        return None

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(todo, key, value)

    db.commit()
    db.refresh(todo)
    return todo

def delete_todo(db: Session, todo_id: int, user_id: int):
    db_todo = get_todo(db, todo_id)
    if not db_todo:
        return None
    # Проверка, что пользователь удаляет только свою задачу
    if hasattr(db_todo, "user_id") and db_todo.user_id != user_id:
        return None
    db.delete(db_todo)
    db.commit()
    return db_todo

# Verification code logic
def create_verification_code(db: Session, user_id: int, email: str) -> models.VerificationCode:
    """
    Создать или обновить верификационный код для пользователя
    """
    # Сначала пытаемся найти существующий код
    existing_code = db.query(models.VerificationCode).filter(
        models.VerificationCode.user_id == user_id
    ).first()

    # Генерируем новый код
    code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

    if existing_code:
        # Обновляем существующий код
        existing_code.code = code
        existing_code.expires_at = expires_at
        existing_code.created_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(existing_code)
        return existing_code
    else:
        # Создаем новый код
        db_code = models.VerificationCode(
            user_id=user_id,
            user_type="user",
            verification_type="email",
            value=email,
            code=code,
            expires_at=expires_at,
            created_at = datetime.now(timezone.utc)
        )
        db.add(db_code)
        db.commit()
        db.refresh(db_code)
        return db_code

def verify_code(db: Session, user_id: int, code: str):
    vc = db.query(models.VerificationCode).filter(
        models.VerificationCode.user_id == user_id,
        models.VerificationCode.code == code,
        models.VerificationCode.expires_at > datetime.utcnow()
    ).first()
    return bool(vc)
