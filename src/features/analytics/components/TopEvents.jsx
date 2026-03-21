import React from 'react';
import styles from '../styles/Analytics.module.scss';

const TopEvents = ({ events }) => {
    const defaultEvents = [
        { id: 1, title: 'Autumn Workshop 2024', views: '3.2K', progress: 85 },
        { id: 2, title: 'Minimalist Styling 101', views: '2.8K', progress: 70 },
        { id: 3, title: 'Paris Fashion Talk', views: '1.5K', progress: 45 },
    ];

    const displayEvents = events || defaultEvents;

    return (
        <div className={styles.topEventsList}>
            {displayEvents.map((event) => (
                <div key={event.id} className={styles.eventItem}>
                    <div className={styles.eventInfo}>
                        <span>{event.title}</span>
                        <small>{event.views} views</small>
                    </div>
                    <div className={styles.progressTrack}>
                        <div 
                            className={styles.progressBar} 
                            style={{ width: `${event.progress}%` }} 
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TopEvents;