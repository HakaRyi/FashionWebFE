import React, { useState } from 'react';
import { Eye, Users, Zap, CalendarCheck, AlertCircle, RefreshCw } from 'lucide-react';
import {
    StatCard,
    PerformanceChart,
    TopEvents,
    useAnalytics
} from '@/features/analytics';
import styles from '@/features/analytics/styles/Analytics.module.scss';

const Analytics = () => {
    const [period, setPeriod] = useState('30d');

    const {
        stats,
        topEvents,
        chartData,
        loading,
        error,
        refresh
    } = useAnalytics(period);

    const iconMap = {
        'Total Reach': <Eye size={20} />,
        'Active Attendees': <Users size={20} />,
        'Engagement Rate': <Zap size={20} />,
        'Total Events': <CalendarCheck size={20} />,
    };

    if (error) return (
        <div className={styles.errorContainer}>
            <div className={styles.errorCard}>
                <AlertCircle size={48} className={styles.errorIcon} />
                <h2>Đã xảy ra lỗi</h2>
                <p>{error}</p>
                <button onClick={refresh} className={styles.retryButton}>
                    <RefreshCw size={18} /> Thử lại ngay
                </button>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1>Performance Analytics</h1>
                    <p>Theo dõi sự tăng trưởng và hiệu suất sự kiện của bạn qua thời gian.</p>
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
                                {p === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
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
                                icon: iconMap[stat.label] || <Zap size={20} />
                            }}
                            index={index}
                        />
                    ))
                )}
            </div>

            {/* Main Content: Biểu đồ và Danh sách sự kiện top */}
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
                        <h3>Top Events</h3>
                        <p>Dựa trên lượt xem và tham gia</p>
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
// import { motion } from 'framer-motion';
// import {
//     TrendingUp,
//     Users,
//     Eye,
//     Zap,
//     ArrowUpRight,
//     ArrowDownRight,
//     CalendarCheck
// } from 'lucide-react';
// import styles from './Analytics.module.scss';

// const Analytics = () => {
//     // Dữ liệu mẫu cho KPIs
//     const stats = [
//         { label: 'Total Views', value: '12.4K', change: '+14%', isUp: true, icon: <Eye size={20} /> },
//         { label: 'Active Attendees', value: '856', change: '+5.2%', isUp: true, icon: <Users size={20} /> },
//         { label: 'Engagement Rate', value: '64.2%', change: '-2.1%', isUp: false, icon: <Zap size={20} /> },
//         { label: 'Total Events', value: '12', change: '+2', isUp: true, icon: <CalendarCheck size={20} /> },
//     ];

//     return (
//         <div className={styles.container}>
//             <header className={styles.header}>
//                 <div className={styles.titleArea}>
//                     <h1>Performance Analytics</h1>
//                     <p>Track your growth and event performance over time.</p>
//                 </div>
//                 <div className={styles.timeFilter}>
//                     <button className={styles.active}>Last 30 Days</button>
//                     <button>Last 90 Days</button>
//                     <button>Yearly</button>
//                 </div>
//             </header>

//             {/* KPI GRID */}
//             <div className={styles.statsGrid}>
//                 {stats.map((stat, index) => (
//                     <motion.div
//                         key={stat.label}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.1 }}
//                         className={styles.statCard}
//                     >
//                         <div className={styles.cardHeader}>
//                             <div className={styles.iconWrapper}>{stat.icon}</div>
//                             <span className={`${styles.badge} ${stat.isUp ? styles.up : styles.down}`}>
//                                 {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
//                                 {stat.change}
//                             </span>
//                         </div>
//                         <div className={styles.cardContent}>
//                             <h3>{stat.value}</h3>
//                             <p>{stat.label}</p>
//                         </div>
//                     </motion.div>
//                 ))}
//             </div>

//             {/* CHART AREA PREVIEW */}
//             <div className={styles.chartsRow}>
//                 <section className={styles.mainChart}>
//                     <div className={styles.chartHeader}>
//                         <h3>Engagement Overview</h3>
//                         <TrendingUp size={18} className={styles.trendIcon} />
//                     </div>
//                     {/* Chỗ này sau này bạn tích hợp Chart.js hoặc Recharts */}
//                     <div className={styles.chartPlaceholder}>
//                         <div className={styles.mockChartLines}>
//                             {[...Array(6)].map((_, i) => (
//                                 <div key={i} className={styles.line} style={{ height: `${Math.random() * 100}%` }} />
//                             ))}
//                         </div>
//                         <p>Detailed engagement graph will be rendered here.</p>
//                     </div>
//                 </section>

//                 <section className={styles.sideChart}>
//                     <h3>Top Events</h3>
//                     <div className={styles.topEventsList}>
//                         {[1, 2, 3].map((item) => (
//                             <div key={item} className={styles.eventItem}>
//                                 <div className={styles.eventInfo}>
//                                     <span>Autumn Workshop 2024</span>
//                                     <small>3.2K views</small>
//                                 </div>
//                                 <div className={styles.progressTrack}>
//                                     <div className={styles.progressBar} style={{ width: `${100 - item * 20}%` }} />
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </section>
//             </div>
//         </div>
//     );
// };

// export default Analytics;