import React, { useState, useMemo } from 'react';
import {
    ShieldCheck,
    AlertTriangle,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Inbox,
    Eye,
    History,
    Calendar,
    RefreshCw,
    CheckCircle,
    ChevronDown,
    SlidersHorizontal,
} from 'lucide-react';

import {
    useAdminFinancial,
    TransactionDetailModal,
    EscrowFixModal,
    CampaignPickerModal,
} from '@/features/financial';

import { formatMoney } from '@/shared/utils/format';
import styles from './AdminFinancial.module.scss';

const AdminFinancial = () => {
    const {
        activeTab,
        setActiveTab,
        isLoading,
        isActionLoading,
        searchTerm,
        setSearchTerm,
        setIsCampaignPickerOpen,
        isCampaignPickerOpen,
        filters,
        setFilters,
        eventList = [],
        currentTableData = [],
        totalPages,
        currentPage,
        setCurrentPage,
        handleAdminRequestFix,
        handleAdminExecute,
        totalCount = 0,
        refreshData,
    } = useAdminFinancial();

    const [selectedItem, setSelectedItem] = useState(null);
    const [modalType, setModalType] = useState(null);

    const searchPlaceholders = {
        all: 'Search order code, transaction code, username, description...',
        orderCode: 'Search by order code...',
        transactionCode: 'Search by transaction code...',
        userName: 'Search by user name...',
        description: 'Search by description...',
    };

    const currentSearchPlaceholder =
        searchPlaceholders[filters.searchBy || 'all'] || searchPlaceholders.all;

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

    const handleResetFilters = () => {
        setSearchTerm('');

        setFilters({
            ...filters,
            type: '',
            refType: '',
            eventId: '',
            searchBy: 'all',
        });
    };

    const renderPagination = useMemo(() => {
        if (totalPages <= 1) {
            return null;
        }

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        const pages = [];

        for (let i = startPage; i <= endPage; i += 1) {
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
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {pages.map((pageNum) => (
                        <button
                            key={pageNum}
                            className={currentPage === pageNum ? styles.activePage : ''}
                            onClick={() => setCurrentPage(pageNum)}
                            disabled={isLoading}
                        >
                            {pageNum}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages || isLoading}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        );
    }, [currentPage, totalPages, totalCount, isLoading, setCurrentPage]);

    return (
        <div className={styles.adminContainer}>
            <section className={styles.statGrid}>
                <StatCard
                    icon={<History />}
                    label="Current Context"
                    value={`${totalCount.toLocaleString()} ${
                        activeTab === 'all-transactions'
                            ? 'Transactions'
                            : 'Escrow Sessions'
                    }`}
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

            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1>Financial Administration</h1>
                    <span className={styles.liveIndicator}>System Monitoring</span>
                </div>

                <button
                    className={styles.refreshBtn}
                    onClick={refreshData}
                    disabled={isLoading}
                >
                    <RefreshCw
                        size={16}
                        className={isLoading ? styles.spinning : ''}
                    />
                    Refresh Data
                </button>
            </header>

            <div className={styles.controlHeader}>
                <div className={styles.tabWrapper}>
                    <button
                        className={activeTab === 'all-transactions' ? styles.active : ''}
                        onClick={() => setActiveTab('all-transactions')}
                    >
                        <History size={18} />
                        Transaction Logs
                    </button>

                    <button
                        className={activeTab === 'escrow-fix' ? styles.active : ''}
                        onClick={() => setActiveTab('escrow-fix')}
                    >
                        <AlertTriangle size={18} />
                        Escrow Management
                    </button>
                </div>

                <div className={styles.searchWrapper}>
                    <div className={styles.searchTypeBox}>
                        <SlidersHorizontal size={15} />

                        <select
                            value={filters.searchBy || 'all'}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    searchBy: e.target.value,
                                })
                            }
                        >
                            <option value="all">All</option>
                            <option value="orderCode">Order Code</option>
                            <option value="transactionCode">Transaction Code</option>
                            <option value="userName">User Name</option>
                            <option value="description">Description</option>
                        </select>

                        <ChevronDown size={14} className={styles.searchTypeChevron} />
                    </div>

                    <div className={styles.searchBar}>
                        <Search size={18} />
                        <input
                            placeholder={currentSearchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.filterBar}>
                <div className={styles.filterGroup}>
                    <div className={styles.filterItem}>
                        <Filter size={14} />

                        <div className={styles.selectWrapper}>
                            <button
                                type="button"
                                className={styles.pickerTrigger}
                                onClick={() => setIsCampaignPickerOpen(true)}
                            >
                                <span>
                                    {filters.eventId
                                        ? eventList.find((e) => e.eventId === filters.eventId)?.title
                                        : 'Select Campaign...'}
                                </span>

                                <ChevronDown size={14} className={styles.chevronIcon} />
                            </button>
                        </div>
                    </div>

                    {activeTab === 'all-transactions' && (
                        <>
                            <div className={styles.filterItem}>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={filters.type || ''}
                                        onChange={(e) =>
                                            setFilters({
                                                ...filters,
                                                type: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">All Flow Types</option>
                                        <option value="Credit">Credit (+)</option>
                                        <option value="Debit">Debit (-)</option>
                                    </select>

                                    <ChevronDown size={14} className={styles.chevronIcon} />
                                </div>
                            </div>

                            <div className={styles.filterItem}>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={filters.refType || ''}
                                        onChange={(e) =>
                                            setFilters({
                                                ...filters,
                                                refType: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">Source: All</option>
                                        <option value="OrderPayment">Order Payment</option>
                                        <option value="OrderRefund">Order Refund</option>
                                        <option value="Event">Campaign Events</option>
                                        <option value="EventFix">Event Fix</option>
                                    </select>

                                    <ChevronDown size={14} className={styles.chevronIcon} />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {(filters.eventId ||
                    filters.type ||
                    filters.refType ||
                    searchTerm ||
                    (filters.searchBy && filters.searchBy !== 'all')) && (
                    <button
                        type="button"
                        className={styles.clearFilter}
                        onClick={handleResetFilters}
                    >
                        Reset Filters
                    </button>
                )}
            </div>

            <div className={styles.mainTableCard}>
                <table
                    className={`${styles.table} ${
                        activeTab === 'all-transactions'
                            ? styles.transactionTable
                            : styles.escrowTable
                    }`}
                >
                    <thead>
                        {activeTab === 'all-transactions' ? (
                            <tr>
                                <th>Transaction Details</th>
                                <th>User Entity</th>
                                <th>Description</th>
                                <th>Amount Change</th>
                                <th>Timestamp</th>
                                <th>Actions</th>
                            </tr>
                        ) : (
                            <tr>
                                <th>Escrow ID</th>
                                <th>Project / Order</th>
                                <th>Recipient</th>
                                <th>Escrow Amount</th>
                                <th>Service Fee</th>
                                <th>Final Payout</th>
                                <th>Status</th>
                                <th>Resolution</th>
                            </tr>
                        )}
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <TableSkeleton
                                rows={8}
                                cols={activeTab === 'all-transactions' ? 6 : 8}
                            />
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

            {renderPagination}

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

const StatCard = ({ icon, label, value, variant = '', isStatus = false }) => (
    <div className={styles.statCard}>
        <div className={`${styles.iconBox} ${styles[variant] || ''}`}>
            {icon}
        </div>

        <div className={styles.statContent}>
            <p>{label}</p>
            <h3 className={isStatus ? styles.statusText : ''}>{value}</h3>
        </div>
    </div>
);

const TransactionRow = ({ item, onOpenDetail }) => {
    const dateObj = item.createdAt ? new Date(item.createdAt) : null;

    const formattedDate = dateObj
        ? dateObj.toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
          })
        : 'N/A';

    const formattedTime = dateObj
        ? dateObj.toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
          })
        : '';

    const displayAmount = getDisplayAmount(item);

    const amountPrefix =
        displayAmount > 0 ? '+' : displayAmount < 0 ? '-' : '';

    const amountClass =
        displayAmount > 0
            ? styles.plus
            : displayAmount < 0
                ? styles.minus
                : styles.neutralAmount;

    const referenceText = formatReference(
        item.referenceType,
        item.referenceId,
        item.orderCode,
        item.eventName,
    );

    return (
        <>
            <td>
                <div className={styles.idCell}>
                    <span className={styles.code}>
                        {item.transactionCode || 'N/A'}
                    </span>

                    <span className={styles.refId} title={referenceText}>
                        {referenceText}
                    </span>
                </div>
            </td>

            <td className={styles.userEntityCell}>
                <div className={styles.userCell}>
                    <strong title={item.userName || 'Anonymous'}>
                        {item.userName || 'Anonymous'}
                    </strong>

                    <span title={`Wallet ID: ${item.walletId || 'N/A'}`}>
                        ID: {item.walletId ? `${String(item.walletId).slice(0, 8)}...` : 'N/A'}
                    </span>
                </div>
            </td>

            <td>
                <div className={styles.descCell}>
                    <TypeTag
                        type={item.type}
                        referenceType={item.referenceType}
                    />

                    <p title={item.description || 'No description'}>
                        {item.description || 'No description'}
                    </p>
                </div>
            </td>

            <td>
                <div className={styles.amountCell}>
                    <span className={amountClass}>
                        {amountPrefix}
                        {formatMoney(Math.abs(displayAmount))}
                    </span>

                    <small>Bal: {formatMoney(item.balanceAfter)}</small>
                </div>
            </td>

            <td className={styles.timeCell}>
                {formattedDate}
                <br />
                <small>{formattedTime}</small>
            </td>

            <td className={styles.actionCell}>
                <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={onOpenDetail}
                    title="View Details"
                >
                    <Eye size={18} />
                </button>
            </td>
        </>
    );
};

const EscrowRow = ({ item, onFix, onExecute, isActionLoading }) => {
    const displayTitle = item.eventTitle || item.orderCode || 'Campaign / Order Project';

    const displayId = item.eventId
        ? `Event ID: ${item.eventId}`
        : `Order ID: ${item.orderId || 'N/A'}`;

    const escrowAmount = Number(item.amount || 0);
    const serviceFee = Number(item.serviceFee || 0);
    const finalAmount = Number(
        item.finalAmount ?? Math.max(escrowAmount - serviceFee, 0),
    );

    return (
        <>
            <td>
                <div className={styles.idCell}>
                    <span className={styles.escrowId}>
                        #E{item.escrowSessionId || item.id}
                    </span>

                    {item.status === 'Held' && (
                        <small className={styles.timer}>Hold duration: 2 days</small>
                    )}

                    {item.status === 'Released' && (
                        <small className={styles.timer}>Released to recipient</small>
                    )}

                    {item.status === 'Refunded' && (
                        <small className={styles.timer}>Refunded to sender</small>
                    )}
                </div>
            </td>

            <td>
                <div className={styles.eventInfo}>
                    <strong title={displayTitle}>{displayTitle}</strong>
                    <span className={styles.miniTag}>{displayId}</span>
                </div>
            </td>

            <td>
                <div className={styles.receiver}>
                    {item.receiverName || item.userName || 'System'}
                </div>
            </td>

            <td>
                <strong className={styles.amountText}>
                    {formatMoney(escrowAmount)}
                </strong>
            </td>

            <td>
                <span className={styles.feeText}>
                    {formatMoney(serviceFee)}
                </span>
            </td>

            <td>
                <strong className={styles.payoutText}>
                    {formatMoney(finalAmount)}
                </strong>
            </td>

            <td>
                <StatusBadge status={item.status} />
            </td>

            <td className={styles.resolutionCell}>
                <div className={styles.actionGrid}>
                    {item.status === 'Held' && (
                        <button
                            type="button"
                            className={styles.btnOutlineWarn}
                            onClick={onFix}
                            disabled={!item.isIssueDetected}
                            title={
                                !item.isIssueDetected
                                    ? 'No issues detected'
                                    : 'Request user to fix'
                            }
                        >
                            Request Fix
                        </button>
                    )}

                    {item.status === 'ExpertApproved' && (
                        <button
                            type="button"
                            className={styles.btnPrimarySmall}
                            onClick={() => onExecute(item.escrowSessionId || item.id)}
                            disabled={isActionLoading}
                        >
                            Release Now
                        </button>
                    )}

                    {item.status === 'Resolved' && (
                        <span className={styles.done}>
                            <CheckCircle size={14} /> Settled
                        </span>
                    )}

                    {item.status === 'Released' && (
                        <span className={styles.done}>
                            <CheckCircle size={14} /> Released
                        </span>
                    )}

                    {item.status === 'Refunded' && (
                        <span className={styles.done}>
                            <CheckCircle size={14} /> Refunded
                        </span>
                    )}

                    {item.status === 'Pending' && (
                        <span className={styles.waiting}>Processing</span>
                    )}
                </div>
            </td>
        </>
    );
};

const TypeTag = ({ type, referenceType }) => {
    const normalizedType = String(type || '').trim();

    const config = {
        Refund: {
            label: 'Refund',
            className: styles.refundTag,
        },
        Revenue: {
            label: 'Revenue',
            className: styles.revenueTag,
        },
        Locked: {
            label: 'Locked',
            className: styles.lockedTag,
        },
        Withdraw: {
            label: 'Withdraw',
            className: styles.withdrawTag,
        },
        Deposit: {
            label: 'Deposit',
            className: styles.depositTag,
        },
        Credit: {
            label: getCreditLabel(referenceType),
            className: getCreditClass(referenceType),
        },
        Debit: {
            label: getDebitLabel(referenceType),
            className: getDebitClass(referenceType),
        },
        Escrow_Hold: {
            label: 'Escrow Hold',
            className: styles.campaignTag,
        },
        System_Fee_Payment: {
            label: 'Fee Payment',
            className: styles.eventFeeTag,
        },
        System_Fee_Revenue: {
            label: 'Fee Revenue',
            className: styles.eventRevenueTag,
        },
        Prize_Reward: {
            label: 'Prize Reward',
            className: styles.prizeRewardTag,
        },
        Event_Refund: {
            label: 'Event Refund',
            className: styles.eventRefundTag,
        },
        Event_Revenue_Released: {
            label: 'Revenue Released',
            className: styles.eventRevenueTag,
        },
        Event_Cancel_Refund: {
            label: 'Cancel Refund',
            className: styles.eventRefundTag,
        },
        Event_Entry_Fee_Paid: {
            label: 'Entry Fee Paid',
            className: styles.eventFeeTag,
        },
        Event_Revenue_Locked: {
            label: 'Revenue Locked',
            className: styles.lockedTag,
        },
        Event_Reject_Refund: {
            label: 'Reject Refund',
            className: styles.eventRefundTag,
        },
    };

    const style = config[normalizedType] || {
        label: normalizedType || 'Unknown',
        className: getFallbackTagClass(referenceType),
    };

    return (
        <span className={`${styles.tag} ${style.className}`}>
            {style.label}
        </span>
    );
};

const StatusBadge = ({ status }) => {
    const map = {
        Held: {
            text: 'On Hold',
            className: styles.statusHeld,
        },
        Released: {
            text: 'Released',
            className: styles.statusDone,
        },
        Refunded: {
            text: 'Refunded',
            className: styles.statusDone,
        },
        Resolved: {
            text: 'Success',
            className: styles.statusDone,
        },
        ExpertApproved: {
            text: 'Pending Release',
            className: styles.statusWait,
        },
        PendingFix: {
            text: 'Pending Fix',
            className: styles.statusWait,
        },
        Pending: {
            text: 'In Progress',
            className: styles.statusPending,
        },
        Completed: {
            text: 'Completed',
            className: styles.statusDone,
        },
    };

    const current = map[status] || {
        text: status || 'Unknown',
        className: '',
    };

    return (
        <span className={`${styles.statusBadge} ${current.className}`}>
            {current.text}
        </span>
    );
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
        {[...Array(rows)].map((_, rowIndex) => (
            <tr key={rowIndex}>
                {[...Array(cols)].map((_, colIndex) => (
                    <td key={colIndex}>
                        <div className={styles.skeletonLine}></div>
                    </td>
                ))}
            </tr>
        ))}
    </>
);

const getDisplayAmount = (item) => {
    const amount = Number(item.amount || 0);
    const balanceBefore = Number(item.balanceBefore);
    const balanceAfter = Number(item.balanceAfter);

    const hasValidBalance =
        Number.isFinite(balanceBefore) &&
        Number.isFinite(balanceAfter) &&
        item.balanceBefore !== null &&
        item.balanceBefore !== undefined &&
        item.balanceAfter !== null &&
        item.balanceAfter !== undefined;

    if (hasValidBalance) {
        const balanceDelta = balanceAfter - balanceBefore;

        if (Math.abs(balanceDelta) > 0) {
            return balanceDelta;
        }
    }

    const normalizedType = String(item.type || '').trim().toLowerCase();

    if (normalizedType === 'credit') {
        return Math.abs(amount);
    }

    if (normalizedType === 'debit') {
        return -Math.abs(amount);
    }

    return amount;
};

const getFallbackTagClass = (referenceType) => {
    switch (referenceType) {
        case 'Event':
            return styles.campaignTag;
        case 'EventFix':
            return styles.eventFixTag;
        case 'OrderPayment':
            return styles.revenueTag;
        case 'OrderRefund':
            return styles.refundTag;
        default:
            return styles.defaultTag;
    }
};

const getCreditLabel = (referenceType) => {
    switch (referenceType) {
        case 'OrderRefund':
            return 'Refund';
        case 'OrderPayment':
            return 'Revenue';
        case 'Event':
            return 'Campaign';
        case 'EventFix':
            return 'Event Fix';
        default:
            return 'Credit';
    }
};

const getDebitLabel = (referenceType) => {
    switch (referenceType) {
        case 'OrderPayment':
            return 'Payment';
        case 'OrderRefund':
            return 'Refund Debit';
        case 'Event':
            return 'Campaign';
        case 'EventFix':
            return 'Event Fix';
        default:
            return 'Debit';
    }
};

const getCreditClass = (referenceType) => {
    switch (referenceType) {
        case 'OrderRefund':
            return styles.refundTag;
        case 'OrderPayment':
            return styles.revenueTag;
        case 'Event':
            return styles.campaignTag;
        case 'EventFix':
            return styles.eventFixTag;
        default:
            return styles.depositTag;
    }
};

const getDebitClass = (referenceType) => {
    switch (referenceType) {
        case 'OrderPayment':
            return styles.withdrawTag;
        case 'OrderRefund':
            return styles.refundTag;
        case 'Event':
            return styles.campaignTag;
        case 'EventFix':
            return styles.eventFixTag;
        default:
            return styles.withdrawTag;
    }
};

const formatReference = (referenceType, referenceId, orderCode, eventName) => {
    if (referenceType === 'OrderPayment') {
        return orderCode
            ? `Order Payment ${orderCode}`
            : `Order Payment #${referenceId || 'N/A'}`;
    }

    if (referenceType === 'OrderRefund') {
        return orderCode
            ? `Order Refund ${orderCode}`
            : `Order Refund #${referenceId || 'N/A'}`;
    }

    if (referenceType === 'Event') {
        return eventName
            ? `Campaign Event ${eventName}`
            : `Campaign Event #${referenceId || 'N/A'}`;
    }

    if (referenceType === 'EventFix') {
        return eventName
            ? `Event Fix ${eventName}`
            : `Event Fix #${referenceId || 'N/A'}`;
    }

    if (!referenceId) {
        return 'Ref: N/A';
    }

    return `Ref: #${referenceId}`;
};

export default AdminFinancial;