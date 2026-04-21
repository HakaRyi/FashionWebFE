import React from 'react';
import styles from '../styles/Analytics.module.scss';

const TopEvents = ({ events }) => {
    // Mock data chuẩn xác với model C#
    const defaultEvents = [
        { id: 1, title: 'Xu hướng Thu Đông 2024', posts: 120, rated: 100, engagements: '3.2K' },
        { id: 2, title: 'Minimalist Styling', posts: 85, rated: 40, engagements: '1.8K' },
        { id: 3, title: 'Phối đồ Công sở', posts: 50, rated: 5, engagements: '950' },
    ];

    const displayEvents = events?.length > 0 ? events : defaultEvents;

    return (
        <div className={styles.topEventsList}>
            {displayEvents.map((event) => {
                const progressPercentage = event.posts > 0 ? Math.round((event.rated / event.posts) * 100) : 0;
                
                return (
                    <div key={event.id} className={styles.eventItem}>
                        <div className={styles.eventInfo}>
                            <span className={styles.eventTitle}>{event.title}</span>
                            <div className={styles.eventMetrics}>
                                <small>{event.engagements} interactions</small>
                                <small className={styles.gradingStatus}>
                                    Marked: {event.rated}/{event.posts} submissions
                                </small>
                            </div>
                        </div>
                        <div className={styles.progressTrack} title={`${progressPercentage}% đã chấm`}>
                            <div 
                                className={`${styles.progressBar} ${progressPercentage === 100 ? styles.completed : ''}`} 
                                style={{ width: `${progressPercentage}%`, backgroundColor: progressPercentage < 50 ? '#ef4444' : '#10b981' }} 
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TopEvents;