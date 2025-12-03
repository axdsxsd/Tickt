from pydantic import BaseModel
from datetime import datetime

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