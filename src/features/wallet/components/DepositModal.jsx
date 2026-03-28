import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Banknote, Lock } from "lucide-react";
import styles from "../styles/DepositModal.module.scss";
import { topUp } from "../api/topUp";

const DepositModal = ({
  isSuccess,
  setIsSuccess,
  amount, // Số tiền 'gap' truyền từ CreateEventForm
  onClose,
  onRefreshBalance
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Định dạng hiển thị số tiền có dấu chấm: 417500 -> 417.500
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePayment = async () => {
    // Kiểm tra số tiền hợp lệ (ví dụ tối thiểu 1.000đ cho hệ thống)
    if (!amount || amount < 1000) {
      alert("Số tiền không hợp lệ!");
      return;
    }

    try {
      setIsProcessing(true);
      await topUp(amount);

      if (onRefreshBalance) {
        await onRefreshBalance();
      }

      setIsSuccess(true);

      // Đóng modal sau 2 giây khi thành công
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);

    } catch (error) {
      console.error("Payment Error:", error);
      alert(error.response?.data?.message || "Lỗi giao dịch, vui lòng thử lại!");
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
              <div className={styles.brandIcon}><Banknote size={20} /></div>
              <h3>XÁC NHẬN NẠP TIỀN</h3>
              <p>Nạp thêm số dư để hoàn tất tạo sự kiện</p>
            </div>

            <div className={styles.receiptBody}>
              <div className={styles.inputSection}>
                <label>Số tiền cần nạp thêm (VNĐ)</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    className={styles.readOnlyInput}
                    value={formatCurrency(amount)}
                    readOnly // Khóa không cho người dùng nhập
                  />
                  <div className={styles.lockIndicator}>
                    <Lock size={14} />
                    <span>Cố định</span>
                  </div>
                </div>
                <small className={styles.inputHint}>
                  Hệ thống tự động tính toán số tiền bạn còn thiếu.
                </small>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.billDetail}>
                <div className={`${styles.billLine} ${styles.totalLine}`}>
                  <span>TỔNG THANH TOÁN</span>
                  <span className={styles.totalValue}>{formatCurrency(amount)} VNĐ</span>
                </div>
              </div>
            </div>

            <div className={styles.receiptFooter}>
              <button 
                className={styles.btnCancel} 
                onClick={onClose} 
                disabled={isProcessing}
              >
                HỦY BỎ
              </button>
              <button 
                className={styles.btnPay} 
                onClick={handlePayment} 
                disabled={isProcessing || amount <= 0}
              >
                {isProcessing ? "ĐANG XỬ LÝ..." : "NẠP TIỀN & XÁC NHẬN"}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.successState}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <CheckCircle2 size={60} color="#2ecc71" />
            </motion.div>
            <h3>NẠP TIỀN THÀNH CÔNG</h3>
            <p>Số dư đã được cập nhật. Đang chuẩn bị tạo sự kiện...</p>
          </div>
        )}
        <div className={styles.zigzag}></div>
      </motion.div>
    </div>
  );
};

export default DepositModal;