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

    const isOrderTransaction =
        item.referenceType === 'OrderPayment' ||
        item.referenceType === 'OrderRefund';

    const isEventTransaction =
        item.referenceType === 'Event' ||
        item.referenceType === 'EventFix';

    const balanceBefore = toNumber(item.balanceBefore);
    const balanceAfter = toNumber(item.balanceAfter);
    const balanceChange = balanceAfter - balanceBefore;

    const balanceChangePrefix =
        balanceChange > 0 ? '+' : balanceChange < 0 ? '-' : '';

    const balanceChangeClass =
        balanceChange > 0
            ? styles.plus
            : balanceChange < 0
                ? styles.minus
                : styles.neutral;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
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
                            <span className={styles.highlight}>
                                {item.transactionCode || 'N/A'}
                            </span>
                        </div>

                        {isOrderTransaction && (
                            <div className={styles.detailItem}>
                                <label>Order Code</label>
                                <span className={styles.highlight}>
                                    {item.orderCode ||
                                        `Order #${item.orderId || item.referenceId || 'N/A'}`}
                                </span>
                            </div>
                        )}

                        {isEventTransaction && (
                            <div className={styles.detailItem}>
                                <label>Event</label>
                                <span className={styles.highlight}>
                                    {item.eventName ||
                                        `Event #${item.eventId || item.referenceId || 'N/A'}`}
                                </span>
                            </div>
                        )}

                        <div className={styles.detailItem}>
                            <label>Reference Type</label>
                            <span>{formatReferenceType(item.referenceType)}</span>
                        </div>

                        <div className={styles.detailItem}>
                            <label>Time Created</label>
                            <span>
                                {item.createdAt
                                    ? new Date(item.createdAt).toLocaleString('vi-VN')
                                    : 'N/A'}
                            </span>
                        </div>

                        <div className={styles.detailItem}>
                            <label>Beneficiary</label>
                            <span>{item.userName || 'Unknown'}</span>
                        </div>

                        <div className={styles.detailItem}>
                            <label>Status</label>
                            <span>{item.status || 'N/A'}</span>
                        </div>

                        <div className={styles.detailItem}>
                            <label>Wallet Status</label>

                            <div className={styles.balanceTrack}>
                                <div className={styles.step}>
                                    <small>Balance Before</small>
                                    <p>{formatMoney(balanceBefore)}</p>
                                </div>

                                <ArrowRight size={16} />

                                <div className={styles.step}>
                                    <small>Balance Change</small>
                                    <p className={balanceChangeClass}>
                                        {balanceChangePrefix}
                                        {formatMoney(Math.abs(balanceChange))}
                                    </p>
                                </div>

                                <ArrowRight size={16} />

                                <div className={styles.step}>
                                    <small>Balance After Transaction</small>
                                    <p>
                                        <strong>{formatMoney(balanceAfter)}</strong>
                                    </p>
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
                    <button className={styles.btnCancel} onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const toNumber = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return 0;
    }

    return Number(value);
};

const formatMoney = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return '0đ';
    }

    return `${Number(value).toLocaleString('vi-VN')}đ`;
};

const formatReferenceType = (referenceType) => {
    switch (referenceType) {
        case 'OrderPayment':
            return 'Order Payment';
        case 'OrderRefund':
            return 'Order Refund';
        case 'Event':
            return 'Campaign Event';
        case 'EventFix':
            return 'Event Fix';
        default:
            return referenceType || 'N/A';
    }
};

export default TransactionDetailModal;