import React from 'react';
import styles from './PostDetailModal.module.scss';
import { FaCheck, FaTimes, FaRegUser, FaCalendarAlt } from 'react-icons/fa';

function PostDetailModal({ post, onClose, onApprove, onReject }) {
    if (!post) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>Chi tiết bài viết</h3>
                    <button className={styles.btnClose} onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className={styles.body}>
                    {post.imageUrls && post.imageUrls.length > 0 && (
                        <div className={styles.imageGallery}>
                            {post.imageUrls.map((url, index) => (
                                <img key={index} src={url} alt={`post-img-${index}`} className={styles.postImg} />
                            ))}
                        </div>
                    )}

                    <h2 className={styles.title}>{post.title || 'Bài viết không có tiêu đề'}</h2>

                    <div className={styles.meta}>
                        <span>
                            <FaRegUser /> {post.userName}
                        </span>
                        <span>
                            <FaCalendarAlt /> {formatDate(post.createdAt)}
                        </span>
                    </div>

                    <div className={styles.content}>
                        <p>{post.content}</p>
                    </div>
                </div>

                <div className={styles.footer}>
                    {post.status === 'PendingAdmin' ? (
                        <>
                            <button className={styles.btnApprove} onClick={() => onApprove(post.postId)}>
                                <FaCheck /> Duyệt bài
                            </button>
                            <button className={styles.btnReject} onClick={() => onReject(post.postId)}>
                                <FaTimes /> Từ chối
                            </button>
                        </>
                    ) : (
                        <button className={styles.btnSecondary} onClick={onClose}>
                            Đóng
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PostDetailModal;
