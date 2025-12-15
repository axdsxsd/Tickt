from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random, string
from . import models, auth

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

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not auth.verify_password(password, user.hashed_password):
        return None
    return user

def get_todos(db: Session):
    return db.query(models.Todo).all()

def get_todo(db: Session, todo_id: int):
    return db.query(models.Todo).filter(models.Todo.id == todo_id).first()

def create_todo(db: Session, todo):
    new_todo = models.Todo(**todo.dict())
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo

def update_todo(db: Session, todo_id: int, todo):
    db_todo = get_todo(db, todo_id)
    if not db_todo:
        return None
    for key, value in todo.dict().items():
        setattr(db_todo, key, value)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def delete_todo(db: Session, todo_id: int):
    db_todo = get_todo(db, todo_id)
    if not db_todo:
        return None
    db.delete(db_todo)
    db.commit()
    return db_todo

# Verification code logic
def create_verification_code(db: Session, user_id: int, email: str, minutes_valid: int = 15):
    code = "".join(random.choices(string.digits, k=6))
    expires_at = datetime.utcnow() + timedelta(minutes=minutes_valid)
    vc = models.VerificationCode(user_id=user_id, value=email, code=code, expires_at=expires_at)
    db.add(vc)
    db.commit()
    db.refresh(vc)
    return vc

def verify_code(db: Session, user_id: int, code: str):
    vc = db.query(models.VerificationCode).filter(
        models.VerificationCode.user_id == user_id,
        models.VerificationCode.code == code,
        models.VerificationCode.expires_at > datetime.utcnow()
    ).first()
    return bool(vc)
