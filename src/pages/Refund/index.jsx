import React, { useEffect, useState } from 'react';
import styles from './Refund.module.scss';
import { FaCheck, FaTimes, FaEye, FaSyncAlt } from 'react-icons/fa';
import axiosClient from '../../shared/lib/axios';

const RefundManagement = () => {
    const [refunds, setRefunds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedImages, setSelectedImages] = useState(null);
    const [error, setError] = useState('');

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

    const handleAction = async (orderId, action) => {
        let adminNote = '';

        if (action === 'reject') {
            adminNote = window.prompt('Please enter a reason for rejection:');

            if (adminNote === null) {
                return;
            }

            if (adminNote.trim() === '') {
                alert('Please enter a reason for rejection.');
                return;
            }
        } else {
            const confirmed = window.confirm(
                'Are you sure you want to approve this refund request? The buyer will receive the refund.',
            );

            if (!confirmed) {
                return;
            }
        }

        setIsProcessing(true);

        try {
            if (action === 'approve') {
                await axiosClient.put(`/orders/${orderId}/refund/approve`);
            } else {
                await axiosClient.put(`/orders/${orderId}/refund/reject?note=${encodeURIComponent(adminNote.trim())}`);
            }

            alert('The request has been processed successfully.');
            await fetchRefunds();
        } catch (error) {
            console.error(error);
            alert(`Error: ${getErrorMessage(error)}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const getStatusBadge = (status) => {
        const normalized = normalizeStatus(status);

        switch (normalized) {
            case 'PENDING':
                return <span className={`${styles.badge} ${styles.pending}`}>Pending</span>;
            case 'APPROVED':
                return <span className={`${styles.badge} ${styles.approved}`}>Approved</span>;
            case 'REJECTED':
                return <span className={`${styles.badge} ${styles.rejected}`}>Rejected</span>;
            default:
                return <span className={styles.badge}>{status || 'Unknown'}</span>;
        }
    };

    const openImageModal = (item) => {
        setSelectedImages({
            itemImage: item.itemImage,
            proof1: item.proofImage1,
            proof2: item.proofImage2,
        });
    };

    const renderImage = (src, alt) => {
        if (!src || src.trim() === '') {
            return <div className={styles.noImage}>No image available.</div>;
        }

        return (
            <img
                src={src}
                alt={alt}
                onError={(event) => {
                    event.currentTarget.style.display = 'none';
                }}
            />
        );
    };

    return (
        <div className={styles.refundContainer}>
            <div className={styles.header}>
                <h2>Refund Management</h2>

                <button
                    type="button"
                    className={styles.refreshBtn}
                    onClick={fetchRefunds}
                    disabled={isLoading || isProcessing}
                >
                    <FaSyncAlt /> Refresh
                </button>
            </div>

            {error && <div className={styles.errorBox}>{error}</div>}

            <div className={styles.tableWrapper}>
                {isLoading ? (
                    <div className={styles.loading}>Loading data...</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Refund Request ID</th>
                                <th>Order ID</th>
                                <th>Customer Reason</th>
                                <th>Images</th>
                                <th>Admin Note</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {refunds.map((item) => {
                                const status = normalizeStatus(item.status);

                                return (
                                    <tr key={item.refundRequestId}>
                                        <td>#{item.refundRequestId}</td>
                                        <td>#{item.orderId}</td>
                                        <td className={styles.reasonCell}>{item.reason}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className={styles.viewBtn}
                                                onClick={() => openImageModal(item)}
                                            >
                                                <FaEye /> View Images
                                            </button>
                                        </td>
                                        <td className={styles.reasonCell}>{item.adminNote || '-'}</td>
                                        <td>{getStatusBadge(item.status)}</td>
                                        <td>
                                            {status === 'PENDING' ? (
                                                <div className={styles.actionBtns}>
                                                    <button
                                                        type="button"
                                                        className={styles.approveBtn}
                                                        onClick={() => handleAction(item.orderId, 'approve')}
                                                        title="Approve"
                                                        disabled={isProcessing}
                                                    >
                                                        <FaCheck />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className={styles.rejectBtn}
                                                        onClick={() => handleAction(item.orderId, 'reject')}
                                                        title="Reject"
                                                        disabled={isProcessing}
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className={styles.noAction}>Processed</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}

                            {refunds.length === 0 && (
                                <tr>
                                    <td colSpan="7" className={styles.empty}>
                                        No refund requests available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {selectedImages && (
                <div className={styles.modalOverlay} onClick={() => setSelectedImages(null)}>
                    <div className={styles.modalContent} onClick={(event) => event.stopPropagation()}>
                        <button type="button" className={styles.closeModal} onClick={() => setSelectedImages(null)}>
                            <FaTimes />
                        </button>

                        <h3>Image Details</h3>

                        <div className={styles.imageSection}>
                            <h4>Product Photo</h4>
                            <div className={styles.imageGridSingle}>
                                {renderImage(selectedImages.itemImage, 'Item')}
                            </div>

                            <h4>Proof Photos</h4>
                            <div className={styles.imageGrid}>
                                {renderImage(selectedImages.proof1, 'Proof 1')}
                                {renderImage(selectedImages.proof2, 'Proof 2')}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RefundManagement;
