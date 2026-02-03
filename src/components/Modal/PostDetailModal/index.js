import React from 'react';
import styles from './PostDetailModal.module.scss';
import { FaCheck, FaTimes, FaRegUser, FaTag } from 'react-icons/fa';

function PostDetailModal({ post, onClose, onApprove, onReject }) {
    if (!post) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>Chi tiết bài viết</h3>
                    <button className={styles.btnClose} onClick={onClose}>&times;</button>
                </div>
                
                <div className={styles.body}>
                    <img src={post.thumbnail} alt={post.title} className={styles.mainImg} />
                    <h2 className={styles.title}>{post.title}</h2>
                    
                    <div className={styles.meta}>
                        <span><FaRegUser /> {post.author}</span>
                        <span><FaTag /> {post.category}</span>
                        <span>Ngày: {post.date}</span>
                    </div>

                    <div className={styles.content}>
                        <p>Đây là nội dung giả lập của bài viết. Trong thực tế, bạn sẽ lấy dữ liệu `content` từ API để hiển thị ở đây...</p>
                        <p>Bài viết này chứa các thông tin về xu hướng thời trang mới nhất và các lời khuyên từ chuyên gia.</p>
                    </div>
                </div>

                <div className={styles.footer}>
                    {post.status === 'Pending' ? (
                        <>
                            <button className={styles.btnApprove} onClick={() => onApprove(post.id)}>
                                <FaCheck /> Duyệt bài
                            </button>
                            <button className={styles.btnReject} onClick={() => onReject(post.id)}>
                                <FaTimes /> Từ chối
                            </button>
                        </>
                    ) : (
                        <button className={styles.btnSecondary} onClick={onClose}>Đóng</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PostDetailModal;