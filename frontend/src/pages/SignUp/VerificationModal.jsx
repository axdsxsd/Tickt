import { useState } from "react";
import { toast } from "react-toastify";
import styles from "./VerificationModal.module.css";
import { verify, sendVerification } from "../../api/auth";

const VerificationModal = ({ isOpen, onClose, userId, email }) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (code.length !== 6) {
      toast.error("Код должен содержать 6 цифр");
      return;
    }

    setIsLoading(true);

    try {
      await verify(userId, code);
      toast.success("Email успешно подтвержден!");
      onClose();
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error("Неверный или истекший код");
      } else if (err.response?.data?.detail) {
        toast.error(err.response.data.detail);
      } else {
        toast.error("Произошла ошибка при верификации. Попробуйте снова.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await sendVerification(email);
      toast.success("Код отправлен повторно на вашу почту");
    } catch {
      toast.error("Не удалось отправить код. Попробуйте снова.");
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Только цифры
    if (value.length <= 6) {
      setCode(value);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <span className={styles.title}>Подтверждение email</span>
          <span className={styles.description}>
            Мы отправили 6-значный код на {email}
          </span>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formItem}>
              <span className={styles.formItemTitle}>КОД ПОДТВЕРЖДЕНИЯ</span>
              <input
                type="text"
                className={styles.codeInput}
                placeholder="000000"
                value={code}
                onChange={handleCodeChange}
                maxLength={6}
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? "Проверка..." : "Подтвердить"}
            </button>
          </form>
          <button
            type="button"
            className={styles.resendButton}
            onClick={handleResendCode}
            disabled={isResending}
          >
            {isResending ? "Отправка..." : "Отправить код повторно"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
