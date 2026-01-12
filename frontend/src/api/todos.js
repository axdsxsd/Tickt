import axiosInstance from "./axios.config.js";

/**
 * Получить все задачи
 * @returns {Promise<Array>} Массив задач
 */
export const getTodos = async () => {
  const response = await axiosInstance.get("/todos/");
  return response.data;
};

/**
 * Получить задачу по ID
 * @param {number} todoId - ID задачи
 * @returns {Promise<Object>} Данные задачи
 */
export const getTodo = async (todoId) => {
  const response = await axiosInstance.get(`/todos/${todoId}`);
  return response.data;
};

/**
 * Создать новую задачу
 * @param {string} title - Заголовок задачи
 * @param {Date|string} scheduledDate - Дата выполнения задачи (12:00 UTC выбранного дня)
 * @returns {Promise<Object>} Созданная задача
 */
export const createTodo = async (title, scheduledDate) => {
  const response = await axiosInstance.post("/todos/", {
    title,
    scheduled_date: scheduledDate,
  });
  return response.data;
};

/**
 * Обновить задачу
 * @param {number} todoId - ID задачи
 * @param {Object} data - Данные для обновления (title, is_completed)
 * @returns {Promise<Object>} Обновленная задача
 */
export const updateTodo = async (todoId, data) => {
  const response = await axiosInstance.put(`/todos/${todoId}`, data);
  return response.data;
};

/**
 * Удалить задачу
 * @param {number} todoId - ID задачи
 * @returns {Promise<Object>} Результат удаления
 */
export const deleteTodo = async (todoId) => {
  const response = await axiosInstance.delete(`/todos/${todoId}`);
  return response.data;
};
