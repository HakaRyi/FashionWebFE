import React, { useState } from 'react';
import styles from './Report.module.scss';
import { 
    FaMagnifyingGlass, FaFlag, FaTrash, FaUserSlash, FaEye, 
    FaTriangleExclamation, FaCircleCheck, FaCircleInfo 
} from 'react-icons/fa6';

const initialReports = [
    { 
        id: 'RP102', 
        reporter: 'User_NguyenA', 
        target: 'Bài viết: Cách phối đồ...', 
        reason: 'Nội dung phản cảm', 
        date: '2026-02-03', 
        severity: 'High', 
        status: 'Pending' 
    },
    { 
        id: 'RP103', 
        reporter: 'Expert_Hoang', 
        target: 'Bình luận của User_B', 
        reason: 'Spam/Quảng cáo', 
        date: '2026-02-02', 
        severity: 'Medium', 
        status: 'Handled' 
    },
    { 
        id: 'RP104', 
        reporter: 'User_LeC', 
        target: 'Tài khoản: Fashion_Lover', 
        reason: 'Mạo danh chuyên gia', 
        date: '2026-02-01', 
        severity: 'Low', 
        status: 'Ignored' 
    },
];

function ReportManagement() {
    const [reports] = useState(initialReports);

    const getSeverityStyle = (severity) => {
        switch (severity) {
            case 'High': return styles.sevHigh;
            case 'Medium': return styles.sevMedium;
            case 'Low': return styles.sevLow;
            default: return '';
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div>
                    <h2>Quản Lý Báo Cáo Vi Phạm</h2>
                    <p>Xử lý các khiếu nại về nội dung và người dùng từ cộng đồng</p>
                </div>
                <div className={styles.reportCount}>
                    <FaTriangleExclamation />
                    <span>Có <b>5</b> báo cáo mới cần xử lý</span>
                </div>
            </div>

            <div className={styles.filterBar}>
                <div className={styles.searchBox}>
                    <FaMagnifyingGlass />
                    <input type="text" placeholder="Tìm kiếm báo cáo..." />
                </div>
                <div className={styles.tabs}>
                    <button className={styles.tabActive}>Chờ xử lý</button>
                    <button>Đã giải quyết</button>
                    <button>Đã bỏ qua</button>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Người báo cáo</th>
                            <th>Đối tượng vi phạm</th>
                            <th>Lý do</th>
                            <th>Mức độ</th>
                            <th>Trạng thái</th>
                            <th style={{ textAlign: 'center' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report.id}>
                                <td className={styles.reportId}>#{report.id}</td>
                                <td>{report.reporter}</td>
                                <td className={styles.targetCol}>
                                    <div className={styles.targetName}>{report.target}</div>
                                    <div className={styles.reportDate}>{report.date}</div>
                                </td>
                                <td>{report.reason}</td>
                                <td>
                                    <span className={`${styles.sevBadge} ${getSeverityStyle(report.severity)}`}>
                                        {report.severity}
                                    </span>
                                </td>
                                <td>
                                    <span className={`${styles.statusBadge} ${styles[report.status.toLowerCase()]}`}>
                                        {report.status}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button className={styles.btnView} title="Xem chi tiết"><FaEye /></button>
                                        <button className={styles.btnBan} title="Khóa đối tượng"><FaUserSlash /></button>
                                        <button className={styles.btnDelete} title="Xóa nội dung"><FaTrash /></button>
                                        <button className={styles.btnDone} title="Đánh dấu đã xong"><FaCircleCheck /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ReportManagement;