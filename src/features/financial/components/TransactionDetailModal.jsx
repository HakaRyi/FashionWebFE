import { useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import styles from '../styles/TransactionDetailModal.module.scss';

const TransactionDetailModal = ({ item, isOpen, onClose }) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Optional: Tránh bị giật màn hình nếu thanh scroll chiếm diện tích
            document.body.style.paddingRight = 'var(--scrollbar-width, 0px)';
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        }

        // Cleanup function: Đảm bảo scroll được mở lại khi component bị unmount đột ngột
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        };
    }, [isOpen]);

    if (!isOpen || !item) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Thông tin giao dịch chi tiết</h2>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.detailGrid}>
                        <div className={styles.detailItem}>
                            <label>Mã giao dịch</label>
                            <span className={styles.highlight}>{item.transactionCode || 'N/A'}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <label>Thời gian tạo</label>
                            <span>{new Date(item.createdAt).toLocaleString('vi-VN')}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <label>Người thụ hưởng</label>
                            <span>{item.userName || 'Không rõ'}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <label>Trạng thái ví</label>
                            <div className={styles.balanceTrack}>
                                <div className={styles.step}>
                                    <small>Số dư trước</small>
                                    <p>{item.balanceBefore?.toLocaleString()}đ</p>
                                </div>
                                <ArrowRight size={16} />
                                <div className={styles.step}>
                                    <small>Biến động</small>
                                    <p className={item.amount > 0 ? styles.plus : styles.minus}>
                                        {item.amount > 0 ? '+' : ''}{item.amount?.toLocaleString()}đ
                                    </p>
                                </div>
                                <ArrowRight size={16} />
                                <div className={styles.step}>
                                    <small>Số dư sau</small>
                                    <p><strong>{item.balanceAfter?.toLocaleString()}đ</strong></p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.noteBox}>
                            <label>Ghi chú nội dung</label>
                            <p>{item.description || 'Không có ghi chú'}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.modalActions}>
                    <button className={styles.btnCancel} onClick={onClose}>Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailModal;