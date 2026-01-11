import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "./SignUp.module.css";
import logo from "/assets/logo.png";
import { register, sendVerification } from "../../api/auth";
import VerificationModal from "./VerificationModal";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await register(email, password);
      setUserId(user.id);

      // Отправляем код верификации
      try {
        await sendVerification(email);
        setIsVerificationModalOpen(true);
        toast.success("Код подтверждения отправлен на вашу почту");
      } catch {
        toast.error("Не удалось отправить код. Попробуйте войти позже.");
        navigate("/sign-in");
      }
    } catch (err) {
      if (err.response?.status === 400) {
        const errorMessage =
          err.response.data?.detail || "Email уже зарегистрирован";
        toast.error(errorMessage);
      } else if (err.response?.data?.detail) {
        toast.error(err.response.data.detail);
      } else {
        toast.error("Произошла ошибка при регистрации. Попробуйте снова.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationClose = () => {
    setIsVerificationModalOpen(false);
    navigate("/sign-in");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={styles.title}>Создайте новый аккаунт</span>
        <span className={styles.description}>
          Для использования Tickt, пожалуйста, зарегистрируйтесь
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
                minLength={6}
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
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>
        <img src={logo} alt="logo" className={styles.logo} />
        <span className={styles.footerText}>
          Уже зарегистрированы?{" "}
          <a href="/sign-in" className={styles.footerTextLink}>
            Войти
          </a>
        </span>
      </div>
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={handleVerificationClose}
        userId={userId}
        email={email}
      />
    </div>
  );
};

export default SignUp;
