import React from "react";
import { History, Download, ChevronLeft, ChevronRight } from "lucide-react";
import WalletFilter from "./WalletFilter";
import styles from "../styles/ExpertWallet.module.scss";
import { exportToCsv } from "@/features/wallet/utils/exportCsv";


const STATUS_MAP = {
  Success: 'Success',
  Pending: 'Pending',
  Failed: 'Failed'
};

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
          <h3>Transaction History</h3>
        </div>

        <div className={styles.actions}>
          <WalletFilter filter={filter} setFilter={setFilter} />
          <button
            className={styles.btnExport}
            onClick={() => exportToCsv(allData, 'transaction-history')}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.transactionTable}>
          <thead>
            <tr>
              <th>Transaction Code</th>
              <th>Details</th>
              <th>Date</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const isCredit = tx.amount > 0;
              const displayStatus = STATUS_MAP[tx.status] || tx.status; // Dịch Status

              return (
                <tr key={tx.id}>
                  <td className={styles.idCol}>{tx.id}</td>

                  {/* Sử dụng trực tiếp detail từ Backend */}
                  <td className={styles.detailCol}>{tx.detail}</td>

                  <td>{tx.date}</td>

                  {/* Xử lý số tiền âm/dương */}
                  <td className={isCredit ? styles.plus : styles.minus}>
                    {isCredit ? "+" : "-"}
                    {Math.abs(tx.amount).toLocaleString('vi-VN')} đ
                  </td>

                  <td>
                    <span className={`${styles.statusBadge} ${styles[tx.status.toLowerCase()] || styles.default}`}>
                      {displayStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
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