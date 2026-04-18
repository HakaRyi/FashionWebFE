import React, { useEffect, useState } from 'react';
import styles from './ExpertReputation.module.scss';
import { useExpertReputation } from '@/features/expert';

const ExpertReputation = () => {

    const { data, loading } = useExpertReputation();

    if (loading) {
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.spinner}></div>
                <p>Loading reliable data...</p>
            </div>
        );
    }

    return (
        <div className={styles.reputationPage}>
            <div className={styles.reputationContainer}>
                <header className={styles.reputationHeader}>
                    <h1>Expert Reputation Score</h1>
                    <p>System for evaluating responsibility and competence based on judging activities</p>
                </header>
                <div className={styles.scrollableContent}>
                    <div className={styles.statsGrid}>
                        {/* Thẻ hiển thị điểm số */}
                        <div className={`${styles.statCard} ${styles.scoreCard}`}>
                            <span className={styles.label}>Current Reputation Score</span>
                            <div className={styles.valueGroup}>
                                <span className={styles.value}>{data?.currentReputationScore ?? 0}</span>
                                <span className={styles.total}>/ 100</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.fill}
                                    style={{ width: `${data?.currentReputationScore ?? 0}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Thẻ hiển thị rating */}
                        <div className={`${styles.statCard} ${styles.ratingCard}`}>
                            <span className={styles.label}>Average Rating</span>
                            <div className={styles.value}>{data?.averageRating?.toFixed(1) ?? "0.0"}</div>
                            <div className={styles.stars}>
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < Math.round(data?.averageRating || 0) ? styles.starFilled : styles.star}>
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.mainContent}>
                        {/* Quy tắc hệ thống */}
                        <section className={styles.section}>
                            <div className={styles.sectionTitle}>
                                <span className={styles.icon}>⚖️</span>
                                <h2>Scoring Rules: Bonus & Penalty</h2>
                            </div>
                            <div className={styles.rulesGrid}>
                                <div className={`${styles.ruleItem} ${styles.bonus}`}>
                                    <h4>Bonus Points for Recovery</h4>
                                    <ul>
                                        <li><strong>+5 points:</strong> Complete grading 100% of exam papers.</li>
                                        <li><em>Maximum: 100 points.</em></li>
                                    </ul>
                                </div>
                                <div className={`${styles.ruleItem} ${styles.penalty}`}>
                                    <h4>Violation Rules</h4>
                                    <ul>
                                        <li><strong>-2 points:</strong> Miss grading below 10% of exam papers.</li>
                                        <li><strong>-10 points:</strong> Missing from 10% - 50%.</li>
                                        <li><strong>-20 points:</strong> Missing above 50%.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* BẢNG LỊCH SỬ BIẾN ĐỘNG */}
                        <section className={styles.section}>
                            <div className={styles.sectionTitle}>
                                <span className={styles.icon}>⏳</span>
                                <h2>History of Reputation Changes</h2>
                            </div>
                            <div className={styles.tableContainer}>
                                <table className={styles.reputationTable}>
                                    <thead>
                                        <tr>
                                            <th>Time</th>
                                            <th>Reason for Change</th>
                                            <th className={styles.textCenter}>Change</th>
                                            <th className={styles.textCenter}>Final Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.history && data.history.length > 0 ? (
                                            // Sắp xếp lịch sử mới nhất lên đầu
                                            [...data.history].reverse().map((item, index) => (
                                                <tr key={index}>
                                                    <td className={styles.timeCol}>
                                                        {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                                        <span>{new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </td>
                                                    <td className={styles.reasonCol}>
                                                        {item.reason}
                                                    </td>
                                                    <td className={`${styles.changeCol} ${item.pointChange > 0 ? styles.positive : styles.negative}`}>
                                                        {item.pointChange > 0 ? `+${item.pointChange}` : item.pointChange}
                                                    </td>
                                                    <td className={styles.afterCol}>
                                                        {item.pointAfterChange}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className={styles.emptyRow}>There is no recorded history.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpertReputation;