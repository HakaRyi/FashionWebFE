import React, { useState, useMemo, useEffect } from 'react';
import styles from './Post.module.scss';
import PostDetailModal from '@/widgets/Modal/PostDetailModal/index.jsx';
import axiosClient from '@/shared/lib/axios.js';
import {
    FaSearch,
    FaPlus,
    FaRegCalendarAlt,
    FaEdit,
    FaTrashAlt,
    FaEye,
    FaFilter,
    FaCheckCircle,
    FaClock,
    FaCheck,
} from 'react-icons/fa';

function PostManagement() {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axiosClient.get('/Post');
                setPosts(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPosts();
    }, []);

    const sortedPosts = useMemo(() => {
        return [...posts].sort((a, b) => {
            if (a.status === 'PendingAdmin' && b.status !== 'PendingAdmin') return -1;
            if (a.status !== 'PendingAdmin' && b.status === 'PendingAdmin') return 1;
            return 0;
        });
    }, [posts]);

    const handleApprove = async (id) => {
        try {
            await axiosClient.put(`/Post/admin/post-status/${id}`, JSON.stringify('Published'), {
                headers: { 'Content-Type': 'application/json' },
            });
            setPosts(posts.map((p) => (p.postId === id ? { ...p, status: 'Published' } : p)));
            setSelectedPost(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleReject = async (id) => {
        try {
            await axiosClient.put(`/admin/post-status/${id}`, JSON.stringify('Rejected'), {
                headers: { 'Content-Type': 'application/json' },
            });
            setPosts(posts.filter((p) => p.postId !== id));
            setSelectedPost(null);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div>
                    <h2>Quản Lý Bài Viết</h2>
                    <p>Ưu tiên xử lý các bài viết đang chờ duyệt</p>
                </div>
                <button className={styles.btnAdd}>
                    <FaPlus /> Viết bài mới
                </button>
            </div>

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
                            <tr key={post.postId} className={post.status === 'PendingAdmin' ? styles.pendingRow : ''}>
                                <td className={styles.postCell}>
                                    <div className={styles.imageStack}>
                                        {post.imageUrls && post.imageUrls.length > 0 ? (
                                            <>
                                                <img
                                                    src={post.imageUrls[0]}
                                                    alt="thumb 1"
                                                    className={styles.stackItem}
                                                    style={{ zIndex: 3 }}
                                                />

                                                {post.imageUrls.length >= 2 && (
                                                    <img
                                                        src={post.imageUrls[1]}
                                                        alt="thumb 2"
                                                        className={styles.stackItem}
                                                        style={{ zIndex: 2 }}
                                                    />
                                                )}

                                                {post.imageUrls.length >= 3 && (
                                                    <div className={styles.moreOverlayWrapper} style={{ zIndex: 1 }}>
                                                        <img src={post.imageUrls[2]} alt="thumb 3" />
                                                        <div className={styles.overlay}>
                                                            +{post.imageUrls.length - 2}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className={styles.noImage}>No image</div>
                                        )}
                                    </div>

                                    <div className={styles.postInfo}>
                                        <span className={styles.postTitle}>{post.title || post.content}</span>
                                    </div>
                                </td>

                                <td>
                                    <span className={`${styles.status} ${styles[post.status.toLowerCase()]}`}>
                                        {post.status === 'Published' ? <FaCheckCircle /> : <FaClock />}
                                        {post.status}
                                    </span>
                                </td>

                                <td>{post.userName}</td>

                                <td>
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.btnView}
                                            onClick={() => setSelectedPost(post)}
                                            title="Xem chi tiết & Duyệt"
                                        >
                                            <FaEye />
                                        </button>

                                        {post.status === 'PendingAdmin' && (
                                            <button
                                                className={styles.btnQuickApprove}
                                                onClick={() => handleApprove(post.postId)}
                                                title="Duyệt nhanh"
                                            >
                                                <FaCheck />
                                            </button>
                                        )}

                                        <button className={styles.btnDelete}>
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
