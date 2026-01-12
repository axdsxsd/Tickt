import axiosInstance from "./axios.config.js";
import { API_URL } from "./axios.config.js";

/**
 * Получить информацию о текущем пользователе
 * @returns {Promise<Object>} Данные пользователя
 */
export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/users/me");
  return response.data;
};

/**
 * Загрузить аватар пользователя
 * @param {File} file - Файл изображения
 * @returns {Promise<Object>} Результат загрузки с путем к аватару
 */
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post("/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Получить полный URL аватара
 * @param {string|null} avatarPath - Путь к аватару (например, "/images/avatar.jpg")
 * @returns {string|null} Полный URL или null
 */
export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return null;
  // Если путь уже полный URL, возвращаем как есть
  if (avatarPath.startsWith("http")) return avatarPath;
  // В dev режиме используем прокси vite (относительный путь)
  // В продакшене используем API_URL из конфига
  const baseUrl = import.meta.env.DEV ? "" : API_URL;
  return `${baseUrl}${avatarPath}`;
};
