from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    avatar_id = Column(Integer, ForeignKey("images.id"), nullable=True)

    # Явно указываем foreign_keys для relationships
    images = relationship(
        "Image",
        back_populates="user",
        foreign_keys="[Image.user_id]"  # Добавьте эту строку
    )

    avatar = relationship(
        "Image",
        foreign_keys=[avatar_id],
        uselist=False,
        post_update=True  # Может потребоваться для циклических зависимостей
    )

    verification_code = relationship(
        "VerificationCode",
        back_populates="user",
        uselist=False,
        cascade="all, delete"
    )

class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True)
    path = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user = relationship("User", back_populates="images", foreign_keys=[user_id])

class VerificationCode(Base):
    __tablename__ = "verification_codes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    user_type = Column(String, default="user")

    verification_type = Column(String, default="email")
    value = Column(String)
    code = Column(String)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="verification_code")