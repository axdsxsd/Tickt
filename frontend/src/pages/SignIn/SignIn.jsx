import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../SignUp/SignUp.module.css";
import logo from "/assets/logo.png";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={styles.title}>Вход в аккаунт</span>
        <span className={styles.description}>
          Введите ваш email и пароль для входа в приложение
        </span>
        <div className={styles.form}>
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
        <button className={styles.submitButton}>Вход</button>
        <img src={logo} alt="logo" className={styles.logo} />
        <span className={styles.footerText}>
          Нет аккаунта?{" "}
          <a href="/sign-up" className={styles.footerTextLink}>
            Зарегистрироваться
          </a>
        </span>
      </div>
    </div>
  );
};

export default SignIn;
