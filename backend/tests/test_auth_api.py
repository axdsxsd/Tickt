import pytest
from fastapi.testclient import TestClient

def test_login_success(client: TestClient, test_user):
    """Успешный логин с правильными учетными данными"""
    response = client.post(
        "/auth/login",
        json={
            "email": test_user.email,
            "password": "password"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data

def test_login_wrong_password(client: TestClient, test_user):
    """Логин с неправильным паролем возвращает 401"""
    response = client.post(
        "/auth/login",
        json={
            "email": test_user.email,
            "password": "wrong-password"
        }
    )
    assert response.status_code == 401
    data = response.json()
    assert data["detail"] == "Invalid credentials"

def test_login_with_invalid_email(client: TestClient):
    """Логин с несуществующим email возвращает 401"""
    response = client.post(
        "/auth/login",
        json={"email": "wrong@example.com", "password": "password"}
    )
    assert response.status_code == 401
    data = response.json()
    assert data["detail"] == "Invalid credentials"
