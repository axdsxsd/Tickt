import axios from "axios";

// В режиме разработки используем прокси через Vite (/api)
// В продакшене используем переменную окружения или /api
const API_URL = import.meta.env.VITE_API_URL || "/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Для работы с HttpOnly cookies
});

// Флаг для предотвращения бесконечных циклов при обновлении токена
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Интерцептор для запросов - добавляет токен авторизации
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для ответов - автоматическое обновление токена при 401
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не запрос на обновление токена
    // Проверяем, что это не сам refresh запрос (чтобы избежать бесконечного цикла)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest._isRefreshRequest
    ) {
      if (isRefreshing) {
        // Если уже идет обновление токена, добавляем запрос в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Пытаемся обновить токен
        // Используем axiosInstance, чтобы избежать двойного /api в URL
        // Добавляем метку, чтобы не пытаться обновить токен при обновлении токена
        const refreshConfig = {
          url: "/auth/refresh",
          method: "post",
          data: {},
          _isRefreshRequest: true, // Метка для предотвращения рекурсии
        };
        const response = await axiosInstance(refreshConfig);

        const { access_token } = response.data;
        // Сохраняем только access_token
        // refresh_token остается в HttpOnly cookie (обновляется на бэкенде)
        localStorage.setItem("access_token", access_token);

        processQueue(null, access_token);

        // Повторяем оригинальный запрос с новым токеном
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh токен тоже истек (401) или другая ошибка - нужен новый логин
        processQueue(refreshError, null);
        localStorage.removeItem("access_token");
        // refresh_token cookie удалится на бэкенде автоматически

        // Если это 401 от refresh, сразу редиректим на страницу входа
        if (refreshError.response?.status === 401) {
          if (window.location.pathname !== "/sign-in") {
            window.location.href = "/sign-in";
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Если это 401 от самого refresh запроса - редиректим на sign-in
    if (error.response?.status === 401 && error.config?._isRefreshRequest) {
      localStorage.removeItem("access_token");
      if (window.location.pathname !== "/sign-in") {
        window.location.href = "/sign-in";
      }
      return Promise.reject(error);
    }

    // Обработка других ошибок
    if (error.response) {
      console.error(
        "Ошибка ответа:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("Ошибка запроса:", error.request);
    } else {
      console.error("Ошибка:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
export { API_URL };
