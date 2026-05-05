import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft, Download, DollarSign,
    Filter, Calendar, ArrowUpRight, ArrowDownLeft, Users
} from "lucide-react";
import {
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { useEventFinancials } from "@/features/financial";
import styles from "./EventFinancialDetail.module.scss";

const EventFinancialDetail = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const {
        eventInfo, metrics, loading,
        activeTab, setActiveTab,
        searchQuery, setSearchQuery,
        chartAnalysis, filteredList, currentUser,
    } = useEventFinancials(eventId);

    if (loading) return <div className={styles.loader}>Analyzing Financial Streams...</div>;

    return (
        <div className={styles.pageContainer}>
            {/* HEADER SECTION */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button onClick={() => navigate(-1)} className={styles.backBtn}>
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className={styles.mainTitle}>Event Financial Audit</h1>
                        <p className={styles.subTitle}>{eventInfo?.title}</p>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.exportBtn} onClick={() => window.print()}>
                        <Download size={16} /> Export Statement
                    </button>
                </div>
            </header>

            <div className={styles.dashboardGrid}>
                {/* METRIC CARDS */}
                <div className={styles.metricsWrapper}>
                    <div className={`${styles.metricCard} ${styles.revenue}`}>
                        <div className={styles.cardInfo}>
                            <span className={styles.label}>Total Revenue</span>
                            <h2 className={styles.value}>{metrics.totalRevenue.toLocaleString()}đ</h2>
                        </div>
                        <div className={styles.iconBox}><ArrowUpRight /></div>
                    </div>
                    <div className={`${styles.metricCard} ${styles.expense}`}>
                        <div className={styles.cardInfo}>
                            <span className={styles.label}>Net Expenses</span>
                            <h2 className={styles.value}>{metrics.totalExpense.toLocaleString()}đ</h2>
                        </div>
                        <div className={styles.iconBox}><ArrowDownLeft /></div>
                    </div>
                    <div className={`${styles.metricCard} ${styles.profit}`}>
                        <div className={styles.cardInfo}>
                            <span className={styles.label}>Net Profit</span>
                            <h2 className={styles.value}>{metrics.netProfit.toLocaleString()}đ</h2>
                        </div>
                        <div className={styles.iconBox}><DollarSign /></div>
                    </div>
                </div>

                {/* CHART SECTION: Expert's Personal Cashflow */}
                <div className={styles.chartContainer}>
                    <div className={styles.chartHeader}>
                        <h3>Profit & Loss Analysis (Expert Wallet)</h3>
                    </div>
                    <div className={styles.chartBody}>
                        <ResponsiveContainer width="100%" height={260} debounce={100}>
                            <BarChart data={chartAnalysis}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(value) => `${value.toLocaleString()}đ`} />
                                <Legend verticalAlign="top" align="right" iconType="circle" />
                                <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} barSize={25} />
                                <Bar dataKey="expense" fill="#f43f5e" name="Expense" radius={[4, 4, 0, 0]} barSize={25} />
                                <Bar dataKey="refund" fill="#3b82f6" name="Refunds" radius={[4, 4, 0, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* TRANSACTION AUDIT TABLE */}
            <section className={styles.tableSection}>
                <div className={styles.tableToolbar}>
                    <div className={styles.tabGroup}>
                        <button className={activeTab === "all" ? styles.active : ""} onClick={() => setActiveTab("all")}>All Logs</button>
                        <button className={activeTab === "my_tx" ? styles.active : ""} onClick={() => setActiveTab("my_tx")}>My Transactions</button>
                        <button className={activeTab === "participants" ? styles.active : ""} onClick={() => setActiveTab("participants")}>Participants</button>
                    </div>
                    <div className={styles.filterBtn}>
                        <input
                            type="text"
                            placeholder="Search logs..."
                            className={styles.filterInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.auditTable}>
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>User</th>
                                <th>Transaction Type</th>
                                <th>Description</th>
                                <th className={styles.textRight}>Opening Balance</th>
                                <th className={styles.textRight}>Amount</th>
                                <th className={styles.textRight}>Closing Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredList.map((tx) => {
                                const isAdmin = tx.userName === 'admin';
                                const isExpert = tx.userName === currentUser;
                                const isLocked = tx.type.includes('Locked');
                                return (
                                    <tr key={tx.transactionId} className={isExpert ? styles.expertRow : styles.guestRow}>
                                        <td>
                                            <div className={styles.timeLabel}>
                                                <Calendar size={13} />
                                                {new Date(tx.createdAt).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                                            </div>
                                        </td>
                                        <td className={styles.userCell}>
                                            {isExpert ? (
                                                <span className={styles.expertBadge}>Me</span>
                                            ) : isAdmin ? (
                                                <span className={styles.adminBadge}>System</span>
                                            ) : (
                                                tx.userName
                                            )}
                                        </td>
                                        <td>
                                            <span className={`${styles.typeTag} ${isLocked ? styles.lockedTag : ""}`}>
                                                {tx.type.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className={styles.descCell}>
                                            {tx.description}
                                            {isLocked && <div className={styles.pendingNote}>Pending system release</div>}
                                        </td>
                                        <td className={styles.balanceCell}>
                                            {isExpert ? `${tx.balanceBefore.toLocaleString()}đ` : "---"}
                                        </td>

                                        {/* 2. Transaction Amount */}
                                        <td className={`${styles.amountCell} ${tx.amount > 0 ? styles.positive : styles.negative}`}>
                                            {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()}đ
                                        </td>

                                        {/* 3. Closing Balance */}
                                        <td className={styles.balanceCellHighlight}>
                                            {isExpert ? `${tx.balanceAfter.toLocaleString()}đ` : "---"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default EventFinancialDetail;