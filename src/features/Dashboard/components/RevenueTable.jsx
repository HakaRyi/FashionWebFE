//src/features/Dashboard/components/RevenueTable.jsx
import { useState, useEffect, useMemo} from "react"
import styles from "../styles/Dashboard.module.scss"
import { FaMoneyBill1Wave } from "react-icons/fa6"
import { expertApi } from "../api/dashboardApi";
function RevenueTable(){

 const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const [revenueMonth, setRevenueMonth] = useState(currentMonth);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // Tính toán ngày đầu tháng và cuối tháng từ revenueMonth (YYYY-MM)
        const StartDate = `${revenueMonth}-01`;
        const EndDate = `${revenueMonth}-31`; // Backend C# của bạn sẽ tự xử lý mốc cuối tháng

        const res = await expertApi.getTransactionList({ StartDate, EndDate });
        setTransactions(res.data || []);
      } catch (error) {
        console.error("Lỗi lấy danh sách giao dịch:", error);
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

 return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3>
          <FaMoneyBill1Wave color="#10b981" /> Doanh thu Hệ thống
        </h3>

        <input
          type="month"
          value={revenueMonth}
          onChange={(e) => setRevenueMonth(e.target.value)}
          className={styles.dateInput}
        />
      </div>

      <div className={styles.tableWrapper}> {/* Thêm wrapper để scroll nếu quá dài */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Loại dịch vụ</th>
              <th>Ngày</th>
              <th style={{ textAlign: "right" }}>Thành tiền</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{textAlign: "center", padding: "20px"}}>Đang tải...</td></tr>
            ) : transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t.transactionId}>
                  <td>
                    <b style={{ color: "var(--primary-color)" }}>@{t.userName}</b>
                  </td>
                  <td>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t.type === "PayForVTON" ? "Thử đồ ảo AI" : "Gợi ý phối đồ AI"}
                    </span>
                  </td>
                  <td>
                    {new Date(t.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td style={{ textAlign: "right", fontWeight: "600" }}>
                    {formatVND(t.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" style={{textAlign: "center", padding: "20px"}}>Không có giao dịch nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.panelFooter}>
        <span className={styles.footerLabel}>Tổng cộng trong tháng:</span>
        <span className={styles.footerValue}>{formatVND(totalRevenue)}</span>
      </div>
    </div>
  );
}

export default RevenueTable