from fastapi import HTTPException, APIRouter, Depends
from sqlalchemy.orm import Session
from ..deps import get_current_user, get_db
from ..schemas import UserOut
from ..models import User, Image

from fastapi import UploadFile, File
from pathlib import Path
import shutil

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    avatar_path = current_user.avatar.path if current_user.avatar else None
    return UserOut(
        id=current_user.id,
        email=current_user.email,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at,
        avatar=avatar_path
    )

@router.post("/avatar")
def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    BASE_DIR = Path(__file__).resolve().parent.parent.parent

    images_dir = BASE_DIR / "images"
    images_dir.mkdir(exist_ok=True)

    img_path = images_dir / file.filename

    with open(img_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image = Image(
        path=f"/images/{file.filename}",
        user_id=current_user.id
    )
    db.add(image)
    db.commit()
    db.refresh(image)

    current_user.avatar_id = image.id
    db.commit()

    return {
        "msg": "Avatar uploaded",
        "avatar": image.path
    }