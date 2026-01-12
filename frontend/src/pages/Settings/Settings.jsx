import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import mainStyles from "../Home/Home.module.css";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineLeft,
  AiOutlineSetting,
  AiOutlineUser,
  AiOutlineEdit,
  AiOutlineGlobal,
  AiOutlineInfoCircle,
  AiOutlineLock,
  AiOutlineStar,
  AiOutlineShareAlt,
  AiOutlineRight,
} from "react-icons/ai";
import styles from "./Settings.module.css";
import { getCurrentUser, uploadAvatar, getAvatarUrl } from "../../api/users";
import { logout } from "../../api/auth";

const Settings = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const loadUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Ошибка при загрузке данных пользователя:", error);
      if (error.response?.status === 401) {
        toast.error("Требуется авторизация");
        navigate("/sign-in");
      } else {
        toast.error("Не удалось загрузить данные пользователя");
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleBackClick = () => {
    navigate("/");
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith("image/")) {
      toast.error("Выберите файл изображения");
      return;
    }

    // Проверка размера (например, максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Размер файла не должен превышать 5MB");
      return;
    }

    try {
      setIsUploading(true);
      await uploadAvatar(file);
      // Обновляем данные пользователя
      await loadUserData();
      toast.success("Аватар успешно загружен");
    } catch (error) {
      console.error("Ошибка при загрузке аватара:", error);
      if (error.response?.status === 401) {
        toast.error("Требуется авторизация");
        navigate("/sign-in");
      } else {
        toast.error("Не удалось загрузить аватар");
      }
    } finally {
      setIsUploading(false);
      // Сбрасываем значение input для возможности повторной загрузки того же файла
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/sign-in");
      toast.success("Вы вышли из аккаунта");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      // В любом случае перенаправляем на страницу входа
      navigate("/sign-in");
    }
  };

  return (
    <div className={mainStyles.container}>
      <div className={mainStyles.wrapper}>
        <div
          className={mainStyles.header}
          style={{
            justifyContent: "flex-start",
          }}
        >
          <button
            className={mainStyles.settingsButton}
            onClick={handleBackClick}
            aria-label="Назад"
            style={{ marginLeft: "0" }}
          >
            <AiOutlineLeft size={32} />
          </button>
          <span className={mainStyles.headerTitle}>Профиль</span>
        </div>
        <div className={styles.content}>
          {isLoading ? (
            <div
              style={{
                color: "#fff",
                textAlign: "center",
                padding: "20px",
                opacity: 0.8,
              }}
            >
              Загрузка...
            </div>
          ) : (
            <div className={styles.userInfo}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <div
                className={styles.avatar}
                onClick={handleAvatarClick}
                style={{
                  cursor: isUploading ? "wait" : "pointer",
                  position: "relative",
                  opacity: isUploading ? 0.7 : 1,
                  overflow: "hidden",
                }}
              >
                {user?.avatar ? (
                  <img
                    src={getAvatarUrl(user.avatar)}
                    alt="Avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                    onError={(e) => {
                      // Если изображение не загрузилось, скрываем его
                      e.target.style.display = "none";
                    }}
                  />
                ) : null}
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    display: user?.avatar ? "none" : "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AiOutlineUser size={48} />
                </div>
                {isUploading && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "12px",
                      color: "#fff",
                      zIndex: 10,
                    }}
                  >
                    Загрузка...
                  </div>
                )}
              </div>
            </div>
          )}
          <div className={styles.settingsList}>
            <div className={styles.mainSettings}>
              <div className={styles.grid}>
                <span className={styles.rowTitle}>Имя</span>
                <span className={styles.rowValue}>
                  {user?.email?.split("@")[0] || "Пользователь"}
                </span>
                <span className={styles.rowTitle}>Email</span>
                <span className={styles.rowValue}>
                  {user?.email || "Нет email"}
                </span>
                <span className={styles.rowTitle}>Уведомления</span>
                <div
                  className={`${styles.switcher} ${
                    notificationsEnabled ? styles.switcherActive : ""
                  }`}
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                >
                  <div className={styles.switcherToggle}></div>
                </div>
              </div>
              <div
                className={styles.settingsItem}
                onClick={handleLogout}
                style={{
                  marginTop: "16px",
                  paddingTop: "16px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div className={styles.iconWrapper}>
                  <AiOutlineLock size={20} />
                </div>
                <span
                  className={styles.settingsText}
                  style={{ color: "#ff6b6b" }}
                >
                  Выйти из аккаунта
                </span>
                <AiOutlineRight size={20} className={styles.arrowIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
