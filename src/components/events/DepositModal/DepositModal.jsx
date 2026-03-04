import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, X } from 'lucide-react';
import styles from './DepositModal.module.scss';

const DepositModal = ({ isSuccess, setIsSuccess, amount, setAmount, onClose }) => {
    const EXCHANGE_RATE = 1000;
    const subTotal = amount * EXCHANGE_RATE;
    const processingFee = 2000;
    const total = subTotal + processingFee;

    const handlePayment = () => {
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            onClose();
        }, 3000);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={styles.receiptCard}
                onClick={(e) => e.stopPropagation()}
            >
                {!isSuccess ? (
                    <>
                        <div className={styles.receiptHeader}>
                            <div className={styles.brandIcon}><Sparkles size={20} /></div>
                            <h3>THANH TOÁN NẠP COIN</h3>
                            <p>Mã giao dịch: #EXP-{Math.floor(Math.random() * 100000)}</p>
                        </div>

                        <div className={styles.receiptBody}>
                            <div className={styles.inputSection}>
                                <label>Số lượng nạp (Coins)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                />
                            </div>
                            <div className={styles.divider}></div>
                            <div className={styles.billDetail}>
                                <div className={styles.billLine}><span>Đơn giá</span><span>1.000đ/1 Coin</span></div>
                                <div className={styles.billLine}>
                                    <span>Tạm tính ({amount.toLocaleString()} Coins)</span>
                                    <span>{subTotal.toLocaleString()}đ</span>
                                </div>
                                <div className={styles.billLine}><span>Phí dịch vụ</span><span>{processingFee.toLocaleString()}đ</span></div>
                                <div className={`${styles.billLine} ${styles.totalLine}`}>
                                    <span>TỔNG CỘNG</span><span>{total.toLocaleString()} VNĐ</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.receiptFooter}>
                            <button className={styles.btnCancel} onClick={onClose}>HỦY</button>
                            <button className={styles.btnPay} onClick={handlePayment}>THANH TOÁN</button>
                        </div>
                        <div className={styles.zigzag}></div>
                    </>
                ) : (
                    <div className={styles.successState}>
                        <CheckCircle2 size={48} color="#2ecc71" />
                        <h3>GIAO DỊCH THÀNH CÔNG</h3>
                        <p>Hệ thống đã ghi nhận <strong>+{amount.toLocaleString()}</strong> Coins</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default DepositModal;