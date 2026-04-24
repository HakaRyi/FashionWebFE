import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/app/routes/paths';
import { getEventStatusInfo } from '@/features/events/utils/eventStatus';
import styles from '../styles/EventSidebar.module.scss';

const EventSidebarSection = ({ events = [], isLoading, onOpenQuickView }) => {
    const navigate = useNavigate();

    const displayedEvents = useMemo(() => events.slice(0, 1), [events]);

    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const handleUserClick = (e, creatorId) => {
        e.stopPropagation();
        const targetPath = PATHS.EXPERT_PROFILE.replace(':id', creatorId);
        navigate(targetPath);
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Featured Events</h3>
                <div className={styles.titleLine}></div>
            </div>

            {isLoading ? (
                <div className={styles.statusBox}>
                    <div className={styles.spinner}></div>
                    <span>Loading trends...</span>
                </div>
            ) : events.length === 0 ? (
                <div className={styles.statusBox}>
                    <p>No active events</p>
                </div>
            ) : (
                <div className={styles.eventList}>
                    {displayedEvents.map((event) => {
                        // Tính toán status ngay tại đây
                        const statusInfo = getEventStatusInfo(event?.status);

                        return (
                            <div
                                key={event.eventId}
                                className={styles.eventCard}
                                onClick={() => onOpenQuickView(event)}
                            >
                                <div className={styles.cardHeader}>
                                    <span className={`${styles.statusBadge} ${styles[statusInfo.variant]}`}>
                                        {statusInfo.label}
                                    </span>
                                </div>

                                <div
                                    className={styles.expertInfo}
                                    onClick={(e) => handleUserClick(e, event.creatorId)}
                                >
                                    <img
                                        src={event.creatorAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(event.creatorName)}&background=random&color=fff`}
                                        alt={event.creatorName}
                                        className={styles.expertAvatar}
                                    />
                                    <span className={styles.expertName}>{event.creatorName}</span>
                                </div>

                                <div className={styles.cardBody}>
                                    <h4 className={styles.eventTitle}>{event.title}</h4>
                                    <p className={styles.description}>
                                        {truncateText(event.description, 55)}
                                    </p>

                                    {event.thumbnailUrl && (
                                        <div className={styles.imageWrapper}>
                                            <img src={event.thumbnailUrl} alt={event.title} />
                                        </div>
                                    )}
                                </div>

                                <div className={styles.cardFooter}>
                                    <div className={styles.prizeBox}>
                                        <span className={styles.label}>PRIZE POOL </span>
                                        <span className={styles.value}>
                                            {event.totalPrizePool?.toLocaleString('vi-VN')} <small>VND</small>
                                        </span>
                                    </div>
                                    <div className={styles.statsBox}>
                                        <span className={styles.count}>{event.participantCount}</span>
                                        <span className={styles.sub}> JOINED</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!isLoading && events.length > 2 && (
                <button
                    className={styles.showAllBtn}
                    onClick={() => navigate(PATHS.USER_EVENTS)}
                >
                    VIEW ALL TRENDS ({events.length})
                </button>
            )}
        </aside>
    );
};

export default EventSidebarSection;