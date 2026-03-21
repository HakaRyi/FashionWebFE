import { FaSearch, FaFilter, FaSync } from "react-icons/fa";
import styles from "../styles/Expert.module.scss";

function ExpertFilter({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sortOrder,
  setSortOrder,
  refresh
}) {
  return (
    <div className={styles.controlPanel}>
      {/* Ô tìm kiếm */}
      <div className={styles.searchBox}>
        <FaSearch color="#64748b" />
        <input
          placeholder="Tìm tên, chuyên môn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Nhóm lọc và sắp xếp */}
      <div className={styles.filterGroup}>
        <div className={styles.selectWrapper}>
          <FaFilter size={12} color="#64748b" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Pending">Đang chờ (Pending)</option>
            <option value="Approved">Đã duyệt (Approved)</option>
            <option value="Rejected">Đã từ chối (Rejected)</option>
          </select>
        </div>

        <div className={styles.selectWrapper}>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>
        </div>

        <button className={styles.btnSync} onClick={refresh} title="Làm mới">
          <FaSync />
        </button>
      </div>
    </div>
  );
}

export default ExpertFilter;