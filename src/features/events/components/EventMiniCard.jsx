import styles from '../styles/EventMiniCard.module.scss';
import { useMemo } from 'react';
import { getEventStatusInfo } from '@/features/events/utils/eventStatus';
import { useNavigate } from 'react-router-dom';
import { PATHS } from "@/app/routes/paths";

const EventMiniCard = ({ event, onOpenQuickView }) => {
    const statusInfo = useMemo(() => {
        return getEventStatusInfo(event?.status);
    }, [event?.status]);

    const navigate = useNavigate();

    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const handleUserClick = (e) => {
        e.stopPropagation();
        const targetPath = PATHS.EXPERT_PROFILE.replace(':id', event.creatorId);
        navigate(targetPath);
    };

    return (
        <div
            className={styles.card}
            onClick={() => onOpenQuickView(event)}
            role="button"
            tabIndex={0}
        >

            <div className={styles.header}>
                <span className={`${styles.statusBadge} ${styles[statusInfo.variant]}`}>
                    {statusInfo.label}
                </span>
            </div>

            <div className={styles.expertInfo} onClick={handleUserClick}>
                <img
                    src={event.creatorAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(event.creatorName)}&background=random&color=fff`}
                    alt={event.creatorName}
                    className={styles.expertAvatar}
                />
                <span className={styles.expertName}>{event.creatorName}</span>
            </div>

            <div className={styles.verticalContent}>
                <h4 className={styles.eventTitle}>{event.title}</h4>
                <p className={styles.shortDescription}>
                    {truncateText(event.description, 120)}
                </p>

                {event.thumbnailUrl && (
                    <div className={styles.eventImageThumb}>
                        <img src={event.thumbnailUrl} alt={event.title} />
                    </div>
                )}
            </div>

            <div className={styles.footer}>
                <div className={styles.prizeContainer}>
                    <span className={styles.label}>PRIZE POOL</span>
                    <span className={styles.amount}>
                        {event.totalPrizePool.toLocaleString('vi-VN')} VND
                    </span>
                </div>
                <div className={styles.stats}>
                    <span className={styles.participantCount}>
                        {event.participantCount} <small>PARTICIPANTS</small>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default EventMiniCard;