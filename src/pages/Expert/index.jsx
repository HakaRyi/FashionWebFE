import React, { useState, useEffect } from 'react';
import styles from './Expert.module.scss';
import { 
    FaSearch, FaUserCheck, FaIdCard, FaStar, 
    FaCertificate, FaUserEdit, FaTrash, FaSync
} from 'react-icons/fa';
import { expertApi } from '../../services/expertService';

function ExpertManagement() {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCert, setSelectedCert] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [rejectReason, setRejectReason] = useState("");

    const fetchPendingExperts = async () => {
        setLoading(true);
        try {
            const res = await expertApi.getPending();
            setExperts(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingExperts();
    }, []);

    const handleReview = async (fileId, isApproved) => {
        const status = isApproved ? "Approved" : "Rejected";
        const reason = isApproved ? "Hồ sơ hợp lệ" : rejectReason || "Hồ sơ không đạt yêu cầu";

        try {
            await expertApi.processApplication(fileId, status, reason);
            alert(isApproved ? "Đã phê duyệt chuyên gia!" : "Đã từ chối hồ sơ.");

            setExperts(prev => prev.filter(item => item.expertFileId !== fileId));
            setSelectedCert(null);
            setRejectReason("");
        } catch (error) {
            alert("Lỗi khi cập nhật trạng thái.");
        }
    };

    const filteredExperts = experts.filter(exp => 
        exp.expertProfile?.account?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.expertProfile?.expertiseField?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div>
                    <h2>Quản Lý Chuyên Gia</h2>
                    <p>Duyệt hồ sơ và kiểm tra bằng cấp chuyên gia thời trang</p>
                </div>
                <div className={styles.statsCount}>
                    <span>Chờ duyệt: <b>{experts.length}</b></span>
                </div>
            </div>

            <div className={styles.filterBar}>
                <div className={styles.searchBox}>
                    <FaSearch />
                    <input 
                        type="text" 
                        placeholder="Tìm tên chuyên gia, chuyên môn..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className={styles.btnSync} onClick={fetchPendingExperts}>
                    <FaSync /> Làm mới
                </button>
            </div>

            <div className={styles.tableContainer}>
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</p>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Chuyên gia</th>
                                <th>Lĩnh vực</th>
                                <th>Đánh giá</th>
                                <th>Bằng cấp</th>
                                <th>Trạng thái</th>
                                <th style={{ textAlign: 'center' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExperts.map((exp) => (
                                <tr key={exp.expertFileId}>
                                    <td className={styles.expertInfo}>
                                        <div className={styles.avatar}>
                                            {exp.expertProfile?.account?.userName?.charAt(0) || "E"}
                                        </div>
                                        <div>
                                            <div className={styles.name}>{exp.expertProfile?.account?.userName}</div>
                                            <div className={styles.email}>{exp.expertProfile?.account?.email}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.specialtyBadge}>
                                            {exp.expertProfile?.expertiseField || "Chưa cập nhật"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.rating}>
                                            <FaStar style={{ color: '#f59e0b' }} /> {exp.ratingAvg || 0}
                                        </div>
                                    </td>
                                    <td>
                                        <button 
                                            className={styles.btnVerify} 
                                            onClick={() => setSelectedCert(exp)}
                                        >
                                            <FaIdCard /> Kiểm tra
                                        </button>
                                    </td>
                                    <td>
                                        <span className={`${styles.status} ${styles.pending}`}>
                                            {exp.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button 
                                                className={styles.edit} 
                                                onClick={() => handleReview(exp.expertFileId, true)}
                                                title="Duyệt nhanh"
                                            >
                                                <FaUserCheck />
                                            </button>
                                            <button className={styles.delete} title="Xóa yêu cầu">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal xem bằng cấp */}
            {selectedCert && (
                <div className={styles.modalOverlay} onClick={() => setSelectedCert(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3><FaCertificate /> Hồ sơ: {selectedCert.expertProfile?.account?.userName}</h3>
                            <button onClick={() => setSelectedCert(null)}>&times;</button>
                        </div>
                        <div className={styles.modalBody}>
                            {/* Hiển thị ảnh thật từ URL của Backend */}
                            <img 
                                src={selectedCert.certificateUrl || selectedCert.licenseUrl || "https://via.placeholder.com/500x350?text=No+Image"} 
                                alt="Certificate" 
                            />
                            <div className={styles.certMeta}>
                                <p><b>Lĩnh vực:</b> {selectedCert.expertProfile?.expertiseField}</p>
                                <p><b>Kinh nghiệm:</b> {selectedCert.expertProfile?.yearsOfExperience} năm</p>
                                <p><b>Bio:</b> {selectedCert.expertProfile?.bio}</p>
                                
                                <div className={styles.rejectForm}>
                                    <label>Lý do từ chối (nếu có):</label>
                                    <textarea 
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        placeholder="Nhập lý do không duyệt..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button 
                                className={styles.btnApprove}
                                onClick={() => handleReview(selectedCert.expertFileId, true)}
                            >
                                <FaUserCheck /> Phê duyệt hồ sơ
                            </button>
                            <button 
                                className={styles.btnReject}
                                onClick={() => handleReview(selectedCert.expertFileId, false)}
                            >
                                Từ chối
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ExpertManagement;