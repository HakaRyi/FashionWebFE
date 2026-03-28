import React from 'react';
import { User, Calendar, Check } from 'lucide-react';
import styles from '../styles/ExpertInvitations.module.scss';

const InvitationCard = ({ invite, isHistory, onViewDetail, onAccept, onDecline }) => (
    <div className={styles.card} onClick={onViewDetail}>
        <div className={styles.banner}>
            <img src={invite.thumbnailUrl || '/default-event.jpg'} alt="event" />
            <div className={`${styles.statusBadge} ${styles[invite.status?.toLowerCase()]}`}>
                {isHistory ? 'Đang tham gia' : 'Mới'}
            </div>
        </div>
        
        <div className={styles.cardBody}>
            <h3 className={styles.eventTitle}>{invite.title}</h3>
            
            <div className={styles.meta}>
                <span><User size={14} /> {invite.creatorName}</span>
                <span><Calendar size={14} /> {new Date(invite.startTime).toLocaleDateString()}</span>
            </div>

            <p className={styles.description}>{invite.description}</p>

            {!isHistory ? (
                <div className={styles.actions} onClick={e => e.stopPropagation()}>
                    <button onClick={() => onDecline(invite.eventId)} className={styles.btnDecline}>
                        Từ chối
                    </button>
                    <button onClick={() => onAccept(invite.eventId)} className={styles.btnAccept}>
                        Chấp nhận
                    </button>
                </div>
            ) : (
                <div className={styles.historyFooter}>
                    <Check size={14} /> Bạn đã tham gia sự kiện này
                </div>
            )}
        </div>
    </div>
);

export default InvitationCard;