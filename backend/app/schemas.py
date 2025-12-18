from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TodoBase(BaseModel):
    title: str
    description: str | None = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(TodoBase):
    is_completed: bool = False

class Todo(TodoBase):
    id: int
    is_completed: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }