from fastapi import FastAPI
from .routers import todos, auth, users
from .database import Base, engine
from .config import settings
from fastapi.staticfiles import StaticFiles
from pathlib import Path



app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=settings.APP_DESCRIPTION,
)

BASE_DIR = Path(__file__).resolve().parent.parent
app.mount("/images", StaticFiles(directory=BASE_DIR / "images"), name="images")

# Создаём таблицы
Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(todos.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {"message": "Welcome to Tickt API"}
