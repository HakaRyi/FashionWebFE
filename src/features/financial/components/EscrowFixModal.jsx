import { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';
import styles from '../styles/EscrowFixModal.module.scss';

const EscrowFixModal = ({ item, isOpen, onClose, onConfirm, isActionLoading }) => {
    const [reason, setReason] = useState('');

    // Reset lý do mỗi khi mở modal với item mới
    useEffect(() => {
        if (isOpen) setReason('');
    }, [isOpen, item]);

    if (!isOpen || !item) return null;

    const handleSubmit = () => {
        if (!reason.trim()) return;
        // Trả data về component cha xử lý API
        onConfirm(item.escrowSessionId || item.id, reason);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Request for financial review</h2>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.fixForm}>
                        <div className={styles.alertBox}>
                            <Info size={18} />
                            <span>
                                This request will be forwarded to the <b>Expert</b> department for approval before release.
                            </span>
                        </div>

                        <div className={styles.itemSummary}>
                            <p>Processing for: <strong>#E{item.escrowSessionId}</strong></p>
                            <p>Amount: <strong>{item.finalAmount?.toLocaleString()}đ</strong></p>
                        </div>

                        <label htmlFor="fixReason">Reason for financial review:</label>
                        <textarea
                            id="fixReason"
                            placeholder="Please describe in detail the reasons why intervention is needed in this pending payment session..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={5}
                            disabled={isActionLoading}
                        />

                        <div className={styles.modalActions}>
                            <button
                                className={styles.btnCancel}
                                onClick={onClose}
                                disabled={isActionLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.btnConfirm}
                                onClick={handleSubmit}
                                disabled={!reason.trim() || isActionLoading}
                            >
                                {isActionLoading ? 'Sending...' : 'Submit Review Request'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EscrowFixModal;