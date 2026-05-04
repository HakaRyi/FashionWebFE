import { useState } from "react";
import { LoginForm, RegisterForm, styles } from "@/features/auth";
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function AuthenticationPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <GoogleOAuthProvider clientId="851461803179-us2iqf5s9ttu59jp68462qckp10u91q4.apps.googleusercontent.com" language="en">
      <div className={styles["auth-container"]}>

        <div className={styles["auth-visual"]}>
          <div className={styles.overlay}>
            <p>The Art of Style</p>
            <h1>Into<br />Elegance</h1>
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
    </GoogleOAuthProvider>
  );
}