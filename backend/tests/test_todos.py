import pytest
from fastapi.testclient import TestClient

@pytest.mark.usefixtures("client")
def test_create_todo(client: TestClient, auth_headers):
    """Создание новой задачи"""
    resp = client.post(
        "/todos/",
        json={"title": "My Todo"},
        headers=auth_headers
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "My Todo"
    assert "id" in data

def test_get_todos(client: TestClient, auth_headers):
    """Получение списка задач"""
    resp = client.get(
        "/todos/",
        headers=auth_headers
    )
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)

def test_update_todo(client: TestClient, auth_headers):
    """Обновление существующей задачи"""
    # Сначала создаем
    create_resp = client.post(
        "/todos/",
        json={"title": "Old Title"},
        headers=auth_headers
    )
    todo_id = create_resp.json()["id"]

    # Обновляем
    update_resp = client.put(
        f"/todos/{todo_id}",
        json={"title": "New Title"},
        headers=auth_headers
    )
    assert update_resp.status_code == 200
    data = update_resp.json()
    assert data["title"] == "New Title"

def test_delete_todo(client: TestClient, auth_headers):
    """Удаление задачи"""
    # Сначала создаем
    create_resp = client.post(
        "/todos/",
        json={"title": "Delete Todo"},
        headers=auth_headers
    )
    todo_id = create_resp.json()["id"]

    # Удаляем
    delete_resp = client.delete(
        f"/todos/{todo_id}",
        headers=auth_headers
    )
    assert delete_resp.status_code == 200
    # Можно проверить, что задача больше не существует
    get_resp = client.get(f"/todos/{todo_id}", headers=auth_headers)
    assert get_resp.status_code == 404
