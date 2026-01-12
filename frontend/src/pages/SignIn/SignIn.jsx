import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../SignUp/SignUp.module.css";
import logo from "/assets/logo.png";
import { login } from "../../api/auth";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success("Вход выполнен успешно!");
      navigate("/");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Неверный email или пароль");
      } else if (err.response?.data?.detail) {
        toast.error(err.response.data.detail);
      } else {
        toast.error("Произошла ошибка при входе. Попробуйте снова.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={styles.title}>Вход в аккаунт</span>
        <span className={styles.description}>
          Введите ваш email и пароль для входа в приложение
        </span>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formItem}>
            <span className={styles.formItemTitle}>EMAIL</span>
            <input
              name="email"
              type="email"
              className={styles.formItemInput}
              placeholder="kapibarachillovaya@mail.ru"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Вход..." : "Вход"}
          </button>
        </form>
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
