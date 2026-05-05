import { useState, useEffect, useMemo } from "react"
import styles from "../styles/Dashboard.module.scss"
import { 
  FaMoneyBill1Wave, FaCircleInfo, FaXmark, 
  FaCalendarDays, FaWallet, FaReceipt, FaEye 
} from "react-icons/fa6"
import { expertApi } from "../api/dashboardApi";
import EventDetailModal from "../../events/components/EventDetailModal";

function RevenueTable() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [revenueMonth, setRevenueMonth] = useState(currentMonth);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Quản lý Dialog chi tiết giao dịch
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  // Quản lý Dialog chi tiết sự kiện
  const [viewingEvent, setViewingEvent] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const [year, month] = revenueMonth.split("-").map(Number);
        const StartDate = `${revenueMonth}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const EndDate = `${revenueMonth}-${lastDay}`;
        const res = await expertApi.getTransactionList({ StartDate, EndDate });
        setTransactions(res.data || []);
      } catch (error) {
        console.error("Error retrieving transaction list:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [revenueMonth]);

  const totalRevenue = useMemo(() => {
    return transactions.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [transactions]);

  const formatVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Hàm mở chi tiết sự kiện khi click vào tên sự kiện
  const handleOpenEventDetail = async (e, eventId) => {
    e.stopPropagation(); // Không cho mở modal Transaction Details
    setLoading(true);
    try {
        const res = await expertApi.getEventDetail(eventId); 
        setViewingEvent(res.data);
    } catch (error) {
        console.error("Ko lấy được event:", error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3>
          <FaMoneyBill1Wave color="#10b981" /> System Revenue
        </h3>
        <input
          type="month"
          value={revenueMonth}
          onChange={(e) => setRevenueMonth(e.target.value)}
          className={styles.dateInput}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service Type</th>
              <th>Date</th>
              <th style={{ textAlign: "right" }}>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading && transactions.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>Loading...</td></tr>
            ) : transactions.length > 0 ? (
              transactions.map((t) => (
                <tr 
                  key={t.transactionId} 
                  className={styles.clickableRow} 
                  onClick={() => setSelectedTransaction(t)}
                >
                  <td>
                    <b style={{ color: "var(--primary-color)" }}>@{t.userName}</b>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        {t.type === "System_Fee_Revenue" && "Event System Fee"}
                        {t.referenceType === "TryOn" && "AI Virtual Try-On"}
                        {t.referenceType === "AIRecommendation" && "AI Styling Suggestion"}
                        {!t.referenceType && t.type !== "System_Fee_Revenue" && "Other Service"}
                      </span>
                      
                      {/* HIỂN THỊ LINK SỰ KIỆN NẾU CÓ */}
                      {t.type === "System_Fee_Revenue" && t.eventName && (
                        <span 
                          className={styles.eventLink} 
                          onClick={(e) => handleOpenEventDetail(e, t.referenceId)}
                        >
                          <FaEye size={10} /> {t.eventName}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{new Date(t.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td style={{ textAlign: "right", fontWeight: "600", color: "#10b981" }}>
                    +{formatVND(t.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>No transactions</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.panelFooter}>
        <span className={styles.footerLabel}>Total for the month:</span>
        <span className={styles.footerValue}>{formatVND(totalRevenue)}</span>
      </div>

      {/* DIALOG CHI TIẾT GIAO DỊCH */}
      {selectedTransaction && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTransaction(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h4><FaReceipt /> Transaction Details</h4>
              <button className={styles.closeBtn} onClick={() => setSelectedTransaction(null)}>
                <FaXmark />
              </button>
            </div>
            
            <div className={styles.transactionDetailBody}>
              <div className={styles.amountShowcase}>
                <span className={styles.detailLabel}>Total Revenue</span>
                <h2 style={{ color: "#10b981" }}>+{formatVND(selectedTransaction.amount)}</h2>
                <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                  {selectedTransaction.status}
                </span>
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <FaCircleInfo />
                  <div>
                    <label>Description</label>
                    <p>{selectedTransaction.description || "No description available"}</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <FaCalendarDays />
                  <div>
                    <label>Created At</label>
                    <p>{new Date(selectedTransaction.createdAt).toLocaleString("vi-VN")}</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <FaWallet />
                  <div>
                    <label>Source Wallet / Customer</label>
                    <p>@{selectedTransaction.userName} (ID: {selectedTransaction.walletId})</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <FaReceipt />
                  <div>
                    <label>Reference</label>
                    <p>
                      Type: <b>{selectedTransaction.referenceType || "N/A"}</b> 
                      {selectedTransaction.referenceId && ` | ID: #${selectedTransaction.referenceId}`}
                    </p>
                    {/* NẾU LÀ EVENT THÌ HIỆN THÊM TÊN TRONG MODAL CHI TIẾT */}
                    {selectedTransaction.eventName && (
                        <p style={{marginTop: '5px', color: '#3b82f6', fontWeight: '500'}}>
                            Event: {selectedTransaction.eventName}
                        </p>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.balanceSnapshot}>
                <div>
                  <label>Balance Before</label>
                  <span>{formatVND(selectedTransaction.balanceBefore)}</span>
                </div>
                <div className={styles.arrow}>→</div>
                <div>
                  <label>Balance After</label>
                  <span style={{ fontWeight: "bold" }}>{formatVND(selectedTransaction.balanceAfter)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG CHI TIẾT SỰ KIỆN (MODAL THỨ 2) */}
      {viewingEvent && (
        <EventDetailModal 
          event={viewingEvent} 
          onClose={() => setViewingEvent(null)}
          // Vì xem từ dashboard doanh thu nên admin thường đã duyệt rồi, 
          // để trống các hàm callback để tránh lỗi props
          onApprove={() => {}} 
          onReject={() => {}}
        />
      )}
    </div>
  );
}

export default RevenueTable;