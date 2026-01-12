import pytest
from jose import JWTError
from app import auth as auth_utils


def test_password_hashing():
    """Проверка хэширования и верификации пароля"""
    password = "mysecret"
    hashed = auth_utils.hash_password(password)

    assert auth_utils.verify_password(password, hashed)
    assert not auth_utils.verify_password("wrong", hashed)


def test_create_and_decode_access_token(test_user):
    """Создание и декодирование access token"""
    payload = {"sub": str(test_user.id), "email": test_user.email}
    token = auth_utils.create_access_token(payload)
    decoded = auth_utils.decode_token(token)

    assert decoded["sub"] == str(test_user.id)
    assert decoded["email"] == test_user.email
    assert decoded["type"] == "access"


def test_create_and_decode_refresh_token(test_user):
    """Создание и декодирование refresh token"""
    payload = {"sub": str(test_user.id), "email": test_user.email}
    token = auth_utils.create_refresh_token(payload)
    decoded = auth_utils.decode_token(token)

    assert decoded["sub"] == str(test_user.id)
    assert decoded["email"] == test_user.email
    assert decoded["type"] == "refresh"


def test_invalid_token_raises_error():
    """Проверка ошибки при декодировании некорректного токена"""
    with pytest.raises(JWTError):
        auth_utils.decode_token("invalid.token")
