import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "./SignUp.module.css";
import logo from "/assets/logo.png";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={styles.title}>Создайте новый аккаунт</span>
        <span className={styles.description}>
          Для использования Tickt, пожалуйста, зарегистрируйтесь
        </span>
        <div className={styles.form}>
          <div className={styles.formItem}>
            <span className={styles.formItemTitle}>ИМЯ</span>
            <input
              name="name"
              type="text"
              className={styles.formItemInput}
              placeholder="Капибара чилловая"
            />
          </div>
          <div className={styles.formItem}>
            <span className={styles.formItemTitle}>EMAIL</span>
            <input
              name="email"
              type="email"
              className={styles.formItemInput}
              placeholder="kapibarachillovaya@mail.ru"
            />
          </div>
          <div className={styles.formItem}>
            <span className={styles.formItemTitle}>ПАРОЛЬ</span>
            <div className={styles.passwordInputWrapper}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className={styles.formItemInput}
                placeholder="123123123"
                style={{ width: "100%" }}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
        <button className={styles.submitButton}>Зарегистрироваться</button>
        <img src={logo} alt="logo" className={styles.logo} />
        <span className={styles.footerText}>
          Уже зарегистрированы?{" "}
          <a href="/sign-in" className={styles.footerTextLink}>
            Войти
          </a>
        </span>
      </div>
    </div>
  );
};

export default SignUp;
