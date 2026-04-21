import styles from '../styles/EventMiniCard.module.scss';
import { useMemo } from 'react';
import { PATHS } from "@/app/routes/paths";
import { useNavigate } from 'react-router-dom';
import { getEventStatusInfo } from '@/features/events/utils/eventStatus';

const EventMiniCard = ({ event, onOpenQuickView }) => {

    const navigate = useNavigate();

    const statusInfo = useMemo(() => {
        return getEventStatusInfo(event?.status);
    }, [event?.status]);

    const handleCardClick = () => {
        navigate(PATHS.EVENT_DETAIL.replace(':id', event.eventId));
    };

    return (
        <div className={styles.card} onClick={() => onOpenQuickView(event)} role="button" tabIndex={0}>
            <div className={styles.thumbnailWrapper}>
                <img src={event.thumbnailUrl} alt={event.title} />
                <div className={`${styles.statusBadge} ${styles[statusInfo.variant]}`}>
                    {statusInfo.label}
                </div>
            </div>

            <div className={styles.info}>
                <h4>{event.title}</h4>
                <p className={styles.prize}>
                    {event.totalPrizePool.toLocaleString('vi-VN')} VND
                </p>
                <div className={styles.footer}>
                    <span>👥 {event.participantCount} joined</span>
                    {event.isJoined && <span className={styles.joinedLabel}>Joined</span>}
                </div>
            </div>
        </div>
    );
};

export default EventMiniCard;