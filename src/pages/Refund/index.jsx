import React, { useEffect, useMemo, useState } from 'react';
import styles from './Refund.module.scss';
import {
    FaCheck,
    FaTimes,
    FaEye,
    FaSyncAlt,
    FaSearch,
    FaUndoAlt,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaImage,
    FaClipboardList,
} from 'react-icons/fa';
import axiosClient from '../../shared/lib/axios';

const RefundManagement = () => {
    const [refunds, setRefunds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingOrderId, setProcessingOrderId] = useState(null);
    const [selectedRefund, setSelectedRefund] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
    const [rejectNote, setRejectNote] = useState('');
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        fetchRefunds();
    }, []);

    const normalizeStatus = (status) => {
        return (status || '').toString().trim().toUpperCase();
    };

    const getErrorMessage = (error) => {
        return (
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.response?.data?.title ||
            error.message ||
            'An error occurred.'
        );
    };

    const fetchRefunds = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await axiosClient.get('/orders/refunds');
            setRefunds(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error(error);
            setError(getErrorMessage(error));
            setRefunds([]);
        } finally {
            setIsLoading(false);
        }
    };

    const summary = useMemo(() => {
        return refunds.reduce(
            (result, item) => {
                const status = normalizeStatus(item.status);

                result.total += 1;

                if (status === 'PENDING') {
                    result.pending += 1;
                } else if (status === 'APPROVED') {
                    result.approved += 1;
                } else if (status === 'REJECTED') {
                    result.rejected += 1;
                }

                return result;
            },
            {
                total: 0,
                pending: 0,
                approved: 0,
                rejected: 0,
            },
        );
    }, [refunds]);

    const filteredRefunds = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();

        return refunds.filter((item) => {
            const status = normalizeStatus(item.status);

            const matchesStatus =
                statusFilter === 'ALL' || status === statusFilter;

            const searchableText = [
                item.refundRequestId,
                item.orderId,
                item.reason,
                item.adminNote,
                item.status,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            const matchesSearch =
                keyword === '' || searchableText.includes(keyword);

            return matchesStatus && matchesSearch;
        });
    }, [refunds, searchTerm, statusFilter]);

    const openConfirmModal = (item, action) => {
        setConfirmAction({
            item,
            action,
        });
        setRejectNote('');
    };

    const closeConfirmModal = () => {
        setConfirmAction(null);
        setRejectNote('');
    };

    const handleAction = async () => {
        if (!confirmAction?.item || !confirmAction?.action) {
            return;
        }

        const { item, action } = confirmAction;
        const orderId = item.orderId;

        if (action === 'reject' && rejectNote.trim() === '') {
            setError('Please enter a reason before rejecting this refund request.');
            return;
        }

        setError('');
        setProcessingOrderId(orderId);

        try {
            if (action === 'approve') {
                await axiosClient.put(`/orders/${orderId}/refund/approve`);
            } else {
                await axiosClient.put(
                    `/orders/${orderId}/refund/reject?note=${encodeURIComponent(
                        rejectNote.trim(),
                    )}`,
                );
            }

            closeConfirmModal();
            await fetchRefunds();
        } catch (error) {
            console.error(error);
            setError(getErrorMessage(error));
        } finally {
            setProcessingOrderId(null);
        }
    };

    const getStatusBadge = (status) => {
        const normalized = normalizeStatus(status);

        switch (normalized) {
            case 'PENDING':
                return (
                    <span className={`${styles.badge} ${styles.pending}`}>
                        Pending
                    </span>
                );
            case 'APPROVED':
                return (
                    <span className={`${styles.badge} ${styles.approved}`}>
                        Approved
                    </span>
                );
            case 'REJECTED':
                return (
                    <span className={`${styles.badge} ${styles.rejected}`}>
                        Rejected
                    </span>
                );
            default:
                return (
                    <span className={`${styles.badge} ${styles.unknown}`}>
                        {status || 'Unknown'}
                    </span>
                );
        }
    };

    const renderImage = (src, alt) => {
        if (!src || src.trim() === '') {
            return (
                <div className={styles.noImage}>
                    <FaImage />
                    <span>No image available</span>
                </div>
            );
        }

        return (
            <a href={src} target="_blank" rel="noreferrer" className={styles.imageLink}>
                <img
                    src={src}
                    alt={alt}
                    onError={(event) => {
                        event.currentTarget.style.display = 'none';
                    }}
                />
            </a>
        );
    };

    const isProcessing = processingOrderId !== null;

    return (
        <div className={styles.refundContainer}>
            <div className={styles.pageHeader}>
                <div>
                    <span className={styles.eyebrow}>Admin Panel</span>
                    <h2>Refund Management</h2>
                    <p>Review refund evidence, approve valid cases, or reject with a clear admin note.</p>
                </div>

                <button
                    type="button"
                    className={styles.refreshBtn}
                    onClick={fetchRefunds}
                    disabled={isLoading || isProcessing}
                >
                    <FaSyncAlt className={isLoading ? styles.spinning : ''} />
                    Refresh
                </button>
            </div>

            <div className={styles.summaryGrid}>
                <SummaryCard
                    icon={<FaClipboardList />}
                    label="Total Requests"
                    value={summary.total}
                    variant="total"
                />

                <SummaryCard
                    icon={<FaClock />}
                    label="Pending Review"
                    value={summary.pending}
                    variant="pending"
                />

                <SummaryCard
                    icon={<FaCheckCircle />}
                    label="Approved"
                    value={summary.approved}
                    variant="approved"
                />

                <SummaryCard
                    icon={<FaTimesCircle />}
                    label="Rejected"
                    value={summary.rejected}
                    variant="rejected"
                />
            </div>

            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search by refund ID, order ID, reason, admin note..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </div>

                <select
                    className={styles.statusSelect}
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            {error && (
                <div className={styles.errorBox}>
                    {error}
                </div>
            )}

            <div className={styles.tableWrapper}>
                {isLoading ? (
                    <TableSkeleton />
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Refund</th>
                                <th>Order</th>
                                <th>Customer Reason</th>
                                <th>Evidence</th>
                                <th>Admin Note</th>
                                <th>Status</th>
                                <th>Decision</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredRefunds.map((item) => {
                                const status = normalizeStatus(item.status);
                                const rowProcessing = processingOrderId === item.orderId;

                                return (
                                    <tr key={item.refundRequestId}>
                                        <td>
                                            <div className={styles.idBlock}>
                                                <strong>#{item.refundRequestId}</strong>
                                                <span>Refund Request</span>
                                            </div>
                                        </td>

                                        <td>
                                            <div className={styles.idBlock}>
                                                <strong>#{item.orderId}</strong>
                                                <span>Order ID</span>
                                            </div>
                                        </td>

                                        <td>
                                            <div
                                                className={styles.reasonCell}
                                                title={item.reason || 'No reason provided'}
                                            >
                                                {item.reason || 'No reason provided'}
                                            </div>
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className={styles.viewBtn}
                                                onClick={() => setSelectedRefund(item)}
                                            >
                                                <FaEye />
                                                View Evidence
                                            </button>
                                        </td>

                                        <td>
                                            <div
                                                className={styles.noteCell}
                                                title={item.adminNote || '-'}
                                            >
                                                {item.adminNote || '-'}
                                            </div>
                                        </td>

                                        <td>{getStatusBadge(item.status)}</td>

                                        <td>
                                            {status === 'PENDING' ? (
                                                <div className={styles.actionGroup}>
                                                    <button
                                                        type="button"
                                                        className={styles.approveBtn}
                                                        onClick={() => openConfirmModal(item, 'approve')}
                                                        disabled={isProcessing}
                                                    >
                                                        <FaCheck />
                                                        Approve
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className={styles.rejectBtn}
                                                        onClick={() => openConfirmModal(item, 'reject')}
                                                        disabled={isProcessing}
                                                    >
                                                        <FaTimes />
                                                        Reject
                                                    </button>

                                                    {rowProcessing && (
                                                        <span className={styles.processingText}>
                                                            Processing...
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className={styles.noAction}>
                                                    Processed
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}

                            {filteredRefunds.length === 0 && (
                                <tr>
                                    <td colSpan="7" className={styles.empty}>
                                        <FaUndoAlt />
                                        <h3>No refund requests found</h3>
                                        <p>Try changing the status filter or search keyword.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {selectedRefund && (
                <div className={styles.modalOverlay} onClick={() => setSelectedRefund(null)}>
                    <div className={styles.modalContent} onClick={(event) => event.stopPropagation()}>
                        <button
                            type="button"
                            className={styles.closeModal}
                            onClick={() => setSelectedRefund(null)}
                        >
                            <FaTimes />
                        </button>

                        <div className={styles.modalHeader}>
                            <span>Refund Evidence</span>
                            <h3>Request #{selectedRefund.refundRequestId}</h3>
                            <p>Order #{selectedRefund.orderId}</p>
                        </div>

                        <div className={styles.modalInfoGrid}>
                            <div>
                                <label>Customer Reason</label>
                                <p>{selectedRefund.reason || 'No reason provided.'}</p>
                            </div>

                            <div>
                                <label>Admin Note</label>
                                <p>{selectedRefund.adminNote || '-'}</p>
                            </div>

                            <div>
                                <label>Status</label>
                                {getStatusBadge(selectedRefund.status)}
                            </div>
                        </div>

                        <div className={styles.imageSection}>
                            <h4>Product Photo</h4>
                            <div className={styles.imageGridSingle}>
                                {renderImage(selectedRefund.itemImage, 'Product')}
                            </div>

                            <h4>Customer Proof Photos</h4>
                            <div className={styles.imageGrid}>
                                {renderImage(selectedRefund.proofImage1, 'Proof 1')}
                                {renderImage(selectedRefund.proofImage2, 'Proof 2')}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {confirmAction && (
                <div className={styles.modalOverlay} onClick={closeConfirmModal}>
                    <div className={styles.confirmModal} onClick={(event) => event.stopPropagation()}>
                        <button
                            type="button"
                            className={styles.closeModal}
                            onClick={closeConfirmModal}
                            disabled={isProcessing}
                        >
                            <FaTimes />
                        </button>

                        {confirmAction.action === 'approve' ? (
                            <>
                                <div className={`${styles.confirmIcon} ${styles.confirmApprove}`}>
                                    <FaCheck />
                                </div>

                                <h3>Approve this refund?</h3>

                                <p>
                                    The buyer will receive the refund for order{' '}
                                    <strong>#{confirmAction.item.orderId}</strong>.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className={`${styles.confirmIcon} ${styles.confirmReject}`}>
                                    <FaTimes />
                                </div>

                                <h3>Reject this refund?</h3>

                                <p>
                                    Please enter a clear reason. This note will be saved as the admin decision.
                                </p>

                                <textarea
                                    value={rejectNote}
                                    onChange={(event) => setRejectNote(event.target.value)}
                                    placeholder="Example: Evidence is not clear enough to confirm the issue."
                                    rows={4}
                                />
                            </>
                        )}

                        <div className={styles.confirmActions}>
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={closeConfirmModal}
                                disabled={isProcessing}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className={
                                    confirmAction.action === 'approve'
                                        ? styles.confirmApproveBtn
                                        : styles.confirmRejectBtn
                                }
                                onClick={handleAction}
                                disabled={isProcessing}
                            >
                                {isProcessing
                                    ? 'Processing...'
                                    : confirmAction.action === 'approve'
                                        ? 'Approve Refund'
                                        : 'Reject Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SummaryCard = ({ icon, label, value, variant }) => (
    <div className={`${styles.summaryCard} ${styles[variant]}`}>
        <div className={styles.summaryIcon}>
            {icon}
        </div>

        <div>
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    </div>
);

const TableSkeleton = () => (
    <div className={styles.skeletonWrapper}>
        {[...Array(7)].map((_, index) => (
            <div className={styles.skeletonRow} key={index}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        ))}
    </div>
);

export default RefundManagement;