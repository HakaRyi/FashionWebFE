import React, { useState, useEffect } from 'react';
import styles from './Refund.module.scss';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import axiosClient from '../../shared/lib/axios';

const RefundManagement = () => {
    const [refunds, setRefunds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImages, setSelectedImages] = useState(null);

    useEffect(() => {
        fetchRefunds();
    }, []);

    const fetchRefunds = async () => {
        try {
            const response = await axiosClient.get('/orders/refund-requests');
            setRefunds(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (orderId, action) => {
        let adminNote = '';

        if (action === 'reject') {
            adminNote = window.prompt('Please enter a reason for rejection:');
            if (adminNote === null) return;
            if (adminNote.trim() === '') {
                alert('Please enter a reason for rejection.');
                return;
            }
        } else {
            if (!window.confirm('Are you sure you want to approve this request?')) return;
        }

        try {
            const endpoint =
                action === 'approve' ? `/orders/${orderId}/process-refund` : `/orders/${orderId}/reject-refund`;

            const payload = action === 'reject' ? { AdminNote: adminNote } : undefined;

            await axiosClient.post(endpoint, payload);
            alert('The request has been processed successfully.!');
            fetchRefunds();
        } catch (error) {
            console.error(error);
            alert(`Error: ${error.response?.data?.message || 'An error occurred.'}`);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return <span className={`${styles.badge} ${styles.pending}`}>Pending</span>;
            case 'APPROVED':
                return <span className={`${styles.badge} ${styles.approved}`}>Approved</span>;
            case 'REJECTED':
                return <span className={`${styles.badge} ${styles.rejected}`}>Rejected</span>;
            default:
                return <span className={styles.badge}>{status}</span>;
        }
    };

    return (
        <div className={styles.refundContainer}>
            <div className={styles.header}>
                <h2>Refund Management</h2>
            </div>

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
                            {refunds.map((item) => (
                                <tr key={item.refundRequestId}>
                                    <td>#{item.refundRequestId}</td>
                                    <td>#{item.orderId}</td>
                                    <td className={styles.reasonCell}>{item.reason}</td>
                                    <td>
                                        <button
                                            className={styles.viewBtn}
                                            onClick={() =>
                                                setSelectedImages({
                                                    itemImage: item.itemImage,
                                                    proof1: item.proofImage1,
                                                    proof2: item.proofImage2,
                                                })
                                            }
                                        >
                                            <FaEye /> View Images
                                        </button>
                                    </td>
                                    <td className={styles.reasonCell}>{item.adminNote || '-'}</td>
                                    <td>{getStatusBadge(item.status)}</td>
                                    <td>
                                        {item.status === 'PENDING' && (
                                            <div className={styles.actionBtns}>
                                                <button
                                                    className={styles.approveBtn}
                                                    onClick={() => handleAction(item.orderId, 'approve')}
                                                    title="Approve"
                                                >
                                                    <FaCheck />
                                                </button>
                                                <button
                                                    className={styles.rejectBtn}
                                                    onClick={() => handleAction(item.orderId, 'reject')}
                                                    title="Reject"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {refunds.length === 0 && (
                                <tr>
                                    <td colSpan="7" className={styles.empty}>
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {selectedImages && (
                <div className={styles.modalOverlay} onClick={() => setSelectedImages(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeModal} onClick={() => setSelectedImages(null)}>
                            <FaTimes />
                        </button>
                        <h3>Image Details</h3>
                        <div className={styles.imageSection}>
                            <h4>Product Photo</h4>
                            <div className={styles.imageGridSingle}>
                                {selectedImages.itemImage ? (
                                    <img src={selectedImages.itemImage} alt="Item" />
                                ) : (
                                    <div className={styles.noImage}>No product photos available.</div>
                                )}
                            </div>

                            <h4>Proof photo</h4>
                            <div className={styles.imageGrid}>
                                <img src={selectedImages.proof1} alt="Proof 1" />
                                <img src={selectedImages.proof2} alt="Proof 2" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RefundManagement;
