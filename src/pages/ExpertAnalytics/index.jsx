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
    const [period, setPeriod] = useState('30d');

    const { stats, topEvents, chartData, loading, error, refresh } = useAnalytics(period);

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
                <div className={styles.titleArea}>
                    <h1>Event Analytics</h1>
                    <p>Track submission progress, engagement, and performance across your events.</p>
                </div>

                <div className={styles.controls}>
                    <div className={styles.timeFilter}>
                        {['30d', '90d'].map((p) => (
                            <button
                                key={p}
                                className={period === p ? styles.active : ''}
                                onClick={() => setPeriod(p)}
                                disabled={loading}
                            >
                                {p === '30d' ? '30 days ago' : '90 days ago'}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

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
    );
};

export default Analytics;