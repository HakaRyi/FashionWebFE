import React, { useState } from 'react';
import { PenTool, Image as ImageIcon, Heart, CreditCard, AlertCircle, RefreshCw } from 'lucide-react';
import {
    StatCard,
    PerformanceChart,
    TopEvents,
    useAnalytics
} from '@/features/analytics';
import styles from '@/features/analytics/styles/Analytics.module.scss';

const Analytics = () => {
    const {
        stats, topEvents, chartData, loading, isRefreshing, error,
        startDate, endDate, setStartDate, setEndDate,
        handleFastSelect, dates, refresh
    } = useAnalytics();

    const iconMap = {
        'Total number of entries': <ImageIcon size={20} color="#3b82f6" />,
        'Progress in grading': <PenTool size={20} color="#10b981" />,
        'Community engagement': <Heart size={20} color="#ec4899" />,
        'Event creation costs': <CreditCard size={20} color="#f59e0b" />,
    };

    if (error) return (
        <div className={styles.errorContainer}>
            <div className={styles.errorCard}>
                <AlertCircle size={48} className={styles.errorIcon} />
                <h2>An error occurred</h2>
                <p>{error}</p>
                <button onClick={refresh} className={styles.retryButton}>
                    <RefreshCw size={18} /> Try again now
                </button>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>Analytics Dashboard</h1>
                    <p>Detailed reports on event performance and expert engagement metrics.</p>
                </div>

                <div className={styles.controls}>
                    {/* Time Period Toggle */}
                    <div className={styles.timeFilter}>
                        <button
                            // Truy cập dates.last30 từ Hook trả về
                            className={startDate === dates.last30 ? styles.active : ''}
                            onClick={() => handleFastSelect(30)}
                        >
                            Last 30 Days
                        </button>
                        <button
                            // Truy cập dates.last90 từ Hook trả về
                            className={startDate === dates.last90 ? styles.active : ''}
                            onClick={() => handleFastSelect(90)}
                        >
                            Last 90 Days
                        </button>
                    </div>

                    {/* Custom Date Range Picker */}
                    <div className={styles.datePickerGroup}>
                        <div className={styles.inputField}>
                            <label>From</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div className={styles.divider}></div>

                        <div className={styles.inputField}>
                            <label>To</label>
                            <input
                                type="date"
                                value={endDate}
                                max={dates.today}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <div
                className={styles.dashboardContent}
                style={{
                    opacity: isRefreshing ? 0.6 : 1,
                    transition: 'opacity 0.2s ease-in-out',
                    pointerEvents: isRefreshing ? 'none' : 'auto'
                }}>

                <div className={styles.statsGrid}>
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className={`${styles.statCard} ${styles.skeleton}`} />
                        ))
                    ) : (
                        stats.map((stat, index) => (
                            <StatCard
                                key={stat.label}
                                stat={{
                                    ...stat,
                                    icon: iconMap[stat.label] || <PenTool size={20} />
                                }}
                                index={index}
                            />
                        ))
                    )}
                </div>

                <div className={styles.chartsRow}>
                    <div className={styles.mainChartWrapper}>
                        {loading ? (
                            <div className={`${styles.chartPlaceholder} ${styles.skeleton}`} />
                        ) : (
                            <PerformanceChart chartData={chartData} />
                        )}
                    </div>

                    <aside className={styles.sideContent}>
                        <div className={styles.sideCardHeader}>
                            <h3>Events Requiring Attention</h3>
                            <p>Based on the number of ungraded submissions & engagement</p>
                        </div>

                        {loading ? (
                            <div className={styles.listSkeleton}>
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className={styles.skeletonItem} />
                                ))}
                            </div>
                        ) : (
                            <TopEvents events={topEvents} />
                        )}
                    </aside>
                </div>
            </div>
            {isRefreshing && <div className={styles.topLoader} />}
        </div>
    );
};

export default Analytics;