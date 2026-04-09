import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { validateAuthForm } from "../utils/validateAuthForm";
import styles from "../styles/Authentication.module.scss";

export default function LoginForm({ onSwitchMode }) {
  const { handleLogin } = useLogin();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validateAuthForm(formData, true);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await handleLogin(formData.email, formData.password);
    } catch (error) {
      setErrors({
        server: error.response?.data?.message || "Email hoặc mật khẩu không chính xác!"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles["form-box"]} ${Object.keys(errors).length > 0 ? styles.shake : ""}`}>
      <h2>SIGN IN</h2>
      <span className={styles.subtitle}>Welcome back. Please enter your details.</span>

      <form onSubmit={handleSubmit}>
        <div className={styles["input-group"]}>
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className={errors.email ? styles["input-error"] : ""}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <span className={styles["error-msg"]}>{errors.email}</span>}
        </div>

        <div className={styles["input-group"]}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={errors.password ? styles["input-error"] : ""}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button
            type="button"
            className={styles["password-toggle"]}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "HIDE" : "SHOW"}
          </button>
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

        <button type="submit" className={styles["btn-submit"]} disabled={isLoading}>
          {isLoading ? <div className={styles.spinner}></div> : "LOGIN TO ACCOUNT"}
        </button>
      </form>

      <div className={styles["switch-mode"]}>
        Don't have an account? <button onClick={onSwitchMode}>Register</button>
      </div>
    </div>
  );
}