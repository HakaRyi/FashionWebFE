import ExpertRow from "./ExpertRow";
import styles from "../styles/Expert.module.scss";

function ExpertTable({ experts, onView }) {
  if (!experts || experts.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No expert data found.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Expert</th>
            <th>Specialty</th>
            <th>Registration Date</th>
            <th>Status</th>
            <th style={{ textAlign: "right", paddingRight: "24px" }}>Actions</th>
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