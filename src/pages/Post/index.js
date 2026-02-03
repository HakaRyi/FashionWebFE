import React, { useState,useMemo } from 'react';
import styles from './Post.module.scss';
import PostDetailModal from '~/components/Modal/PostDetailModal/index.js';
import { 
    FaSearch, FaPlus, FaRegCalendarAlt, FaEdit, 
    FaTrashAlt, FaEye, FaFilter, FaCheckCircle, FaClock,FaCheck
} from 'react-icons/fa';

const initialPosts = [
    { 
        id: 1, 
        title: 'Xu hướng thời trang Xuân Hè 2026', 
        author: 'User', 
        category: 'Xu hướng', 
        date: '02/02/2026', 
        status: 'Published',
        thumbnail: 'https://thebureaufashionweek.com/wp-content/uploads/sites/11/2021/08/What-to-wear-to-Fashion-Week.jpg'
    },
    { 
        id: 2, 
        title: 'Cách phối đồ cho người dáng cao', 
        author: 'Expert_Hoang', 
        category: 'Tips phối đồ', 
        date: '01/02/2026', 
        status: 'Draft',
        thumbnail: 'https://publish.purewow.net/wp-content/uploads/sites/2/2025/12/2026-fashion-trends-UNIV.jpg?resize=720%2C780'
    },
    { 
        id: 3, 
        title: 'Top 5 thương hiệu bền vững', 
        author: 'User', 
        category: 'Thương hiệu', 
        date: '30/01/2026', 
        status: 'Pending',
        thumbnail: 'https://i1.sndcdn.com/artworks-000337842834-6bghqf-t500x500.jpg'
    },
];
function PostManagement() {
    const [posts, setPosts] = useState(initialPosts);
    const [selectedPost, setSelectedPost] = useState(null);

    // Sắp xếp bài đăng: Pending lên đầu
    const sortedPosts = useMemo(() => {
        return [...posts].sort((a, b) => {
            if (a.status === 'Pending' && b.status !== 'Pending') return -1;
            if (a.status !== 'Pending' && b.status === 'Pending') return 1;
            return 0;
        });
    }, [posts]);

    const handleApprove = (id) => {
        setPosts(posts.map(p => p.id === id ? { ...p, status: 'Published' } : p));
        setSelectedPost(null);
    };

    const handleReject = (id) => {
        setPosts(posts.filter(p => p.id !== id)); // Ví dụ: Xóa nếu bị reject
        setSelectedPost(null);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div>
                    <h2>Quản Lý Bài Viết</h2>
                    <p>Ưu tiên xử lý các bài viết đang chờ duyệt</p>
                </div>
                <button className={styles.btnAdd}><FaPlus /> Viết bài mới</button>
            </div>

            {/* Toolbar giữ nguyên như cũ */}
            <div className={styles.toolbar}>
                <div className={styles.searchGroup}>
                    <div className={styles.searchBox}>
                        <FaSearch />
                        <input type="text" placeholder="Tìm kiếm bài viết..." />
                    </div>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Bài viết</th>
                            <th>Trạng thái</th>
                            <th>Tác giả</th>
                            <th style={{ textAlign: 'center' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPosts.map((post) => (
                            <tr key={post.id} className={post.status === 'Pending' ? styles.pendingRow : ''}>
                                <td className={styles.postCell}>
                                    <img src={post.thumbnail} alt="thumb" className={styles.thumb} />
                                    <span className={styles.postTitle}>{post.title}</span>
                                </td>
                                <td>
                                    <span className={`${styles.status} ${styles[post.status.toLowerCase()]}`}>
                                        {post.status === 'Published' ? <FaCheckCircle /> : <FaClock />}
                                        {post.status}
                                    </span>
                                </td>
                                <td>{post.author}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <button 
                                            className={styles.btnView} 
                                            onClick={() => setSelectedPost(post)}
                                            title="Xem chi tiết & Duyệt"
                                        >
                                            <FaEye />
                                        </button>
                                        
                                        {post.status === 'Pending' && (
                                            <button 
                                                className={styles.btnQuickApprove}
                                                onClick={() => handleApprove(post.id)}
                                                title="Duyệt nhanh"
                                            >
                                                <FaCheck />
                                            </button>
                                        )}
                                        
                                        <button className={styles.btnDelete}><FaTrashAlt /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Render Modal */}
            {selectedPost && (
                <PostDetailModal 
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    );
}

export default PostManagement;