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
            adminNote = window.prompt('Nhập lý do từ chối yêu cầu hoàn tiền:');
            if (adminNote === null) return;
            if (adminNote.trim() === '') {
                alert('Vui lòng nhập lý do từ chối.');
                return;
            }
        } else {
            if (!window.confirm('Bạn có chắc chắn muốn chấp nhận yêu cầu này?')) return;
        }

        try {
            const endpoint =
                action === 'approve' ? `/orders/${orderId}/process-refund` : `/orders/${orderId}/reject-refund`;

            const payload = action === 'reject' ? { AdminNote: adminNote } : undefined;

            await axiosClient.post(endpoint, payload);
            alert('Đã xử lý yêu cầu thành công!');
            fetchRefunds();
        } catch (error) {
            console.error(error);
            alert(`Lỗi: ${error.response?.data?.message || 'Có lỗi xảy ra'}`);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return <span className={`${styles.badge} ${styles.pending}`}>Chờ xử lý</span>;
            case 'APPROVED':
                return <span className={`${styles.badge} ${styles.approved}`}>Đã chấp nhận</span>;
            case 'REJECTED':
                return <span className={`${styles.badge} ${styles.rejected}`}>Từ chối</span>;
            default:
                return <span className={styles.badge}>{status}</span>;
        }
    };

    return (
        <div className={styles.refundContainer}>
            <div className={styles.header}>
                <h2>Quản lý yêu cầu hoàn tiền</h2>
            </div>

            <div className={styles.tableWrapper}>
                {isLoading ? (
                    <div className={styles.loading}>Đang tải dữ liệu...</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Mã YC</th>
                                <th>Mã Đơn</th>
                                <th>Lý do của khách</th>
                                <th>Minh chứng</th>
                                <th>Ghi chú Admin</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
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
                                            onClick={() => setSelectedImages([item.proofImage1, item.proofImage2])}
                                        >
                                            <FaEye /> Xem ảnh
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
                                                    title="Chấp nhận"
                                                >
                                                    <FaCheck />
                                                </button>
                                                <button
                                                    className={styles.rejectBtn}
                                                    onClick={() => handleAction(item.orderId, 'reject')}
                                                    title="Từ chối"
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
                                        Không có dữ liệu
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
                        <h3>Ảnh minh chứng</h3>
                        <div className={styles.imageGrid}>
                            <img src={selectedImages[0]} alt="Proof 1" />
                            <img src={selectedImages[1]} alt="Proof 2" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RefundManagement;
