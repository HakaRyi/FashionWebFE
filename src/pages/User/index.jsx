import React, { useState } from 'react';
import styles from './User.module.scss';
import { 
    FaSearch, FaUserPlus, FaEllipsisV, FaFilter, 
    FaUserEdit, FaUserSlash, FaCheckCircle, FaUserShield 
} from 'react-icons/fa';

const initialUsers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'vana@gmail.com', role: 'User', status: 'Active', joinedDate: '2026-01-15' },
    { id: 2, name: 'Trần Thị B', email: 'thib@gmail.com', role: 'User', status: 'Active', joinedDate: '2026-01-20' },
    { id: 3, name: 'Lê Hoàng C', email: 'hoangc@gmail.com', role: 'User', status: 'Banned', joinedDate: '2026-02-01' },
    { id: 4, name: 'Phạm Minh D', email: 'minhd@gmail.com', role: 'User', status: 'Active', joinedDate: '2025-12-10' },
    { id: 5, name: 'Hoàng Thùy E', email: 'thuye@gmail.com', role: 'User', status: 'Pending', joinedDate: '2026-02-02' },
];

function UserManagement() {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active': return styles.statusActive;
            case 'Banned': return styles.statusBanned;
            case 'Pending': return styles.statusPending;
            default: return '';
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        placeholder="Tìm theo tên, email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.actions}>
                    <button className={styles.btnFilter}><FaFilter /> Lọc</button>
                    <select className={styles.selectRole}>
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
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td className={styles.userInfo}>
                                    <div className={styles.avatar}>{user.name.charAt(0)}</div>
                                    <div>
                                        <div className={styles.userName}>{user.name}</div>
                                        <div className={styles.userEmail}>{user.email}</div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`${styles.roleBadge} ${styles[user.role.toLowerCase()]}`}>
                                        {user.role === 'Admin' && <FaUserShield />} {user.role}
                                    </span>
                                </td>
                                <td>{user.joinedDate}</td>
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
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className={styles.pagination}>
                <span>Hiển thị {filteredUsers.length} / {users.length} người dùng</span>
                <div className={styles.pageBtns}>
                    <button disabled>Trước</button>
                    <button className={styles.activePage}>1</button>
                    <button>2</button>
                    <button>Sau</button>
                </div>
            </div>
        </div>
    );
}

export default UserManagement;