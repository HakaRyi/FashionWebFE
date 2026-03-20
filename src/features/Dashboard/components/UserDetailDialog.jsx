// src/features/Dashboard/components/UserDetailDialog.jsx
import React from "react";
import styles from "../styles/Dashboard.module.scss";
import { FaXmark, FaUser, FaEnvelope, FaNewspaper, FaUsers, FaUserPlus } from "react-icons/fa6";

function UserDetailDialog({ user, onClose }) {
  if (!user) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Chi tiết người dùng</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <FaXmark />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.profileHeader}>
            <div className={styles.largeAvatar}>
              {user.avatar ? <img src={user.avatar} alt="" /> : user.username[0].toUpperCase()}
            </div>
            <h4>{user.username}</h4>
            <span className={styles.roleBadge}>{user.role}</span>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <FaEnvelope /> <span>Email:</span> <b>{user.email}</b>
            </div>
            <div className={styles.infoItem}>
              <FaUser /> <span>Trạng thái:</span> 
              <b style={{ color: user.status === "Active" ? "#10b981" : "#ef4444" }}> {user.status}</b>
            </div>
            <div className={styles.infoItem}>
              <FaNewspaper /> <span>Bài viết:</span> <b>{user.postCount}</b>
            </div>
            <div className={styles.infoItem}>
              <FaUsers /> <span>Người theo dõi:</span> <b>{user.followerCount}</b>
            </div>
            <div className={styles.infoItem}>
              <FaUserPlus /> <span>Đang theo dõi:</span> <b>{user.followingCount}</b>
            </div>
          </div>
          
          {user.description && (
            <div className={styles.bioSection}>
              <p><b>Giới thiệu:</b> {user.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDetailDialog;