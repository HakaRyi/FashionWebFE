import styles from "../styles/Dashboard.module.scss";

function DashboardHeader() {
  return (
    <div className={styles.header}>
      <div>
        <h2>Tổng Quan</h2>
        <p style={{ color: "var(--text-muted)" }}>
          Chào mừng trở lại, Admin!
        </p>
      </div>

      <div className={styles.userProfile}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: "bold" }}>Admin User</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Super Admin
          </div>
        </div>

        <div className={styles.avatar}>A</div>
      </div>
    </div>
  );
}

export default DashboardHeader;