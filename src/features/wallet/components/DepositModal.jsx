import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";
import styles from "../styles/DepositModal.module.scss";
import { topUp } from "../api/topUp";

const EXCHANGE_RATE = 1000;
const PROCESSING_FEE = 2000;

const DepositModal = ({
  isSuccess,
  setIsSuccess,
  amount,
  setAmount,
  onClose,
  onRefreshBalance
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Memoize để tránh tính toán lại không cần thiết
  const { subTotal, total } = useMemo(() => {
    const validAmount = Number(amount) || 0;
    const sub = validAmount * EXCHANGE_RATE;
    return {
      subTotal: sub,
      total: sub > 0 ? sub + PROCESSING_FEE : 0
    };
  }, [amount]);

  const handlePayment = async () => {
    if (!amount || amount < 10) {
      alert("Số lượng nạp tối thiểu là 10 Coins");
      return;
    }

    try {
      setIsProcessing(true);
      await topUp({ amount });

      // Gọi hàm refresh số dư từ cha truyền xuống
      if (onRefreshBalance) {
        await onRefreshBalance();
      }

      setIsSuccess(true);
      
      // Đóng modal sau khi hiện thông báo thành công
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Lỗi thanh toán!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={styles.receiptCard}
      >
        {!isSuccess ? (
          <>
            <div className={styles.receiptHeader}>
              <div className={styles.brandIcon}><Sparkles size={20} /></div>
              <h3>THANH TOÁN NẠP COIN</h3>
              <p>Hệ thống nạp tự động qua ví nội bộ</p>
            </div>

            <div className={styles.receiptBody}>
              <div className={styles.inputSection}>
                <label>Số lượng nạp (Coins)</label>
                <input
                  type="number"
                  placeholder="Nhập số coin..."
                  value={amount}
                  onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>

              <div className={styles.divider}></div>

              <div className={styles.billDetail}>
                <div className={styles.billLine}>
                  <span>Đơn giá</span>
                  <span>1.000đ / Coin</span>
                </div>
                <div className={styles.billLine}>
                  <span>Tạm tính</span>
                  <span>{subTotal.toLocaleString()}đ</span>
                </div>
                <div className={styles.billLine}>
                  <span>Phí dịch vụ</span>
                  <span>{PROCESSING_FEE.toLocaleString()}đ</span>
                </div>
                <div className={`${styles.billLine} ${styles.totalLine}`}>
                  <span>TỔNG THANH TOÁN</span>
                  <span>{total.toLocaleString()} VNĐ</span>
                </div>
              </div>
            </div>

            <div className={styles.receiptFooter}>
              <button className={styles.btnCancel} onClick={onClose} disabled={isProcessing}>
                ĐÓNG
              </button>
              <button className={styles.btnPay} onClick={handlePayment} disabled={isProcessing || amount <= 0}>
                {isProcessing ? "ĐANG XỬ LÝ..." : "THANH TOÁN NGAY"}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.successState}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <CheckCircle2 size={60} color="#2ecc71" />
            </motion.div>
            <h3>NẠP TIỀN THÀNH CÔNG</h3>
            <p>Số dư mới đã được cập nhật vào ví của bạn.</p>
          </div>
        )}
        <div className={styles.zigzag}></div>
      </motion.div>
    </div>
  );
};

export default DepositModal;