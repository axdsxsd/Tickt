from pydantic import BaseModel, EmailStr
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
    title: str
    description: str | None = None

class TodoCreate(BaseModel):
    title: str
    scheduled_date: Optional[datetime] = None

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    is_completed: Optional[bool] = None
    scheduled_date: Optional[datetime] = None

class TodoOut(BaseModel):
    id: int
    title: str
    is_completed: bool
    scheduled_date: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}