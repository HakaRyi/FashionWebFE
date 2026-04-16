import { useRegister } from "../hooks/useRegister";
import { Toaster } from "react-hot-toast";
import styles from "../styles/Authentication.module.scss";

export default function RegisterForm({ onSwitchMode }) {
  const {
    formData, otpCode, setOtpCode, errors, isLoading,
    isStepVerify, handleChange, handleRegisterSubmit, handleVerifySubmit
  } = useRegister(onSwitchMode);

  if (isStepVerify) {
    return (
      <div className={styles["form-box"]}>
        <Toaster position="top-center" reverseOrder={false} />
        <h2>VERIFY EMAIL</h2>
        <span className={styles.subtitle}>
          Enter the code sent to <strong>{formData.email}</strong>
        </span>

        <form onSubmit={handleVerifySubmit} noValidate>
          <div className={styles["input-group"]}>
            <input
              className={styles["otp-input"]}
              type="text"
              placeholder="000000"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
              maxLength={6}
            />
          </div>

          <button type="submit" className={styles["btn-submit"]} disabled={isLoading}>
            {isLoading ? "VERIFYING..." : "CONFIRM"}
          </button>
        </form>

        <div className={styles["switch-mode"]}>
          Didn't receive code?
          <button type="button" onClick={handleRegisterSubmit}>Resend</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles["form-box"]} ${Object.keys(errors).length > 0 ? styles.shake : ""}`}>
      <Toaster position="top-center" reverseOrder={false} />
      <h2>CREATE ACCOUNT</h2>
      <span className={styles.subtitle}>Join our exclusive community today.</span>

      <form onSubmit={handleRegisterSubmit} noValidate>
        <div className={styles["input-group"]}>
          <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
          {errors.username && <span className={styles["error-msg"]}>{errors.username}</span>}
        </div>

        <div className={styles["input-group"]}>
          <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
          {errors.email && <span className={styles["error-msg"]}>{errors.email}</span>}
        </div>

        <div className={styles["input-group"]}>
          <label className={styles["field-label"]}>Date of Birth</label>
          <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
          {errors.dateOfBirth && <span className={styles["error-msg"]}>{errors.dateOfBirth}</span>}
        </div>

        <div className={styles["input-group"]}>
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          {errors.password && <span className={styles["error-msg"]}>{errors.password}</span>}
        </div>

        <div className={styles["input-group"]}>
          <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <span className={styles["error-msg"]}>{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className={styles["btn-submit"]} disabled={isLoading}>
          {isLoading ? "PROCESSING..." : "REGISTER NOW"}
        </button>
      </form>

      <div className={styles["switch-mode"]}>
        Already have an account? <button onClick={onSwitchMode}>Login</button>
      </div>
    </div>
  );
}