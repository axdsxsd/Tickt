import pytest
from fastapi.testclient import TestClient

def test_create_todo_empty_title(client: TestClient, auth_headers):
    """Создание задачи с пустым заголовком должно возвращать 422"""
    response = client.post(
        "/todos/",
        headers=auth_headers,
        json={"title": ""}
    )
    assert response.status_code == 422

def test_create_todo_too_long_title(client: TestClient, auth_headers):
    """Создание задачи со слишком длинным заголовком должно возвращать 422"""
    long_title = "A" * 300  # слишком длинный заголовок
    response = client.post(
        "/todos/",
        headers=auth_headers,
        json={"title": long_title}
    )
    assert response.status_code == 422

def test_update_nonexistent_todo(client: TestClient, auth_headers):
    """Попытка обновить несуществующую задачу должна вернуть 404"""
    response = client.put(
        "/todos/99999",  # несуществующий id
        headers=auth_headers,
        json={"title": "New title"}
    )
    assert response.status_code == 404
