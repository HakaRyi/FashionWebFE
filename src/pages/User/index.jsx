import React, { useState, useEffect, useMemo } from 'react';
import styles from './User.module.scss';
import { usertApi } from '../../pages/User/api/userApi';
import { 
    FaSearch, FaFilter, 
    FaUserSlash, FaUserShield, FaChevronLeft, FaChevronRight,
    FaEye, FaTimes 
} from 'react-icons/fa';
import { toast } from 'react-toastify';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [selectedUser, setSelectedUser] = useState(null);

    // Tách fetchUsers ra để có thể gọi lại nếu cần
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await usertApi.getAllUser();
            setUsers(response.data || []);
        } catch (error) {
            console.error("Error retrieving user list:", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, roleFilter]);

    // --- LOGIC BAN/UNBAN MỚI ---
    const handleToggleBan = async (user) => {
        const isBanning = user.status !== 'Banned';
        const actionText = isBanning ? "BAN" : "UNBAN";

        if (!window.confirm(`Are you sure you want to ${actionText} ${user.username}?`)) return;

        try {
            const apiCall = isBanning 
                ? usertApi.banUser(user.id) 
                : usertApi.unbanUser(user.id);
            
            const response = await apiCall;
            const resultMsg = response.data.result;

            if (resultMsg.includes("successfully")) {
                toast.success(resultMsg);
                // Cập nhật state cục bộ để UI thay đổi ngay lập tức mà ko cần reload
                setUsers(prevUsers => 
                    prevUsers.map(u => 
                        u.id === user.id 
                            ? { ...u, status: isBanning ? 'Banned' : 'Active' } 
                            : u
                    )
                );
            } else {
                toast.warning(resultMsg);
            }
        } catch (error) {
            toast.error("Error updating user status");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active': return styles.statusActive;
            case 'Banned': return styles.statusBanned;
            case 'Pending': return styles.statusPending;
            default: return '';
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = 
                user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === '' || user.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const displayedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredUsers, currentPage]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div>
                    <h2>User Management</h2>
                    <p>Manage user information, roles, and status</p>
                </div>
            </div>

            <div className={styles.filterBar}>
                <div className={styles.searchBox}>
                    <FaSearch />
                    <input 
                        type="text" 
                        placeholder="Search by username, email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.actions}>
                    <button className={styles.btnFilter}><FaFilter /> Filter</button>
                    <select 
                        className={styles.selectRole}
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="Expert">Expert</option>
                        <option value="User">User</option>
                    </select>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Join Date</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>Loading...</td></tr>
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
                                            <button 
                                                title="View Details" 
                                                onClick={() => setSelectedUser(user)}
                                                className={styles.btnView}
                                            >
                                                <FaEye size={16} />
                                            </button>
                                            
                                            {/* Giao diện nút Ban/Unban linh hoạt theo Status */}
                                            {user.status === 'Banned' ? (
                                                <button 
                                                    title="Unban User" 
                                                    className={styles.btnUnban}
                                                    onClick={() => handleToggleBan(user)}
                                                >
                                                    <FaUserShield size={16} />
                                                </button>
                                            ) : (
                                                <button 
                                                    title="Ban User" 
                                                    className={styles.btnBan}
                                                    onClick={() => handleToggleBan(user)}
                                                >
                                                    <FaUserSlash size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No data available.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className={styles.pagination}>
                <span>
                    Showing <b>{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)}</b> of <b>{filteredUsers.length}</b> users
                </span>
                <div className={styles.pageBtns}>
                    <button 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        <FaChevronLeft size={12} /> Previous
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
                        Next <FaChevronRight size={12} />
                    </button>
                </div>
            </div>

            {/* Modal Detail giữ nguyên ... */}
            {selectedUser && (
                <div className={styles.modalOverlay} onClick={() => setSelectedUser(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>User Details</h3>
                            <button className={styles.btnClose} onClick={() => setSelectedUser(null)}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.profileTop}>
                                <div className={styles.largeAvatar}>
                                    {selectedUser.avatar ? (
                                        <img src={selectedUser.avatar} alt="avatar" />
                                    ) : (
                                        <span>{selectedUser.username?.charAt(0).toUpperCase()}</span>
                                    )}
                                    {selectedUser.isOnline === "Online" && <div className={styles.largeOnlineDot}></div>}
                                </div>
                                <h4>@{selectedUser.username}</h4>
                                <p>{selectedUser.email}</p>
                                <span className={`${styles.roleBadge} ${styles[selectedUser.role?.toLowerCase()]}`} style={{ marginTop: '8px' }}>
                                    {selectedUser.role}
                                </span>
                            </div>
                            <div className={styles.statsRow}>
                                <div className={styles.statBox}>
                                    <h5>{selectedUser.postCount}</h5>
                                    <span>Posts</span>
                                </div>
                                <div className={styles.statDivider}></div>
                                <div className={styles.statBox}>
                                    <h5>{selectedUser.followerCount}</h5>
                                    <span>Followers</span>
                                </div>
                                <div className={styles.statDivider}></div>
                                <div className={styles.statBox}>
                                    <h5>{selectedUser.followingCount}</h5>
                                    <span>Following</span>
                                </div>
                            </div>
                            <div className={styles.infoList}>
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Status:</span>
                                    <span className={`${styles.statusBadge} ${getStatusStyle(selectedUser.status)}`}>
                                        {selectedUser.status}
                                    </span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Joined Date:</span>
                                    <span className={styles.infoValue}>{formatDate(selectedUser.createdAt)}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Description:</span>
                                </div>
                                <div className={styles.descBox}>
                                    {selectedUser.description ? selectedUser.description : <em style={{color: '#94a3b8'}}>No description provided.</em>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement;