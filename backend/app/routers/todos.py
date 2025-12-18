from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import crud, schemas

router = APIRouter(prefix="/todos", tags=["Todos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[schemas.Todo])
def read_todos(db: Session = Depends(get_db)):
    return crud.get_todos(db)


@router.get("/{todo_id}", response_model=schemas.Todo)
def read_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = crud.get_todo(db, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.post("/", response_model=schemas.Todo)
def create(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    return crud.create_todo(db, todo)


@router.put("/{todo_id}", response_model=schemas.Todo)
def update(todo_id: int, data: schemas.TodoUpdate, db: Session = Depends(get_db)):
    updated = crud.update_todo(db, todo_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Todo not found")
    return updated


@router.delete("/{todo_id}")
def delete(todo_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_todo(db, todo_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"status": "deleted"}
