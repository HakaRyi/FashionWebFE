import { useState } from "react";
import { LoginForm, RegisterForm, styles } from "@/features/auth";

export default function AuthenticationPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles["auth-container"]}>

      <div className={styles["auth-visual"]}>
        <div className={styles.overlay}>
          <p>The Art of Style</p>
          <h1>Expert<br />Curation</h1>
        </div>
      </div>

      <section className={styles["auth-form-section"]}>
        {isLogin ? (
          <LoginForm onSwitchMode={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onSwitchMode={() => setIsLogin(true)} />
        )}
      </section>
    </div>
  );
}