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
                    <h2>{view === 'detail' ? 'Approval details' : 'Decline the event'}</h2>
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
                                        <span>No thumbnail image available</span>
                                    </div>
                                )}
                                <div className={styles.bannerTitle}>
                                    <h3>{event.title}</h3>
                                </div>
                            </div>

                            <div className={styles.detailGrid}>
                                <div className={styles.infoCard}>
                                    <h4><Clock size={16} /> Schedule</h4>
                                    <p>Start: <strong>{new Date(event.startTime).toLocaleString('vi-VN')}</strong></p>
                                    <p>Submission Deadline: <strong>{new Date(event.submissionDeadline).toLocaleString('vi-VN')}</strong></p>
                                    <p>End: <strong>{new Date(event.endTime).toLocaleString('vi-VN')}</strong></p>
                                </div>

                                <div className={styles.infoCard}>
                                    <h4><DollarSign size={16} /> Financial (VND)</h4>
                                    <p>Total Prize Pool: <strong>{event.totalPrizePool?.toLocaleString()} đ</strong></p>
                                    <p>System Fee: <strong>{event.appliedFee?.toLocaleString()} đ</strong></p>
                                    <div className={styles.totalHighlight}>
                                        <span>Total Deposit:</span>
                                        <strong>{totalAmount.toLocaleString()} đ</strong>
                                    </div>
                                </div>

                                <div className={styles.infoCard}>
                                    <h4><Users size={16} /> Organizer</h4>
                                    <p>Name: <strong>{event.creatorName}</strong></p>
                                    <p><Mail size={14} /> {event.creatorEmail}</p>
                                </div>

                                <div className={styles.infoCard}>
                                    <h4><Trophy size={16} /> Requirements</h4>
                                    <p>Minimum Experts: <strong>{event.minExperts} people</strong></p>
                                    <p>Participants: <strong>{event.participantCount || 0} people</strong></p>
                                </div>
                            </div>

                            {event.status === 'Pending_Review' && (
                                <div className={styles.modalFooter}>
                                    <button onClick={() => setView('reject')} className={styles.btnReject}>
                                        <XCircle size={18} /> Reject & Refund
                                    </button>
                                    <button onClick={() => onApprove(event.eventId)} className={styles.btnApprove}>
                                        <CheckCircle size={18} /> Approve now!
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.rejectForm}>
                            <div className={styles.warningBox}>
                                <AlertCircle size={20} />
                                <p>Reason for rejection will be notified to the user. The entire <strong>{totalAmount.toLocaleString()} đ</strong> will be refunded.</p>
                            </div>
                            <textarea
                                rows={4}
                                placeholder="Enter detailed reason..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                            <div className={styles.modalFooter}>
                                <button
                                    onClick={() => onReject(event.eventId, reason)}
                                    className={styles.btnConfirmReject}
                                    disabled={!reason.trim()}
                                >
                                    Confirm Rejection
                                </button>
                                <button onClick={() => setView('detail')} className={styles.btnBack}>Back</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetailModal;