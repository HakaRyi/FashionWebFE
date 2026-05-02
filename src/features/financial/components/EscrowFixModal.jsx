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
                    <h2>Yêu cầu xem xét tài chính</h2>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.fixForm}>
                        <div className={styles.alertBox}>
                            <Info size={18} />
                            <span>
                                Yêu cầu này sẽ được chuyển tới bộ phận <b>Expert</b> để phê duyệt trước khi được phép giải ngân.
                            </span>
                        </div>
                        
                        <div className={styles.itemSummary}>
                            <p>Đang xử lý cho: <strong>#E{item.escrowSessionId}</strong></p>
                            <p>Số tiền: <strong>{item.finalAmount?.toLocaleString()}đ</strong></p>
                        </div>

                        <label htmlFor="fixReason">Lý do yêu cầu sửa đổi/giải ngân:</label>
                        <textarea
                            id="fixReason"
                            placeholder="Mô tả cụ thể lý do cần can thiệp vào phiên tiền treo này..."
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
                                Hủy bỏ
                            </button>
                            <button
                                className={styles.btnConfirm}
                                onClick={handleSubmit}
                                disabled={!reason.trim() || isActionLoading}
                            >
                                {isActionLoading ? 'Đang gửi...' : 'Gửi yêu cầu phê duyệt'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EscrowFixModal;