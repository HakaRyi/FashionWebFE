import React, { useState } from 'react';
import { 
    X, CheckCircle, XCircle, Clock, DollarSign, 
    Users, Trophy, Mail, AlertCircle, Image as ImageIcon 
} from 'lucide-react';
import styles from '../styles/EventManagement.module.scss';

const EventDetailModal = ({ event, onClose, onApprove, onReject }) => {
    const [view, setView] = useState('detail'); // 'detail' hoặc 'reject'
    const [reason, setReason] = useState('');

    if (!event) return null;

    const totalAmount = (event.totalPrizePool || 0) + (event.appliedFee || 0);

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{view === 'detail' ? 'Chi tiết phê duyệt' : 'Từ chối sự kiện'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.modalBody}>
                    {view === 'detail' ? (
                        <div className={styles.scrollableContent}>
                            {/* Banner */}
                            <div className={styles.bannerSection}>
                                {event.thumbnailUrl ? (
                                    <img src={event.thumbnailUrl} alt="Thumbnail" className={styles.bannerImg} />
                                ) : (
                                    <div className={styles.noImage}>
                                        <ImageIcon size={40} /> 
                                        <span>Không có ảnh thumbnail</span>
                                    </div>
                                )}
                                <div className={styles.bannerTitle}>
                                    <h3>{event.title}</h3>
                                </div>
                            </div>

                            <div className={styles.detailGrid}>
                                <div className={styles.infoCard}>
                                    <h4><Clock size={16} /> Lịch trình</h4>
                                    <p>Bắt đầu: <strong>{new Date(event.startTime).toLocaleString('vi-VN')}</strong></p>
                                    <p>Kết thúc: <strong>{new Date(event.endTime).toLocaleString('vi-VN')}</strong></p>
                                </div>

                                <div className={styles.infoCard}>
                                    <h4><DollarSign size={16} /> Tài chính (VNĐ)</h4>
                                    <p>Tổng tiền giải: <strong>{event.totalPrizePool?.toLocaleString()} đ</strong></p>
                                    <p>Phí hệ thống: <strong>{event.appliedFee?.toLocaleString()} đ</strong></p>
                                    <div className={styles.totalHighlight}>
                                        <span>Tổng cộng ký quỹ:</span>
                                        <strong>{totalAmount.toLocaleString()} đ</strong>
                                    </div>
                                </div>

                                <div className={styles.infoCard}>
                                    <h4><Users size={16} /> Người tổ chức</h4>
                                    <p>Tên: <strong>{event.creatorName}</strong></p>
                                    <p><Mail size={14} /> {event.creatorEmail}</p>
                                </div>

                                <div className={styles.infoCard}>
                                    <h4><Trophy size={16} /> Yêu cầu</h4>
                                    <p>Expert tối thiểu: <strong>{event.minExperts} người</strong></p>
                                    <p>Tham gia: <strong>{event.participantCount || 0} người</strong></p>
                                </div>
                            </div>

                            {event.status === 'Pending_Review' && (
                                <div className={styles.modalFooter}>
                                    <button onClick={() => onApprove(event.eventId)} className={styles.btnApprove}>
                                        <CheckCircle size={18} /> Phê duyệt ngay
                                    </button>
                                    <button onClick={() => setView('reject')} className={styles.btnReject}>
                                        <XCircle size={18} /> Từ chối & Hoàn tiền
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.rejectForm}>
                            <div className={styles.warningBox}>
                                <AlertCircle size={20} />
                                <p>Lý do từ chối sẽ được thông báo cho người dùng. Toàn bộ <strong>{totalAmount.toLocaleString()} đ</strong> sẽ được hoàn trả.</p>
                            </div>
                            <textarea
                                rows={4}
                                placeholder="Nhập lý do chi tiết..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                            <div className={styles.modalFooter}>
                                <button 
                                    onClick={() => onReject(event.eventId, reason)} 
                                    className={styles.btnConfirmReject}
                                    disabled={!reason.trim()}
                                >
                                    Xác nhận từ chối
                                </button>
                                <button onClick={() => setView('detail')} className={styles.btnBack}>Quay lại</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetailModal;