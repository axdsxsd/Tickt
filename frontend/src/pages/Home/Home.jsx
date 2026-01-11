import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  AiOutlineSetting,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineRight,
} from "react-icons/ai";
import { MdCheck } from "react-icons/md";
import styles from "./Home.module.css";
import logo from "/assets/logo2.png";
import { getTodos, createTodo, updateTodo } from "../../api/todos";

const Home = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const handlePreviousDate = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDate = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const formatDate = (date) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("ru-RU", options);
  };

  // Функция для сравнения дат (только день, месяц, год, без времени)
  const isSameDate = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getUTCFullYear() === d2.getUTCFullYear() &&
      d1.getUTCMonth() === d2.getUTCMonth() &&
      d1.getUTCDate() === d2.getUTCDate()
    );
  };

  // Фильтрация задач по выбранной дате
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Если scheduled_date нет (null) - показываем задачу в любой день
      if (!task.scheduled_date) {
        return true;
      }
      // Если scheduled_date есть - показываем только в соответствующий день
      return isSameDate(task.scheduled_date, currentDate);
    });
  }, [tasks, currentDate]);

  // Загрузка задач при монтировании компонента
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const todos = await getTodos();
      setTasks(todos);
    } catch (error) {
      console.error("Ошибка при загрузке задач:", error);
      toast.error("Не удалось загрузить задачи");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskToggle = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      const updatedTask = await updateTodo(taskId, {
        title: task.title,
        is_completed: !task.is_completed,
      });
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === taskId ? updatedTask : t))
      );
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
      toast.error("Не удалось обновить задачу");
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      toast.error("Введите название задачи");
      return;
    }

    try {
      // Формируем scheduled_date как 12:00 UTC выбранного дня
      const scheduledDate = new Date(currentDate);
      scheduledDate.setUTCHours(12, 0, 0, 0); // 12:00:00 UTC
      const scheduledDateISO = scheduledDate.toISOString();

      const newTask = await createTodo(newTaskTitle.trim(), scheduledDateISO);
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setNewTaskTitle("");
      setIsAddingTask(false);
      toast.success("Задача добавлена");
    } catch (error) {
      console.error("Ошибка при создании задачи:", error);
      toast.error("Не удалось создать задачу");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>Tickt</span>
          <button
            className={styles.settingsButton}
            onClick={handleSettingsClick}
            aria-label="Настройки"
          >
            <AiOutlineSetting size={32} />
          </button>
        </div>
        <div className={styles.content}>
          <img src={logo} alt="logo" className={styles.logo} />
          <span className={styles.description}>
            Самое время распланировать свой день:)
          </span>
          {isAddingTask ? (
            <div style={{ width: "100%", display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleAddTask();
                  if (e.key === "Escape") {
                    setIsAddingTask(false);
                    setNewTaskTitle("");
                  }
                }}
                placeholder="Введите название задачи"
                style={{
                  flex: 1,
                  padding: "16px 14px",
                  borderRadius: "12px",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: 600,
                  backgroundColor: "#d5d5d5d9",
                  color: "#002701",
                  outline: "none",
                }}
                autoFocus
              />
              <button
                onClick={handleAddTask}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "#002818",
                  color: "#e2e2e2",
                  cursor: "pointer",
                }}
              >
                <MdCheck size={20} />
              </button>
            </div>
          ) : (
            <button
              className={styles.addButton}
              onClick={() => setIsAddingTask(true)}
            >
              <AiOutlinePlus size={32} />
            </button>
          )}
          <div className={styles.dateSelector}>
            <button
              className={styles.dateArrow}
              onClick={handlePreviousDate}
              aria-label="Предыдущая дата"
            >
              <AiOutlineLeft size={20} />
            </button>
            <span className={styles.dateText}>{formatDate(currentDate)}</span>
            <button
              className={styles.dateArrow}
              onClick={handleNextDate}
              aria-label="Следующая дата"
            >
              <AiOutlineRight size={20} />
            </button>
          </div>
          <div className={styles.tasksContainer}>
            {isLoading ? (
              <div
                style={{
                  color: "#fff",
                  textAlign: "center",
                  padding: "20px",
                  opacity: 0.8,
                }}
              >
                Загрузка задач...
              </div>
            ) : filteredTasks.length === 0 ? (
              <div
                style={{
                  color: "#fff",
                  textAlign: "center",
                  padding: "20px",
                  opacity: 0.8,
                }}
              >
                Нет задач на этот день. Добавьте первую!
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div className={styles.taskItem} key={task.id}>
                  <button
                    className={styles.taskItemButton}
                    onClick={() => handleTaskToggle(task.id)}
                    aria-label={
                      task.is_completed
                        ? "Отметить как невыполненную"
                        : "Отметить как выполненную"
                    }
                  >
                    {task.is_completed && (
                      <MdCheck size={20} className={styles.checkIcon} />
                    )}
                  </button>
                  <span
                    className={`${styles.taskItemText} ${
                      task.is_completed ? styles.taskItemTextCompleted : ""
                    }`}
                    style={{ flex: 1 }}
                  >
                    {task.title}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
