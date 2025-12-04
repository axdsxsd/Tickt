from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import crud, auth as auth_utils, schemas
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=schemas.UserOut)
def register(data: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    user = crud.create_user(db, data.email, data.password)
    return user

@router.post("/login", response_model=schemas.Token)
def login(data: schemas.UserCreate, response: Response, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, data.email, data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    payload = {"sub": str(user.id), "email": user.email}
    access = auth_utils.create_access_token(payload)
    refresh = auth_utils.create_refresh_token(payload)
    # Optionally set refresh token as HttpOnly cookie:
    response.set_cookie("refresh_token", refresh, httponly=True, samesite="lax")
    return {"access_token": access, "refresh_token": refresh}

@router.post("/refresh", response_model=schemas.Token)
def refresh(response: Response, refresh_token: str | None = Cookie(None), db: Session = Depends(get_db)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = auth_utils.decode_token(refresh_token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Token is not refresh type")
    user = crud.get_user_by_email(db, payload.get("email"))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    new_access = auth_utils.create_access_token({"sub": str(user.id), "email": user.email})
    new_refresh = auth_utils.create_refresh_token({"sub": str(user.id), "email": user.email})
    response.set_cookie("refresh_token", new_refresh, httponly=True, samesite="lax")
    return {"access_token": new_access, "refresh_token": new_refresh}

@router.post("/logout")
def logout(response: Response):
    # clear cookie
    response.delete_cookie("refresh_token")
    return {"msg": "Logged out"}