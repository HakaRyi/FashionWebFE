import { useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import styles from '../styles/TransactionDetailModal.module.scss';

const TransactionDetailModal = ({ item, isOpen, onClose }) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';

            document.body.style.paddingRight = 'var(--scrollbar-width, 0px)';
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        }

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
                    <h2>Transaction Detail Information</h2>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.detailGrid}>
                        <div className={styles.detailItem}>
                            <label>Transaction Code</label>
                            <span className={styles.highlight}>{item.transactionCode || 'N/A'}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <label>Time Created</label>
                            <span>{new Date(item.createdAt).toLocaleString('vi-VN')}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <label>Beneficiary</label>
                            <span>{item.userName || 'Unknown'}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <label>Wallet Status</label>
                            <div className={styles.balanceTrack}>
                                <div className={styles.step}>
                                    <small>Balance Before</small>
                                    <p>{item.balanceBefore?.toLocaleString()}đ</p>
                                </div>
                                <ArrowRight size={16} />
                                <div className={styles.step}>
                                    <small>Balance Change</small>
                                    <p className={item.amount > 0 ? styles.plus : styles.minus}>
                                        {item.amount > 0 ? '+' : ''}{item.amount?.toLocaleString()}đ
                                    </p>
                                </div>
                                <ArrowRight size={16} />
                                <div className={styles.step}>
                                    <small>Balance After Transaction</small>
                                    <p><strong>{item.balanceAfter?.toLocaleString()}đ</strong></p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.noteBox}>
                            <label>Content Note</label>
                            <p>{item.description || 'No note available'}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.modalActions}>
                    <button className={styles.btnCancel} onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailModal;