import React, { useState } from 'react';
import styles from './Expert.module.scss';
import { 
    FaSearch, FaUserCheck, FaIdCard, FaStar, 
    FaCertificate, FaEye, FaUserEdit, FaTrash 
} from 'react-icons/fa';

const initialExperts = [
    { 
        id: 1, name: 'Lê Fashionista', email: 'le.fashion@gmail.com', 
        specialty: 'Stylist', status: 'Verified', rating: 4.8, 
        certImg: 'https://bit.ly/example-cert1' 
    },
    { 
        id: 2, name: 'Hoàng Designer', email: 'hoang.design@gmail.com', 
        specialty: 'Thiết kế đồ hội họa', status: 'Pending', rating: 0, 
        certImg: 'https://bit.ly/example-cert2' 
    },
    { 
        id: 3, name: 'Trần Makeup', email: 'tran.mua@gmail.com', 
        specialty: 'Trang điểm chuyên nghiệp', status: 'Verified', rating: 4.5, 
        certImg: 'https://bit.ly/example-cert3' 
    },
];

function ExpertManagement() {
    const [experts] = useState(initialExperts);
    const [selectedCert, setSelectedCert] = useState(null); // Để xem ảnh bằng cấp

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div>
                    <h2>Quản Lý Chuyên Gia</h2>
                    <p>Duyệt hồ sơ và kiểm tra bằng cấp chuyên gia thời trang</p>
                </div>
                <div className={styles.statsCount}>
                    <span>Tổng số: <b>{experts.length}</b></span>
                </div>
            </div>

            <div className={styles.filterBar}>
                <div className={styles.searchBox}>
                    <FaSearch />
                    <input type="text" placeholder="Tìm tên chuyên gia, chuyên môn..." />
                </div>
                <button className={styles.btnSync}>Làm mới dữ liệu</button>
            </div>

            <div className={styles.tableContainer}>
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
                        {experts.map((exp) => (
                            <tr key={exp.id}>
                                <td className={styles.expertInfo}>
                                    <div className={styles.avatar}>{exp.name.charAt(0)}</div>
                                    <div>
                                        <div className={styles.name}>{exp.name}</div>
                                        <div className={styles.email}>{exp.email}</div>
                                    </div>
                                </td>
                                <td><span className={styles.specialtyBadge}>{exp.specialty}</span></td>
                                <td>
                                    <div className={styles.rating}>
                                        <FaStar style={{ color: '#f59e0b' }} /> {exp.rating}
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
                                    <span className={`${styles.status} ${exp.status === 'Verified' ? styles.verified : styles.pending}`}>
                                        {exp.status === 'Verified' ? 'Đã duyệt' : 'Chờ duyệt'}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button className={styles.edit}><FaUserEdit /></button>
                                        <button className={styles.delete}><FaTrash /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal xem bằng cấp (Giả lập) */}
            {selectedCert && (
                <div className={styles.modalOverlay} onClick={() => setSelectedCert(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3><FaCertificate /> Chứng chỉ: {selectedCert.name}</h3>
                            <button onClick={() => setSelectedCert(null)}>&times;</button>
                        </div>
                        <div className={styles.modalBody}>
                            <img src="https://via.placeholder.com/500x350?text=Fashion+Expert+Certificate" alt="Certificate" />
                            <div className={styles.certMeta}>
                                <p><b>Loại:</b> Bằng chuyên môn quốc tế</p>
                                <p><b>Ngày cấp:</b> 12/10/2024</p>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.btnApprove}><FaUserCheck /> Phê duyệt ngay</button>
                            <button className={styles.btnReject}>Từ chối</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ExpertManagement;