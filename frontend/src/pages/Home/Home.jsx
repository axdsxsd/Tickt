import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineSetting,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineRight,
} from "react-icons/ai";
import { MdCheck } from "react-icons/md";
import styles from "./Home.module.css";
import logo from "/assets/logo2.png";

const Home = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Доделать проект",
      is_completed: false,
    },
    {
      id: 2,
      title: "Купить продукты",
      is_completed: true,
    },
    {
      id: 3,
      title: "Позвонить другу",
      is_completed: false,
    },
    {
      id: 4,
      title: "Посмотреть фильм",
      is_completed: true,
    },
    {
      id: 5,
      title: "Почитать книгу",
      is_completed: true,
    },
    {
      id: 6,
      title: "Пойти на пробежку",
      is_completed: false,
    },
    {
      id: 7,
      title: "Почитать книгу",
      is_completed: false,
    },
    {
      id: 8,
      title: "Почитать книгу",
      is_completed: false,
    },
    {
      id: 9,
      title: "Почитать книгу",
      is_completed: false,
    },
    {
      id: 10,
      title: "Почитать книгу",
      is_completed: false,
    },
    {
      id: 11,
      title: "Почитать книгу",
      is_completed: false,
    },
    {
      id: 12,
      title: "Почитать книгу",
      is_completed: false,
    },
    {
      id: 13,
      title: "Почитать книгу",
      is_completed: false,
    },
    {
      id: 14,
      title: "Почитать книгу",
      is_completed: false,
    },
    {
      id: 15,
      title: "Почитать книгу",
      is_completed: false,
    },
  ]);

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

  const handleTaskToggle = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, is_completed: !task.is_completed }
          : task
      )
    );
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
          <button className={styles.addButton}>
            <AiOutlinePlus size={32} />
          </button>
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
            {tasks.map((task) => (
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
                >
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
