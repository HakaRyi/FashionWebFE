import { useState } from "react";
import { useRegister } from "../hooks/useRegister";
import { validateAuthForm } from "../utils/validateAuthForm";
import styles from "../styles/Authentication.module.scss";

export default function RegisterForm({ onSwitchMode }) {
  const { handleRegister } = useRegister();
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateAuthForm(formData, false);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await handleRegister(formData);
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      onSwitchMode();
    } catch (error) {
      setErrors({
        server: error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!"
      });
    } finally {
      setIsLoading(false);
    }
};

return (
  <div className={`${styles["form-box"]} ${Object.keys(errors).length > 0 ? styles.shake : ""}`}>
    <h2>CREATE ACCOUNT</h2>
    <span className={styles.subtitle}>Join our exclusive community today.</span>

    <form onSubmit={handleSubmit}>
      <div className={styles["input-group"]}>
        <input
          name="email"
          placeholder="Email Address"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && <span className={styles["error-msg"]}>{errors.email}</span>}
      </div>

      <div className={styles["input-group"]}>
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        {errors.password && <span className={styles["error-msg"]}>{errors.password}</span>}
      </div>

      {errors.server && (
          <div style={{
            color: '#ff4d4f',
            backgroundColor: '#fff2f0',
            border: '1px solid #ffccc7',
            padding: '8px 12px',
            borderRadius: '4px',
            marginBottom: '15px',
            fontSize: '13px',
            textAlign: 'center'
          }}>
            {errors.server}
          </div>
        )}

      <button type="submit" className={styles["btn-submit"]}>
        REGISTER NOW
      </button>
    </form>

    <div className={styles["switch-mode"]}>
      Already have an account? <button onClick={onSwitchMode}>Login</button>
    </div>
  </div>
);
}