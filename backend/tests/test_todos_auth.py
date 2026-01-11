from fastapi.testclient import TestClient

def test_get_todos_unauthorized(client: TestClient):
    """Попытка получить задачи без токена должна вернуть 401"""
    response = client.get("/todos/")  # без токена
    assert response.status_code == 401

def test_create_todo_unauthorized(client: TestClient):
    """Попытка создать задачу без токена должна вернуть 401"""
    response = client.post(
        "/todos/",
        json={"title": "Should not work"}
    )
    assert response.status_code == 401
