import { useState } from "react";
import { useRegister } from "../hooks/useRegister";
import { validateAuthForm } from "../utils/validateAuthForm";
import styles from "../styles/Authentication.module.scss";

export default function RegisterForm({ onSwitchMode }) {
  const { handleRegister } = useRegister();
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateAuthForm(formData, false);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await handleRegister(formData);
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
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          {errors.email && <span className={styles["error-msg"]}>{errors.email}</span>}
        </div>

        <div className={styles["input-group"]}>
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          {errors.password && <span className={styles["error-msg"]}>{errors.password}</span>}
        </div>

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