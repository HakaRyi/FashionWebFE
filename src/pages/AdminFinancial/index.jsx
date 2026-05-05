import React, { useState, useMemo } from 'react';
import {
    ShieldCheck, AlertTriangle, Search, Filter,
    ChevronLeft, ChevronRight, Inbox, Eye,
    History, Calendar, RefreshCw, CheckCircle,
    ArrowUpRight, ArrowDownLeft, ChevronDown
} from 'lucide-react';
import { useAdminFinancial, TransactionDetailModal, EscrowFixModal, CampaignPickerModal } from '@/features/financial';
import { formatMoney } from '@/shared/utils/format';
import styles from './AdminFinancial.module.scss';

const AdminFinancial = () => {
    const {
        activeTab, setActiveTab,
        isLoading, isActionLoading,
        searchTerm, setSearchTerm,
        setIsCampaignPickerOpen, isCampaignPickerOpen,
        filters, setFilters,
        eventList = [],
        currentTableData = [],
        totalPages, currentPage, setCurrentPage,
        handleAdminRequestFix,
        handleAdminExecute,
        totalCount = 0,
        refreshData
    } = useAdminFinancial();

    // Local UI State
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalType, setModalType] = useState(null); // 'detail' | 'fix'

    // --- Handlers ---
    const handleOpenModal = (item, type) => {
        setSelectedItem(item);
        setModalType(type);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
        setModalType(null);
    };

    const handleConfirmFix = async (id, reason) => {
        await handleAdminRequestFix(id, reason);
        handleCloseModal();
    };

    const handleExecuteEscrow = async (id) => {
        if (window.confirm('Are you sure you want to disburse this escrow immediately?')) {
            await handleAdminExecute(id);
        }
    };

    // --- Render Helpers ---
    const renderPagination = useMemo(() => {
        if (totalPages <= 1) return null;

        // Tính toán phạm vi trang cần hiển thị (cửa sổ trượt)
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        // Điều chỉnh lại nếu ở các trang cuối
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className={styles.footerPagination}>
                <span className={styles.recordInfo}>
                    Page <b>{currentPage}</b> of {totalPages} — Total {totalCount} records
                </span>
                <div className={styles.pageButtons}>
                    <button
                        disabled={currentPage === 1 || isLoading}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {pages.map((pageNum) => (
                        <button
                            key={pageNum}
                            className={currentPage === pageNum ? styles.activePage : ''}
                            onClick={() => setCurrentPage(pageNum)}
                        >
                            {pageNum}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages || isLoading}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        );
    }, [currentPage, totalPages, totalCount, isLoading, setCurrentPage]);

    return (
        <div className={styles.adminContainer}>
            {/* 1. Quick Statistics Overview */}
            <section className={styles.statGrid}>
                <StatCard
                    icon={<History />}
                    label="Current Context"
                    value={`${totalCount.toLocaleString()} ${activeTab === 'all-transactions' ? 'Transactions' : 'Escrow Sessions'}`}
                />
                <StatCard
                    icon={<ShieldCheck />}
                    label="Escrow System"
                    value="Stable"
                    variant="blue"
                    isStatus
                />
                <StatCard
                    icon={<Calendar />}
                    label="Active Campaigns"
                    value={eventList.length}
                    variant="orange"
                />
            </section>

            {/* 2. Page Header */}
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1>Financial Administration</h1>
                    <span className={styles.liveIndicator}>System Monitoring</span>
                </div>
                <button className={styles.refreshBtn} onClick={refreshData} disabled={isLoading}>
                    <RefreshCw size={16} className={isLoading ? styles.spinning : ''} />
                    Refresh Data
                </button>
            </header>

            {/* 3. Navigation & Main Controls */}
            <div className={styles.controlHeader}>
                <div className={styles.tabWrapper}>
                    <button
                        className={activeTab === 'all-transactions' ? styles.active : ''}
                        onClick={() => setActiveTab('all-transactions')}
                    >
                        <History size={18} /> Transaction Logs
                    </button>
                    <button
                        className={activeTab === 'escrow-fix' ? styles.active : ''}
                        onClick={() => setActiveTab('escrow-fix')}
                    >
                        <AlertTriangle size={18} /> Escrow Management
                    </button>
                </div>

                <div className={styles.searchBar}>
                    <Search size={18} />
                    <input
                        placeholder="Search ID, username, description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* 4. Advanced Filters */}
            <div className={styles.filterBar}>
                <div className={styles.filterGroup}>
                    <div className={styles.filterItem}>
                        <Filter size={14} />
                        <div className={styles.selectWrapper}>
                            <button
                                className={styles.pickerTrigger}
                                onClick={() => setIsCampaignPickerOpen(true)}
                            >
                                {filters.eventId ?
                                    eventList.find(e => e.eventId === filters.eventId)?.title :
                                    "Select Campaign..."
                                }
                                <ChevronDown size={14} className={styles.chevronIcon} />
                            </button>

                        </div>
                    </div>

                    {activeTab === 'all-transactions' && (
                        <>
                            <div className={styles.filterItem}>
                                <div className={styles.selectWrapper}>
                                    <select value={filters.type || ''} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
                                        <option value="">All Flow Types</option>
                                        <option value="Credit">Credit (+)</option>
                                        <option value="Debit">Debit (-)</option>
                                    </select>
                                    <ChevronDown size={14} className={styles.chevronIcon} />
                                </div>
                            </div>
                            <div className={styles.filterItem}>
                                <div className={styles.selectWrapper}>
                                    <select value={filters.refType || ''} onChange={(e) => setFilters({ ...filters, refType: e.target.value })}>
                                        <option value="">Source: All</option>
                                        <option value="Event">Campaign Events</option>
                                        {/* <option value="Withdrawal">Withdrawals</option> */}
                                    </select>
                                    <ChevronDown size={14} className={styles.chevronIcon} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
                {filters.eventId && (
                    <button className={styles.clearFilter} onClick={() => setFilters({ ...filters, eventId: '' })}>
                        Reset Filters
                    </button>
                )}
            </div>

            {/* 5. Data Table */}
            <div className={styles.mainTableCard}>
                <table className={styles.table}>
                    <thead>
                        {activeTab === 'all-transactions' ? (
                            <tr>
                                <th>Transaction Details</th>
                                <th>User Entity</th>
                                <th>Description</th>
                                <th>Amount Change</th>
                                <th>Timestamp</th>
                                <th align="center">Actions</th>
                            </tr>
                        ) : (
                            <tr>
                                <th>Escrow ID</th>
                                <th>Project / Campaign</th>
                                <th>Recipient</th>
                                <th>Escrow Amount</th>
                                <th>Status</th>
                                <th align="center">Resolution</th>
                            </tr>
                        )}
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <TableSkeleton rows={8} cols={6} />
                        ) : currentTableData.length > 0 ? (
                            currentTableData.map((item) => (
                                <tr key={item.transactionId || item.escrowSessionId || item.id}>
                                    {activeTab === 'all-transactions' ? (
                                        <TransactionRow
                                            item={item}
                                            onOpenDetail={() => handleOpenModal(item, 'detail')}
                                        />
                                    ) : (
                                        <EscrowRow
                                            item={item}
                                            onFix={() => handleOpenModal(item, 'fix')}
                                            onExecute={handleExecuteEscrow}
                                            isActionLoading={isActionLoading}
                                        />
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr className={styles.emptyRow}>
                                <td colSpan="100%">
                                    <div className={styles.emptyWrapper}>
                                        <EmptyState />
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 6. Footer Pagination */}
            {renderPagination}

            {/* 7. Modals Layer */}
            <TransactionDetailModal
                isOpen={modalType === 'detail'}
                item={selectedItem}
                onClose={handleCloseModal}
            />

            <EscrowFixModal
                isOpen={modalType === 'fix'}
                item={selectedItem}
                isActionLoading={isActionLoading}
                onClose={handleCloseModal}
                onConfirm={handleConfirmFix}
            />

            <CampaignPickerModal
                isOpen={isCampaignPickerOpen}
                onClose={() => setIsCampaignPickerOpen(false)}
                events={eventList}
                onSelect={(id) => setFilters({ ...filters, eventId: id })}
                selectedId={filters.eventId}
            />
        </div>
    );
};

/* --- SUB-COMPONENTS --- */

const StatCard = ({ icon, label, value, variant = '', isStatus = false }) => (
    <div className={styles.statCard}>
        <div className={`${styles.iconBox} ${styles[variant]}`}>{icon}</div>
        <div className={styles.statContent}>
            <p>{label}</p>
            <h3 className={isStatus ? styles.statusText : ''}>{value}</h3>
        </div>
    </div>
);

const TransactionRow = ({ item, onOpenDetail }) => {
    const dateObj = item.createdAt ? new Date(item.createdAt) : null;

    const formattedDate = dateObj ? dateObj.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }) : 'N/A';

    const formattedTime = dateObj ? dateObj.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }) : '';

    return (
        <>
            <td>
                <div className={styles.idCell}>
                    <span className={styles.code}>{item.transactionCode || 'N/A'}</span>
                    <span className={styles.refId}>Ref: #{item.referenceId}</span>
                </div>
            </td>
            <td>
                <div className={styles.userCell}>
                    <strong>{item.userName || 'Anonymous'}</strong>
                    <span>ID: {String(item.walletId || '').slice(0, 8)}...</span>
                </div>
            </td>
            <td>
                <div className={styles.descCell}>
                    <TypeTag type={item.type} />
                    <p title={item.description}>{item.description}</p>
                </div>
            </td>
            <td>
                <div className={styles.amountCell}>
                    <span className={item.balanceAfter >= item.balanceBefore ? styles.plus : styles.minus}>
                        {/* Thêm dấu + hoặc - */}
                        {item.balanceAfter >= item.balanceBefore ? '+' : '-'}

                        {formatMoney(Math.abs(item.amount || 0))}
                    </span>
                    <small>Bal: {formatMoney(item.balanceAfter)}</small>
                </div>
            </td>
            <td className={styles.timeCell}>
                {formattedDate}<br />
                <small>{formattedTime}</small>
            </td>
            <td align="center">
                <button className={styles.iconBtn} onClick={onOpenDetail} title="View Details">
                    <Eye size={18} />
                </button>
            </td>
        </>
    );
};

const EscrowRow = ({ item, onFix, onExecute, isActionLoading }) => (
    <>
        <td>
            <div className={styles.idCell}>
                <span className={styles.escrowId}>#E{item.escrowSessionId || item.id}</span>
                {item.status === 'Held' && (
                    <small className={styles.timer}>Hold duration: 2 days</small>
                )}
            </div>
        </td>
        <td>
            <div className={styles.eventInfo}>
                <strong>{item.eventTitle || 'Campaign Project'}</strong>
                <span className={styles.miniTag}>UUID: {item.eventId || 'N/A'}</span>
            </div>
        </td>
        <td><div className={styles.receiver}>{item.receiverName || item.userName || 'System'}</div></td>
        <td><strong className={styles.amountText}>{formatMoney(item.finalAmount || item.amount)}</strong></td>
        <td><StatusBadge status={item.status} /></td>
        <td align="center">
            <div className={styles.actionGrid}>
                {item.status === 'Held' && (
                    <button
                        className={styles.btnOutlineWarn}
                        onClick={onFix}
                        disabled={!item.isIssueDetected}
                        title={!item.isIssueDetected ? "No issues detected" : "Request user to fix"}
                    >
                        Request Fix
                    </button>
                )}
                {item.status === 'ExpertApproved' && (
                    <button
                        className={styles.btnPrimarySmall}
                        onClick={() => onExecute(item.escrowSessionId || item.id)}
                        disabled={isActionLoading}
                    >
                        Release Now
                    </button>
                )}
                {item.status === 'Resolved' && <span className={styles.done}><CheckCircle size={14} /> Settled</span>}
                {item.status === 'Pending' && <span className={styles.waiting}>Processing</span>}
            </div>
        </td>
    </>
);

const TypeTag = ({ type }) => {
    const config = {
        'Refund': { label: 'Refund', class: styles.refundTag },
        'Revenue': { label: 'Revenue', class: styles.revenueTag },
        'Locked': { label: 'Locked', class: styles.lockedTag },
        'Withdraw': { label: 'Withdraw', class: styles.withdrawTag },
        'Deposit': { label: 'Deposit', class: styles.depositTag },
    };
    const style = config[type] || { label: type, class: styles.defaultTag };
    return <span className={`${styles.tag} ${style.class}`}>{style.label}</span>;
};

const StatusBadge = ({ status }) => {
    const map = {
        'Held': { text: 'On Hold', class: styles.statusHeld },
        'Resolved': { text: 'Success', class: styles.statusDone },
        'ExpertApproved': { text: 'Pending Release', class: styles.statusWait },
        'Pending': { text: 'In Progress', class: styles.statusPending },
    };
    const s = map[status] || { text: status, class: '' };
    return <span className={`${styles.statusBadge} ${s.class}`}>{s.text}</span>;
};

const EmptyState = () => (
    <div className={styles.emptyContainer}>
        <Inbox size={48} />
        <h3>No Data Found</h3>
        <p>We couldn't find any records matching your current filter criteria.</p>
    </div>
);

const TableSkeleton = ({ rows, cols }) => (
    <>
        {[...Array(rows)].map((_, i) => (
            <tr key={i}>
                {[...Array(cols)].map((_, j) => (
                    <td key={j}><div className={styles.skeletonLine}></div></td>
                ))}
            </tr>
        ))}
    </>
);

export default AdminFinancial;