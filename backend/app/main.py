from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import todos, auth, users
from .config import settings
from fastapi.staticfiles import StaticFiles
from pathlib import Path

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=settings.APP_DESCRIPTION,
)

# ======================
# Настройка CORS
# ======================
origins = [
    "http://localhost:5173",  # Vite dev
    "http://127.0.0.1:5173",
    "http://localhost:4173",  # Vite preview
    "http://127.0.0.1:4173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # Разрешаем продовые фронтенд-домены easypanel.
    # Важно: при allow_credentials=True нельзя использовать allow_origins=["*"].
    allow_origin_regex=r"^https://[a-zA-Z0-9-]+\.easypanel\.host$",
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE
    allow_headers=["*"],  # все заголовки
)

# ======================
# Static files
# ======================
BASE_DIR = Path(__file__).resolve().parent.parent
app.mount("/images", StaticFiles(directory=BASE_DIR / "images"), name="images")

# ======================
# Routers
# ======================
app.include_router(auth.router)
app.include_router(todos.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {"message": "Welcome to Tickt API"}
