from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    is_verified: bool
    created_at: datetime
    avatar: Optional[str] = None

    model_config = {"from_attributes": True}

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TodoBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)  # теперь не пустая строка
    scheduled_date: Optional[datetime] = None

class TodoCreate(TodoBase):
    pass  # наследуем title с валидацией

class TodoUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)  # если передан, то не пустой
    is_completed: Optional[bool] = None
    scheduled_date: Optional[datetime] = None

class TodoOut(BaseModel):
    id: int
    title: str
    is_completed: bool
    scheduled_date: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}