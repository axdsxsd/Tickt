from fastapi.testclient import TestClient
from app.auth import create_access_token

def test_get_me(client: TestClient, test_user):
    """Получение информации о текущем пользователе"""
    payload = {"sub": str(test_user.id), "email": test_user.email}
    token = create_access_token(payload)

    response = client.get(
        "/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == test_user.id
    assert data["email"] == test_user.email

def test_upload_avatar(client: TestClient, test_user, tmp_path, db_session):
    """Загрузка аватара пользователя"""
    file_path = tmp_path / "avatar.png"
    file_path.write_bytes(b"fake image bytes")

    with open(file_path, "rb") as f:
        response = client.post(
            "/users/avatar",
            headers={
                "Authorization": f"Bearer {create_access_token({'sub': str(test_user.id), 'email': test_user.email})}"
            },
            files={"file": ("avatar.png", f, "image/png")}
        )

    assert response.status_code == 200
    data = response.json()
    assert "avatar" in data

    # Обновляем пользователя из БД
    db_session.refresh(test_user)
    assert test_user.avatar_id is not None

def test_upload_invalid_avatar(client: TestClient, auth_headers, tmp_path):
    """Попытка загрузить не изображение должна вернуть 400"""
    file_path = tmp_path / "avatar.txt"
    file_path.write_bytes(b"not an image")

    with open(file_path, "rb") as f:
        response = client.post(
            "/users/avatar",
            headers=auth_headers,
            files={"file": ("avatar.txt", f, "text/plain")}
        )

    assert response.status_code == 400
