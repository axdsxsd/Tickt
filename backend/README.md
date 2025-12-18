# Tickt Backend

## Описание
Backend на **FastAPI** для проекта "Tickt".  

## Требования к окружению
- **Python 3.12.X**  
- PostgreSQL
- Виртуальное окружение рекомендуется использовать (.venv)

## Эндпоинты:

### Пользователи
- POST /auth/register — регистрация пользователя (требуется верификация email)
- POST /auth/login — вход пользователя, возвращает access и refresh токены
- POST /auth/refresh — обновление access токена через refresh токен
- POST /auth/logout — выход, удаляет refresh токен cookie

### Задачи (Todos)
- GET /todos — все задачи
- GET /todos/{id} — задача по ID
- POST /todos — создать задачу
- PUT /todos/{id} — обновить задачу
- DELETE /todos/{id} — удалить задачу

## Тестирование эндпоинтов

Для проверки работоспособности эндпоинтов **не требуется Postman** или другие приложения. FastAPI автоматически генерирует Swagger UI:

1. Запустите сервер
2. Откройте браузер и перейдите по адресу:
   http://127.0.0.1:8000/docs
3. В интерфейсе Swagger вы сможете:
   - Просматривать все доступные эндпоинты
   - Отправлять запросы и видеть ответы сервера
   - Вводить необходимые данные для POST/PUT запросов


---

## Технологии
- Python 3.10+
- FastAPI
- Uvicorn
- SQLAlchemy
- PostgreSQL
- Pydantic
- python-jose
- passlib[bcrypt]

---

## Функционал
- Хэширование паролей пользователей
- JWT аутентификация (access и refresh токены)
- Email verification через отдельную таблицу `verification_codes`
- Проверка email перед активацией аккаунта
---

Устанавливаем зависимости из requirements.txt:

```powershell
pip install -r backend/requirements.txt
```

---

## Как запустить сервер

1. Настрой БД. 
   В папке backend/ создай файл:
   backend/.env и скопируй в него содержимое из .env.example измени необходимые данные.

2. В терминале из корня проекта введи:
```powershell
uvicorn backend.app.main:app --reload
```

3. Чтобы остановить в терминале, где запущен сервер, нажми:
   CTRL + C

Сервер будет доступен: http://127.0.0.1:8000



