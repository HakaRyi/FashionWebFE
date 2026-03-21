import { IoMdClose } from "react-icons/io";
import styles from "../styles/Expert.module.scss";

function ExpertModal({ 
  expert, 
  onClose, 
  onApprove, 
  onReject, 
  rejectReason, 
  setRejectReason 
}) {
  if (!expert) return null;

  const evidenceUrl = expert.expertFile?.certificateUrl || expert.expertFile?.licenseUrl;
  const status = expert.expertFile?.status || "Pending";

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* Header Modal */}
        <div className={styles.modalHeader}>
          <h3>Chi tiết hồ sơ chuyên gia</h3>
          <button className={styles.btnClose} onClick={onClose}>
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Body Modal */}
        <div className={styles.modalBody}>
          <div className={styles.infoSection}>
            <h4>Thông tin cơ bản</h4>
            <p><strong>Họ tên:</strong> {expert.account?.userName || expert.userName || "N/A"}</p>
            <p><strong>Chuyên môn:</strong> {expert.expertiseField}</p>
            <p><strong>Kinh nghiệm:</strong> {expert.yearsOfExperience} năm</p>
            <p><strong>Phong cách thiết kế:</strong> {expert.styleAesthetic}</p>
          </div>

          <div className={styles.infoSection}>
            <h4>Tiểu sử & Minh chứng</h4>
            <p>{expert.bio || "Không có tiểu sử cụ thể."}</p>
            {evidenceUrl ? (
              <p>
                🔗 <a href={evidenceUrl} target="_blank" rel="noreferrer">
                  Xem tài liệu bằng chứng (PDF/Image)
                </a>
              </p>
            ) : (
              <p style={{ color: '#ef4444' }}>⚠️ Chưa có tệp đính kèm minh chứng.</p>
            )}
          </div>

          {/* Form xét duyệt chỉ hiện khi trạng thái là Pending */}
          {status === "Pending" && (
            <div className={styles.approvalForm}>
              <label>Lý do từ chối (nếu có):</label>
              <textarea
                placeholder="Nêu rõ lý do từ chối hồ sơ này..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <div className={styles.modalActions}>
                <button className={styles.btnReject} onClick={() => onReject(expert)}>
                  Từ chối hồ sơ
                </button>
                <button className={styles.btnApprove} onClick={() => onApprove(expert)}>
                  Phê duyệt ngay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpertModal;