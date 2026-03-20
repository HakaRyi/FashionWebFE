import React, { useState, useEffect, useMemo } from 'react';
import styles from './User.module.scss';
import { usertApi } from '../../pages/User/api/userApi';
import { 
    FaSearch, FaUserPlus, FaEllipsisV, FaFilter, 
    FaUserEdit, FaUserSlash, FaUserShield, FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    
    // --- PHẦN THÊM MỚI: State cho phân trang ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await usertApi.getAllUser();
                setUsers(response.data || []);
            } catch (error) {
                console.error("Lỗi lấy danh sách người dùng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Reset về trang 1 mỗi khi search hoặc lọc vai trò
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, roleFilter]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active': return styles.statusActive;
            case 'Banned': return styles.statusBanned;
            case 'Pending': return styles.statusPending;
            default: return '';
        }
    };

    // 1. Lọc và tìm kiếm dữ liệu
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = 
                user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === '' || user.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    // --- PHẦN THÊM MỚI: Tính toán dữ liệu hiển thị theo trang ---
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const displayedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredUsers, currentPage]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div>
                    <h2>Quản Lý Người Dùng</h2>
                    <p>Quản lý thông tin, phân quyền và trạng thái thành viên</p>
                </div>
                <button className={styles.btnAdd}>
                    <FaUserPlus /> Thêm thành viên
                </button>
            </div>

            <div className={styles.filterBar}>
                <div className={styles.searchBox}>
                    <FaSearch />
                    <input 
                        type="text" 
                        placeholder="Tìm theo username, email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.actions}>
                    <button className={styles.btnFilter}><FaFilter /> Lọc</button>
                    <select 
                        className={styles.selectRole}
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">Tất cả vai trò</option>
                        <option value="Admin">Admin</option>
                        <option value="Expert">Expert</option>
                        <option value="User">User</option>
                    </select>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Người dùng</th>
                            <th>Vai trò</th>
                            <th>Ngày tham gia</th>
                            <th>Trạng thái</th>
                            <th style={{ textAlign: 'center' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>Đang tải...</td></tr>
                        ) : displayedUsers.length > 0 ? (
                            displayedUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className={styles.userInfo}>
                                        <div className={styles.avatar}>
                                            {user.avatar ? <img src={user.avatar} alt="avatar" /> : user.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className={styles.userName}>
                                                {user.username} 
                                                {user.isOnline === "Online" && <span className={styles.onlineDot}></span>}
                                            </div>
                                            <div className={styles.userEmail}>{user.email}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.roleBadge} ${styles[user.role?.toLowerCase()]}`}>
                                            {user.role === 'Admin' && <FaUserShield />} {user.role}
                                        </span>
                                    </td>
                                    <td>{formatDate(user.createdAt)}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${getStatusStyle(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.rowActions}>
                                            <button title="Chỉnh sửa"><FaUserEdit /></button>
                                            <button title="Khóa tài khoản" className={styles.btnBan}><FaUserSlash /></button>
                                            <button title="Khác"><FaEllipsisV /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>Không có dữ liệu.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* --- PHẦN THÊM MỚI: Giao diện phân trang --- */}
            <div className={styles.pagination}>
                <span>
                    Hiển thị <b>{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)}</b> trên <b>{filteredUsers.length}</b> người dùng
                </span>
                <div className={styles.pageBtns}>
                    <button 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        <FaChevronLeft size={12} /> Trước
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                        <button 
                            key={index + 1}
                            className={currentPage === index + 1 ? styles.activePage : ''}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button 
                        disabled={currentPage === totalPages || totalPages === 0} 
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Sau <FaChevronRight size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserManagement;