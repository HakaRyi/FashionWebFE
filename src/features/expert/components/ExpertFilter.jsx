import { FaSearch, FaFilter, FaSortAmountDown, FaSync } from "react-icons/fa";
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

      <div className={styles.searchBox}>

        <FaSearch/>

        <input
          placeholder="Tìm tên, chuyên môn..."
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
        />

      </div>

      <div className={styles.filterGroup}>

        <select
          value={statusFilter}
          onChange={(e)=>setStatusFilter(e.target.value)}
        >
          <option value="All">Tất cả</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e)=>setSortOrder(e.target.value)}
        >
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>

        <button onClick={refresh}>
          <FaSync/>
        </button>

      </div>

    </div>

  )

}

export default ExpertFilter