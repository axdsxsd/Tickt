import React from "react";
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

const Settings = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
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
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <AiOutlineUser size={48} />
            </div>
            <span className={styles.userName}>Капибара чилловая</span>
            <span className={styles.userEmail}>kapibarachillovaya@mail.ru</span>
          </div>
          <div className={styles.settingsList}>
            <div className={styles.settingsItem}>
              <div className={styles.iconWrapper}>
                <AiOutlineEdit size={20} />
              </div>
              <span className={styles.settingsText}>Редактировать профиль</span>
              <AiOutlineRight size={20} className={styles.arrowIcon} />
            </div>

            <div className={styles.mainSettings}>
              <div className={styles.sectionHeader}>Основные настройки</div>

              <div className={styles.settingsItem}>
                <div className={styles.iconWrapper}>
                  <AiOutlineGlobal size={20} />
                </div>
                <span className={styles.settingsText}>Язык</span>
                <AiOutlineRight size={20} className={styles.arrowIcon} />
              </div>

              <div className={styles.settingsItem}>
                <div className={styles.iconWrapper}>
                  <AiOutlineInfoCircle size={20} />
                </div>
                <span className={styles.settingsText}>О приложении</span>
                <AiOutlineRight size={20} className={styles.arrowIcon} />
              </div>

              <div className={styles.settingsItem}>
                <div className={styles.iconWrapper}>
                  <AiOutlineLock size={20} />
                </div>
                <span className={styles.settingsText}>
                  Политика конфиденциальности
                </span>
                <AiOutlineRight size={20} className={styles.arrowIcon} />
              </div>

              <div className={styles.settingsItem}>
                <div className={styles.iconWrapper}>
                  <AiOutlineStar size={20} />
                </div>
                <span className={styles.settingsText}>Оценить приложение</span>
                <AiOutlineRight size={20} className={styles.arrowIcon} />
              </div>

              <div className={styles.settingsItem}>
                <div className={styles.iconWrapper}>
                  <AiOutlineShareAlt size={20} />
                </div>
                <span className={styles.settingsText}>
                  Поделиться приложением
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
