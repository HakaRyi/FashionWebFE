import React, { useState, useEffect, useMemo } from 'react';
import styles from './Transaction.module.scss';
import axiosClient from '../../shared/lib/axios';
import * as XLSX from 'xlsx'; // Import thư viện xuất Excel
import { 
    FaMagnifyingGlass, FaDownload, FaCircleCheck, 
    FaCircleXmark, FaClock, FaArrowUp, FaArrowDown,
    FaChevronLeft, FaChevronRight
} from 'react-icons/fa6';

function TransactionManagement() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // States cho Search và Phân trang
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get('/transaction');
                setTransactions(response.data);
            } catch (error) {
                console.error("Lỗi lấy dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    // 1. Tính năng Search (Lọc theo tên hoặc mã)
    const filteredTransactions = useMemo(() => {
        return transactions.filter(trx => 
            trx.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trx.transactionId.toString().includes(searchTerm) ||
            trx.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, transactions]);

    // 2. Tính năng Phân trang
    const totalPages = Math.ceil(filteredTransactions.length / recordsPerPage);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredTransactions.slice(indexOfFirstRecord, indexOfLastRecord);

    // Reset về trang 1 khi search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // 3. Tính năng Xuất Excel
    const exportToExcel = () => {
        const dataToExport = filteredTransactions.map(trx => ({
            "Mã GD": trx.transactionId,
            "Người dùng": trx.userName,
            "Loại": trx.type,
            "Số tiền": trx.amount,
            "Mô tả": trx.description,
            "Thời gian": new Date(trx.createdAt).toLocaleString('vi-VN'),
            "Trạng thái": trx.status
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
        XLSX.writeFile(workbook, `Bao_Cao_Giao_Dich_${new Date().getTime()}.xlsx`);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) return <div className={styles.loading}>Đang tải...</div>;

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div>
                    <h2>Quản Lý Giao Dịch</h2>
                    <p>Đang hiển thị {filteredTransactions.length} kết quả</p>
                </div>
                <button className={styles.btnExport} onClick={exportToExcel}>
                    <FaDownload /> Xuất Excel
                </button>
            </div>

            <div className={styles.filterBar}>
                <div className={styles.searchBox}>
                    <FaMagnifyingGlass />
                    <input 
                        type="text" 
                        placeholder="Tìm tên người dùng, mã giao dịch..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Mã GD</th>
                            <th>Người dùng</th>
                            <th>Loại</th>
                            <th>Số tiền</th>
                            <th>Thời gian</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.map((trx) => (
                            <tr key={trx.transactionId}>
                                <td className={styles.trxId}>#{trx.transactionId}</td>
                                <td className={styles.userName}>{trx.userName}</td>
                                <td>
                                    <span className={`${styles.typeTag} ${trx.amount > 0 ? styles.plus : styles.minus}`}>
                                        {trx.type.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td className={`${styles.amount} ${trx.amount > 0 ? styles.positive : styles.negative}`}>
                                    {formatCurrency(trx.amount)}
                                </td>
                                <td className={styles.date}>{formatDateTime(trx.createdAt)}</td>
                                <td>
                                    <div className={`${styles.statusBadge} ${styles[trx.status.toLowerCase()]}`}>
                                        {trx.status === 'Success' ? 'Thành công' : 'Đang xử lý'}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination UI */}
            <div className={styles.pagination}>
                <span className={styles.pageInfo}>
                    Trang {currentPage} / {totalPages || 1}
                </span>
                <div className={styles.pageBtns}>
                    <button 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(p => p - 1)}
                    >
                        <FaChevronLeft />
                    </button>
                    <button 
                        disabled={currentPage === totalPages || totalPages === 0} 
                        onClick={() => setCurrentPage(p => p + 1)}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TransactionManagement;