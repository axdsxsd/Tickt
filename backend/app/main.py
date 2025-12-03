from fastapi import FastAPI
from .routers import todos
from .database import Base, engine

app = FastAPI(
    title="Tickt",
    version="0.2",
    description="Backend service for Tickt project."
)

Base.metadata.create_all(bind=engine)

app.include_router(todos.router)

@app.get("/")
def root():
    return {"message": "Welcome to Tickt API"}