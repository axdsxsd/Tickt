from fastapi import FastAPI
from .routers import todos, auth
from .database import Base, engine
from .config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=settings.APP_DESCRIPTION,
)

# Создаём таблицы
Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(todos.router)

@app.get("/")
def root():
    return {"message": "Welcome to Tickt API"}
