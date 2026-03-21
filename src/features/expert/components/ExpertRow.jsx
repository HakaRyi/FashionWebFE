import styles from "../styles/Expert.module.scss";
import { FaIdCard } from "react-icons/fa";

function ExpertRow({ expert, onView }) {
  // Chuẩn hóa status về chữ thường để khớp với class SCSS (&.pending, &.approved, ...)
  const status = expert.expertFile?.status || "Pending";
  const statusClass = status.toLowerCase();

  return (
    <tr>
      <td>
        <div className={styles.userCell}>
          <div className={styles.avatar}>
            {/* Lấy chữ cái đầu của tên làm Avatar */}
            {(expert.account?.userName || "E").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className={styles.name}>{expert.account?.userName}</div>
            <div className={styles.sub}>ID: #{expert.expertProfileId}</div>
          </div>
        </div>
      </td>

      <td>
        <div className={styles.name}>{expert.expertiseField}</div>
      </td>

      <td>
        {new Date(expert.createdAt).toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}
      </td>

      <td>
        <span className={`${styles.statusBadge} ${styles[statusClass]}`}>
          {status}
        </span>
      </td>

      <td>
        <div className={styles.actionBtns}>
          <button 
            className={styles.btnView} 
            onClick={() => onView(expert)}
          >
            <FaIdCard /> Chi tiết
          </button>
        </div>
      </td>
    </tr>
  );
}

export default ExpertRow;