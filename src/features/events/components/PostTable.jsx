import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import styles from "../styles/EventDetail.module.scss";
import { PostDetailModal } from "@/features/feed";
import { motion, AnimatePresence } from "framer-motion";

const PostTable = ({ posts, onPostClick }) => {

    const [selectedPostId, setSelectedPostId] = useState(null);

    return (
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
                                <th>Date</th>
                                <th>Average Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.postId}
                                    onClick={() => setSelectedPostId(post.postId)}
                                    style={{ cursor: 'pointer' }}
                                    className={styles.clickableRow}>
                                    <td>
                                        <img src={post.imageUrls?.[0] || '/placeholder.png'} className={styles.postThumb} alt="" />
                                    </td>
                                    <td><strong>{post.title}</strong></td>
                                    <td>{post.userName || "Ẩn danh"}</td>
                                    <td>{post.createdAt ? post.createdAt.slice(0, 10) : "N/A"}</td>
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
            <AnimatePresence>
                {selectedPostId && (
                    <PostDetailModal
                        id={selectedPostId}
                        onClose={() => setSelectedPostId(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
export default PostTable;