import axiosInstance from "./axios.config.js";

/**
 * Регистрация нового пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль пользователя
 * @returns {Promise<Object>} Данные пользователя
 */
export const register = async (email, password) => {
  const response = await axiosInstance.post("/auth/register", {
    email,
    password,
  });
  return response.data;
};

/**
 * Вход в систему
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль пользователя
 * @returns {Promise<Object>} Токены доступа
 */
export const login = async (email, password) => {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password,
  });

  const { access_token } = response.data;

  // Сохраняем только access_token в localStorage
  // refresh_token автоматически устанавливается в HttpOnly cookie на бэкенде
  localStorage.setItem("access_token", access_token);

  return response.data;
};

/**
 * Выход из системы
 * @returns {Promise<Object>} Сообщение об успешном выходе
 */
export const logout = async () => {
  try {
    await axiosInstance.post("/auth/logout");
    // Бэкенд удалит refresh_token cookie автоматически
  } catch (error) {
    console.error("Ошибка при выходе:", error);
  } finally {
    // Удаляем только access_token на фронте
    // refresh_token cookie удаляется на бэкенде
    localStorage.removeItem("access_token");
  }
};

/**
 * Обновление access токена
 * @returns {Promise<Object>} Новые токены
 */
export const refreshToken = async () => {
  // Используем axiosInstance, чтобы избежать двойного /api в URL
  const response = await axiosInstance.post("/auth/refresh", {});

  const { access_token } = response.data;
  // Сохраняем только access_token
  // refresh_token остается в HttpOnly cookie (обновляется на бэкенде)
  localStorage.setItem("access_token", access_token);

  return response.data;
};

/**
 * Отправка кода верификации на email
 * @param {string} email - Email пользователя
 * @returns {Promise<Object>} Сообщение и код (в тестовом режиме)
 */
export const sendVerification = async (email) => {
  const response = await axiosInstance.post("/auth/send_verification", null, {
    params: { email },
  });
  return response.data;
};

/**
 * Верификация пользователя по коду
 * @param {number} userId - ID пользователя
 * @param {string} code - Код верификации
 * @returns {Promise<Object>} Сообщение об успешной верификации
 */
export const verify = async (userId, code) => {
  const response = await axiosInstance.post("/auth/verify", null, {
    params: { user_id: userId, code },
  });
  return response.data;
};

/**
 * Проверка наличия токена доступа
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

/**
 * Получение токена доступа
 * @returns {string|null}
 */
export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};
