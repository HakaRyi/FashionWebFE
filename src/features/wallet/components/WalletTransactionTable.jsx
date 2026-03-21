import React from "react";
import { History, Download, ChevronLeft, ChevronRight } from "lucide-react";
import WalletFilter from "./WalletFilter";
import styles from "../styles/ExpertWallet.module.scss";
import { exportToCsv } from "@/features/wallet/utils/exportCsv";

const WalletTransactionTable = ({ 
    transactions, 
    allData, 
    filter, 
    setFilter,
    currentPage,
    totalPages,
    setCurrentPage 
}) => {
  return (
    <div className={styles.historySection}>
      <div className={styles.historyHeader}>
        <div className={styles.left}>
          <History size={20} />
          <h3>Lịch sử giao dịch</h3>
        </div>

        <div className={styles.actions}>
          <WalletFilter filter={filter} setFilter={setFilter} />
          <button 
            className={styles.btnExport} 
            onClick={() => exportToCsv(allData, 'lich-su-giao-dich')}
          >
            <Download size={14} /> Xuất CSV
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.transactionTable}>
          <thead>
            <tr>
              <th>Mã GD</th>
              <th>Chi tiết</th>
              <th>Ngày</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className={styles.idCol}>{tx.id}</td>
                <td className={styles.detailCol}>{tx.detail}</td>
                <td>{tx.date}</td>
                <td className={tx.type === "deposit" ? styles.plus : styles.minus}>
                  {tx.type === "deposit" ? "+" : "-"}
                  {tx.amount.toLocaleString()}
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[tx.status.toLowerCase()]}`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={styles.pageBtn}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className={styles.pageNumbers}>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`${styles.numberBtn} ${currentPage === i + 1 ? styles.active : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            className={styles.pageBtn}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletTransactionTable;