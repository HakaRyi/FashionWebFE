import React from "react";
import { Image as ImageIcon } from "lucide-react";
import styles from "../styles/EventDetail.module.scss";

const PostTable = ({ posts }) => (
    <div className={styles.card}>
        <h3><ImageIcon size={18} /> Bài dự thi ({posts.length})</h3>
        {posts.length > 0 ? (
            <div className={styles.tableWrapper}>
                <table className={styles.postsTable}>
                    <thead>
                        <tr>
                            <th>Ảnh</th>
                            <th>Tiêu đề</th>
                            <th>Tác giả</th>
                            <th>Tương tác</th>
                            <th>Điểm TB</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.postId}>
                                <td>
                                    <img src={post.imageUrl || '/placeholder.png'} className={styles.postThumb} alt="" />
                                </td>
                                <td><strong>{post.title}</strong></td>
                                <td>{post.authorName || "Ẩn danh"}</td>
                                <td>❤️ {post.likeCount || 0}</td>
                                <td>
                                    <span className={styles.scoreBadge}>
                                        {post.averageScore?.toFixed(1) || "N/A"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <p className={styles.emptyText}>Chưa có bài dự thi nào tham gia.</p>
        )}
    </div>
);

export default PostTable;