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
    "https://army-tickt-frontend.3zasdl.easypanel.host",  # твой продовый фронтенд
    "http://localhost:5173",  # dev фронтенд локально (если нужно)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
