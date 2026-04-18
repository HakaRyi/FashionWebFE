import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Banknote, Lock } from "lucide-react";
import styles from "../styles/DepositModal.module.scss";
import { topUp } from "../api/topUp";

const DepositModal = ({
  isSuccess,
  setIsSuccess,
  amount: initialAmount,
  onClose,
  onRefreshBalance,
  isFixedAmount = false
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const [inputAmount, setInputAmount] = useState(initialAmount || 0);

  const isAmountInvalid = inputAmount > 0 && inputAmount < 10000;

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleInputChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    setInputAmount(Number(val));
  };

  const handlePayment = async () => {
    if (!inputAmount || inputAmount < 10000) {
      alert("The minimum deposit amount is 10,000 VND!");
      return;
    }

    try {
      setIsProcessing(true);
      sessionStorage.setItem("post_payment_url", window.location.pathname);
      const response = await topUp(inputAmount);
      const paymentUrl = response.data?.paymentUrl;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error("Cannot initialize payment link.");
      }

    } catch (error) {
      console.error("Payment Error:", error);
      const errorMsg = error.response?.data?.message || "System payment connection error!";
      alert(errorMsg);
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
              <h3>CONFIRM DEPOSIT</h3>
              <p>Deposit more funds to complete event creation</p>
            </div>

            <div className={styles.receiptBody}>
              <div className={styles.inputSection}>
                <label>Amount to Deposit (VNĐ)</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    className={`${isFixedAmount ? styles.readOnlyInput : styles.editableInput} ${isAmountInvalid ? styles.inputError : ""}`}
                    value={formatCurrency(inputAmount)}
                    onChange={handleInputChange}
                    readOnly={isFixedAmount}
                  />
                  {isFixedAmount && (
                    <div className={styles.lockIndicator}>
                      <Lock size={14} /> <span>Fixed</span>
                    </div>
                  )}
                </div>
                <small className={styles.inputHint}>
                  {isAmountInvalid ? (
                    <small className={styles.errorText}>
                      Minimum deposit amount is 10,000 VNĐ
                    </small>
                  ) : (
                    <small className={styles.inputHint}>
                      {isFixedAmount
                        ? "The system has calculated the amount of money you still need."
                        : "Please enter the amount you wish to deposit (Min 10,000 VNĐ)."}
                    </small>
                  )}
                </small>
              </div>

              <div className={styles.divider}></div>
              <div className={styles.paymentMethodInfo} style={{ marginBottom: "15px", fontSize: "0.85rem", opacity: 0.8 }}>
                <span>Payment via: <strong>VnPay Gateway (Bank Transfer/Apps)</strong></span>
              </div>

              <div className={styles.billDetail}>
                <div className={`${styles.billLine} ${styles.totalLine}`}>
                  <span>TOTAL AMOUNT</span>
                  <span className={styles.totalValue}>{formatCurrency(inputAmount)} VNĐ</span>
                </div>
              </div>
            </div>

            <div className={styles.receiptFooter}>
              <button
                className={styles.btnCancel}
                onClick={onClose}
                disabled={isProcessing}
              >
                CANCEL
              </button>
              <button
                className={styles.btnPay}
                onClick={handlePayment}
                disabled={isProcessing || !inputAmount || inputAmount < 10000}
              >
                {isProcessing ? "Processing..." : "DEPOSIT & CONFIRM"}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.successState}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <CheckCircle2 size={60} color="#2ecc71" />
            </motion.div>
            <h3>DEPOSIT SUCCESSFUL</h3>
            <p>Balance has been updated.</p>
          </div>
        )}
        <div className={styles.zigzag}></div>
      </motion.div>
    </div>
  );
};

export default DepositModal;