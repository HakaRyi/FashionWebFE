import ExpertRow from "./ExpertRow";
import styles from "../styles/Expert.module.scss";

function ExpertTable({ experts, onView }) {
  if (!experts || experts.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Không có dữ liệu chuyên gia nào được tìm thấy.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Chuyên gia</th>
            <th>Chuyên môn</th>
            <th>Ngày đăng ký</th>
            <th>Trạng thái</th>
            <th style={{ textAlign: "right", paddingRight: "24px" }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {experts.map((exp) => (
            <ExpertRow 
              key={exp.expertProfileId} 
              expert={exp} 
              onView={onView} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpertTable;