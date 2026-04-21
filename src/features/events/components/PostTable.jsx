import React from "react";
import { Image as ImageIcon } from "lucide-react";
import styles from "../styles/EventDetail.module.scss";

const PostTable = ({ posts, onPostClick }) => (
    <div className={styles.card}>
        <h3><ImageIcon size={18} /> Contest Entries ({posts.length})</h3>
        {posts.length > 0 ? (
            <div className={styles.tableWrapper}>
                <table className={styles.postsTable}>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Engagement</th>
                            <th>Average Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.postId}
                                onClick={() => onPostClick(post)}
                                style={{ cursor: 'pointer' }}
                                className={styles.clickableRow}>
                                <td>
                                    <img src={post.imageUrls?.[0] || '/placeholder.png'} className={styles.postThumb} alt="" />
                                </td>
                                <td><strong>{post.title}</strong></td>
                                <td>{post.userName || "Ẩn danh"}</td>
                                <td>❤️ {post.likeCount || 0}</td>
                                <td>
                                    <span className={styles.scoreBadge}>
                                        {post.score?.toFixed(1) || "N/A"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <p className={styles.emptyText}>No contest entries available.</p>
        )}
    </div>
);

export default PostTable;