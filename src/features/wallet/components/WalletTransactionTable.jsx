import { History, Download, ChevronLeft, ChevronRight, ArrowDownLeft, ArrowUpRight, Inbox } from "lucide-react";
import WalletFilter from "./WalletFilter";
import styles from "../styles/ExpertWallet.module.scss";
import { exportToCsv } from "@/features/wallet/utils/exportCsv";
import { format } from "date-fns";

const WalletTransactionTable = ({
  transactions,
  allData,
  filter,
  setFilter,
  currentPage,
  totalPages,
  setCurrentPage
}) => {
  const hasData = transactions && transactions.length > 0;

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
            onClick={() => exportToCsv(allData, 'wallet-history')}
            disabled={!hasData}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {hasData ? (
          <>
            <table className={styles.transactionTable}>
              <thead>
                <tr>
                  <th>Transaction code</th>
                  <th>Detail</th>
                  <th>Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const isDeposit = tx.type === "Credit";
                  return (
                    <tr key={tx.transactionId}>
                      <td className={styles.idCol}>#{tx.transactionId}</td>
                      <td className={styles.detailCol}>
                        <div className={styles.typeIcon}>
                          {isDeposit ? 
                            <ArrowDownLeft size={14} color="#10b981" /> : 
                            <ArrowUpRight size={14} color="#ef4444" />
                          }
                          <span>{tx.description}</span>
                        </div>
                        {tx.paymentProvider && <small className={styles.provider}>via {tx.paymentProvider}</small>}
                      </td>
                      <td>{format(new Date(tx.createdAt), "dd/MM/yyyy HH:mm")}</td>
                      <td className={isDeposit ? styles.plus : styles.minus}>
                        {isDeposit ? "+" : "-"}
                        {tx.amount.toLocaleString('vi-VN')} đ
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[tx.status.toLowerCase()]}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

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
          </>
        ) : (
          /* Empty State nằm gọn gàng bên trong khung của table */
          <div className={styles.emptyContainer}>
            <div className={styles.emptyIconBox}>
              <Inbox size={40} />
            </div>
            <h4>No transactions found</h4>
            <p>Your search or filter did not match any transaction history.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletTransactionTable;