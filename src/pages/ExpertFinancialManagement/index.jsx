import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Wallet, Calendar, CheckCircle2, Download,
    History, TrendingUp, DollarSign, Briefcase,
    Clock, Search, ChevronRight, Filter,
    ArrowUpCircle, AlertCircle, FileText,
    ArrowUpRight, ArrowDownLeft
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import { useFinancialManagement } from "@/features/financial";
import { PATHS } from "@/app/routes/paths";
import styles from "./Financial.module.scss";

const FinancialManagement = () => {
    const navigate = useNavigate();

    const {
        // UI State & Pagination
        activeTab,
        setActiveTab,
        isLoading,
        searchTerm,
        setSearchTerm,
        filterType,
        setFilterType,
        currentPage,
        setCurrentPage,
        rowsPerPage,
        totalPages,
        dateRange,
        setDateRange,

        // Dữ liệu đã qua xử lý
        currentTableData,         // Dữ liệu hiển thị trên bảng (theo trang)
        currentEventsData,
        assetDynamicsChartData,   // Dữ liệu biểu đồ AreaChart
        financialSummary,         // { availableBalance, totalManagedEvents, pendingReconciliations, monthlyRevenue }
        managedEvents,            // Danh sách sự kiện quản lý
        reconciliationList,       // Danh sách đối soát (PendingFix)
        filteredTransactions,     // Toàn bộ GD sau khi filter (để tính tổng số kết quả)

        // Các hàm xử lý hành động
        handleExportCSV,
        handleApproveEscrow,
        handleEventClick,

        // Các hàm định dạng (Helpers)
        formatVND,
        formatYAxis,
        fetchData,
        selectedEvent,
        setSelectedEvent,
        scrollToTop,
        showScrollTop
    } = useFinancialManagement();

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const totalCount = activeTab === 'events' ? managedEvents.length : filteredTransactions.length;

        return (
            <div className={styles.pagination}>
                <div className={styles.pageInfo}>
                    Showing <strong>{(currentPage - 1) * rowsPerPage + 1}</strong> to{" "}
                    <strong>{Math.min(currentPage * rowsPerPage, totalCount)}</strong> of{" "}
                    {totalCount} results
                </div>
                <div className={styles.pageControls}>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className={styles.pageBtn}
                    >
                        Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        // Logic để hiển thị giới hạn số trang nếu totalPages quá lớn
                        if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`${styles.pageNumber} ${currentPage === pageNum ? styles.activePage : ""}`}
                                >
                                    {pageNum}
                                </button>
                            );
                        } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                            return <span key={pageNum}>...</span>;
                        }
                        return null;
                    })}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className={styles.pageBtn}
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            {/* Header Section */}
            <header className={styles.topBar}>
                <div className={styles.welcomeText}>
                    <h1>Financial Hub</h1>
                    <p>Manage your cash flow, event settlements, and asset growth</p>
                </div>
                <div className={styles.topActions}>
                    <button className={styles.secondaryBtn} onClick={handleExportCSV}>
                        <Download size={18} /> Export CSV
                    </button>
                    <button onClick={() => navigate(PATHS.EXPERT_WALLET)} className={styles.primaryBtn}>
                        <Wallet size={18} /> My Wallet
                    </button>
                </div>
            </header>

            {/* Statistics Grid */}
            <section className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={`${styles.iconBox} ${styles.blue}`}><DollarSign /></div>
                    <div className={styles.statContent}>
                        <span>Available Balance</span>
                        <h2>{formatVND(financialSummary.availableBalance)}</h2>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.iconBox} ${styles.green}`}><TrendingUp /></div>
                    <div className={styles.statContent}>
                        <span>Monthly Revenue (M{new Date().getMonth() + 1})</span>
                        <h2 className={styles.income}>+{financialSummary.monthlyRevenue.toLocaleString()} VND</h2>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.iconBox} ${styles.purple}`}><Briefcase /></div>
                    <div className={styles.statContent}>
                        <span>Managed Events</span>
                        <h2>{financialSummary.totalManagedEvents}</h2>
                    </div>
                </div>
            </section>

            <div className={styles.stackedLayout}>
                {/* Left Column: Visualization */}
                <div className={styles.fullWidthSection}>
                    <div className={styles.chartContainer}>
                        <div className={styles.cardHeader}>
                            <div className={styles.titleGroup}>
                                <TrendingUp size={18} />
                                <h3>Cumulative Revenue</h3>
                            </div>
                            <div className={styles.dateFilters}>
                                <div className={styles.inputGroup}>
                                    <Calendar size={14} />
                                    <input
                                        type="date"
                                        value={dateRange.startDate}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                    />
                                </div>
                                <span className={styles.divider}>to</span>
                                <div className={styles.inputGroup}>
                                    <Calendar size={14} />
                                    <input
                                        type="date"
                                        value={dateRange.endDate}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.chartBody}>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={assetDynamicsChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                                    <YAxis
                                        tickFormatter={formatYAxis}
                                        width={80}
                                        axisLine={false}
                                        tickLine={false}
                                        style={{ fontSize: '12px' }}
                                        domain={[0, 'auto']}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                                        formatter={(val) => [`${val.toLocaleString()} VND`, "Revenue"]}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {financialSummary.pendingReconciliations > 0 && (
                        <div className={styles.alertBanner} onClick={() => setActiveTab("reconciliation")}>
                            <AlertCircle className={styles.blink} />
                            <span>Attention: You have {financialSummary.pendingReconciliations} pending settlement approvals!</span>
                            <ChevronRight size={18} />
                        </div>
                    )}
                </div>

                {/* Right Column: Interactive Ledger */}
                <div className={styles.fullWidthSection}>
                    <div className={styles.contentCard}>
                        <div className={styles.cardHeaderTabs}>
                            <div className={styles.tabs}>
                                <button className={activeTab === "history" ? styles.active : ""} onClick={() => setActiveTab("history")}>
                                    <History size={16} /> History
                                </button>
                                <button className={activeTab === "events" ? styles.active : ""} onClick={() => setActiveTab("events")}>
                                    <Calendar size={16} /> My Events
                                </button>
                                <button className={activeTab === "reconciliation" ? styles.active : ""} onClick={() => setActiveTab("reconciliation")}>
                                    <CheckCircle2 size={16} /> Reconciliation
                                </button>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className={styles.filterBar}>
                            <div className={styles.searchWrapper}>
                                <Search size={16} />
                                <input
                                    placeholder="Search code, description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {activeTab === "history" && (
                                <div className={styles.quickFilters}>
                                    <button className={filterType === "all" ? styles.fActive : ""} onClick={() => setFilterType("all")}>All</button>
                                    <button className={filterType === "income" ? styles.fActive : ""} onClick={() => setFilterType("income")}>Income</button>
                                    <button className={filterType === "expense" ? styles.fActive : ""} onClick={() => setFilterType("expense")}>Expense</button>
                                </div>
                            )}
                        </div>

                        <div className={styles.scrollBody}>
                            {isLoading ? (
                                <div className={styles.loaderArea}>
                                    <div className={styles.skeletonStrip}></div>
                                    <div className={styles.skeletonStrip}></div>
                                    <div className={styles.skeletonStrip}></div>
                                    <div className={styles.skeletonStrip}></div>
                                </div>
                            ) : (
                                <>
                                    {/* History Tab */}
                                    {activeTab === "history" && (
                                        <div className={styles.tableResponsive}>
                                            <table className={styles.ledgerTable}>
                                                <thead>
                                                    <tr>
                                                        <th>Timestamp</th>
                                                        <th>Detail</th>
                                                        <th className={styles.textRight}>Before</th>
                                                        <th className={styles.textRight}>Change</th>
                                                        <th className={styles.textRight}>Wallet Balance</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentTableData.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="5" className={styles.emptyRow}>
                                                                <div className={styles.emptyState}>
                                                                    <FileText size={40} />
                                                                    <p>No transactions found matching your criteria</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : currentTableData.map(transaction => (
                                                        <tr key={transaction.transactionId} className={styles.rowHover}>
                                                            <td>
                                                                <div className={styles.timeStack}>
                                                                    <span>{new Date(transaction.createdAt).toLocaleDateString('vi-VN')}</span>
                                                                    <small>{new Date(transaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className={styles.descStack}>
                                                                    <span className={styles.mainDesc}>{transaction.description || "Wallet Transaction"}</span>
                                                                    <div className={styles.tagGroup}>
                                                                        {/* Nếu là tiền đang bị hệ thống giữ (Locked) */}
                                                                        {transaction.type?.includes("Locked") ? (
                                                                            <span className={styles.escrowTag}>
                                                                                <Clock size={10} /> Escrow (Held)
                                                                            </span>
                                                                        ) : (
                                                                            <span className={styles.walletTag}>
                                                                                <CheckCircle2 size={10} /> Available
                                                                            </span>
                                                                        )}
                                                                        <code className={styles.code}>{transaction.transactionCode}</code>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className={styles.textRight}>
                                                                {formatVND(transaction.balanceAfter - transaction.amount)}
                                                            </td>
                                                            <td className={`${styles.textRight} ${transaction.amount > 0 ? styles.plus : styles.minus}`}>
                                                                <div className={styles.amountDisplay}>
                                                                    {transaction.amount > 0 ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                                                                    {formatVND(transaction.amount)}
                                                                </div>
                                                            </td>
                                                            <td className={`${styles.textRight} ${styles.finalBal}`}>
                                                                {formatVND(transaction.balanceAfter)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {renderPagination()}
                                        </div>
                                    )}

                                    {/* Events Tab */}
                                    {activeTab === "events" && (
                                        <div className={styles.eventList}>
                                            {currentEventsData.length === 0 ? (
                                                <div className={styles.emptyState}>
                                                    <Briefcase size={40} />
                                                    <p>You haven't created any events yet</p>
                                                </div>
                                            ) : (
                                                <>{currentEventsData.map(event => (
                                                    <div key={event.eventId}
                                                        id={`event-row-${event.eventId}`}
                                                        className={styles.eventRow}
                                                        onClick={() => handleEventClick(event)}>
                                                        <div className={styles.evMain}>
                                                            <div className={styles.evIcon}><Calendar size={20} /></div>
                                                            <div className={styles.evInfo}>
                                                                <h4>{event.title}</h4>
                                                                <span>Created: {new Date(event.createdAt).toLocaleDateString('vi-VN')}</span>
                                                            </div>
                                                        </div>
                                                        <button className={styles.viewDetailBtn}>Details <ChevronRight size={14} /></button>
                                                    </div>
                                                ))}
                                                    {renderPagination()}
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Reconciliation Tab */}
                                    {activeTab === "reconciliation" && (
                                        <div className={styles.approvalList}>
                                            {reconciliationList.length === 0 ? (
                                                <div className={styles.emptyState}>
                                                    <CheckCircle2 size={40} color="#10b981" />
                                                    <p>Great! All settlements are up to date.</p>
                                                </div>
                                            ) : reconciliationList.map(item => (
                                                <div key={item.escrowSessionId} className={styles.approvalCard}>
                                                    <div className={styles.apInfo}>
                                                        <h5>{item.eventTitle}</h5>
                                                        <p>{item.description}</p>
                                                        <span className={styles.amountLabel}>
                                                            Final Amount: <strong>{formatVND(item.finalAmount)}</strong>
                                                        </span>
                                                    </div>
                                                    <button
                                                        className={styles.approveBtn}
                                                        onClick={() => handleApproveEscrow(item.escrowSessionId)}
                                                    >
                                                        Approve Settlement
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals & Overlays */}

            {showScrollTop && (
                <button className={styles.scrollTop} onClick={scrollToTop}>
                    <ArrowUpCircle size={28} />
                </button>
            )}
        </div>
    );
};

export default FinancialManagement;