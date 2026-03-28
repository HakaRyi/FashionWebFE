import React from 'react';
import { motion } from 'framer-motion';
import { X, User, Calendar, Trophy, Users, Info } from 'lucide-react';
import styles from '../styles/ExpertInvitations.module.scss';

const InvitationDetailModal = ({ invite, onClose, onAccept, onDecline, isHistory }) => (
    <motion.div 
        className={styles.modalOverlay}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
    >
        <motion.div 
            className={styles.modalContent}
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            onClick={e => e.stopPropagation()}
        >
            <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
            
            <div className={styles.modalHeader}>
                <img src={invite.thumbnailUrl || '/default-event.jpg'} alt="banner" />
                <div className={styles.headerOverlay}>
                    <h2>{invite.title}</h2>
                </div>
            </div>

            <div className={styles.modalBody}>
                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <User className={styles.icon} />
                        <div><label>Nhà tổ chức</label><p>{invite.creatorName}</p></div>
                    </div>
                    <div className={styles.infoItem}>
                        <Calendar className={styles.icon} />
                        <div><label>Thời gian</label><p>{new Date(invite.startTime).toLocaleDateString()} - {new Date(invite.endTime).toLocaleDateString()}</p></div>
                    </div>
                    <div className={styles.infoItem}>
                        <Trophy className={styles.icon} />
                        <div><label>Tổng giải thưởng</label><p>{invite.totalPrizePool?.toLocaleString()} đ</p></div>
                    </div>
                    <div className={styles.infoItem}>
                        <Users className={styles.icon} />
                        <div><label>Người tham gia</label><p>{invite.participantCount} bài dự thi</p></div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3><Info size={16} /> Nội dung sự kiện</h3>
                    <p>{invite.description}</p>
                </div>

                {invite.prizes && invite.prizes.length > 0 && (
                    <div className={styles.section}>
                        <h3><Trophy size={16} /> Cơ cấu giải thưởng</h3>
                        <div className={styles.expertTags}>
                            {invite.prizes.map((p, idx) => (
                                <span key={idx} className={styles.tag}>
                                    Hạng {p.ranked}: {p.rewardAmount?.toLocaleString()} đ
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {!isHistory && (
                <div className={styles.modalActions}>
                    <button className={styles.btnDecline} onClick={() => onDecline(invite.eventId)}>Từ chối</button>
                    <button className={styles.btnAccept} onClick={() => onAccept(invite.eventId)}>Đồng ý tham gia</button>
                </div>
            )}
        </motion.div>
    </motion.div>
);

export default InvitationDetailModal;