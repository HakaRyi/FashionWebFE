import { IoMdClose } from "react-icons/io";
import { 
  FaHistory, FaFileAlt, FaUserCircle, 
  FaExternalLinkAlt, FaInfoCircle, FaCheckCircle, FaExclamationCircle 
} from "react-icons/fa";
import styles from "../styles/ExpertModal.module.scss";

function ExpertModal({ expert, onClose, onApprove, onReject, rejectReason, setRejectReason }) {
  if (!expert) return null;

  const latestRequest = expert.expertRequests?.[0];
  const historyRequests = expert.expertRequests?.slice(1) || [];
  
  const displayStatus = latestRequest 
    ? latestRequest.status 
    : (expert.verified ? "Approved" : "None");

  const evidenceUrl = latestRequest?.certificateUrl || latestRequest?.licenseUrl;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContent} ${styles.wideModal}`} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.titleGroup}>
            <div className={styles.avatarCircle}>
              {expert.userName?.charAt(0).toUpperCase() || "E"}
            </div>
            <div>
              <h3>Hồ sơ Chuyên gia: {expert.userName}</h3>
              <span className={styles.idBadge}>ID: #{expert.expertProfileId}</span>
            </div>
          </div>
          <button className={styles.btnClose} onClick={onClose}><IoMdClose size={24} /></button>
        </div>

        <div className={styles.twoColumnBody}>
          
          {/* CỘT TRÁI: ĐƠN HIỆN TẠI & XÉT DUYỆT */}
          <div className={styles.mainColumn}>
            <section className={styles.section}>
              <h4 className={styles.sectionTitle}><FaFileAlt /> Chi tiết đơn đăng ký hiện tại</h4>
              
              <div className={styles.statusBanner}>
                Trạng thái: 
                <span className={`${styles.statusText} ${styles[displayStatus.toLowerCase()]}`}>
                  {displayStatus === "Approved" && <FaCheckCircle />}
                  {displayStatus === "Rejected" && <FaExclamationCircle />}
                  {displayStatus}
                </span>
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoBox}>
                  <label>Lĩnh vực chuyên môn</label>
                  <p>{latestRequest?.expertiseField || expert.expertiseField}</p>
                </div>
                <div className={styles.infoBox}>
                  <label>Số năm kinh nghiệm</label>
                  <p>{latestRequest?.yearsOfExperience || expert.yearsOfExperience} năm</p>
                </div>
                <div className={styles.infoBox}>
                  <label>Phong cách thẩm mỹ</label>
                  <p>{latestRequest?.styleAesthetic || expert.styleAesthetic}</p>
                </div>
                <div className={styles.infoBox}>
                  <label>Ngày gửi đơn</label>
                  <p>{latestRequest?.createdAt ? new Date(latestRequest.createdAt).toLocaleDateString("vi-VN") : "N/A"}</p>
                </div>
              </div>

              <div className={styles.bioGroup}>
                <label>Tiểu sử / Giới thiệu</label>
                <div className={styles.bioContent}>
                  {latestRequest?.bio || expert.bio || "Không có tiểu sử cụ thể."}
                </div>
              </div>

              <div className={styles.evidenceSection}>
                <label>Minh chứng năng lực (Chứng chỉ/Giấy phép)</label>
                {evidenceUrl ? (
                  <a href={evidenceUrl} target="_blank" rel="noreferrer" className={styles.evidenceBtn}>
                    <FaExternalLinkAlt /> Xem tài liệu đính kèm
                  </a>
                ) : (
                  <div className={styles.noEvidence}>⚠️ Chuyên gia chưa đính kèm minh chứng</div>
                )}
              </div>
            </section>

            {/* Form xét duyệt chỉ hiện khi trạng thái là Pending */}
            {displayStatus === "Pending" && (
              <section className={styles.actionPanel}>
                <div className={styles.divider}></div>
                <label className={styles.inputLabel}>Lý do phản hồi (Bắt buộc nếu từ chối)</label>
                <textarea
                  className={styles.rejectTextarea}
                  placeholder="Ví dụ: Chứng chỉ không hợp lệ, Cần bổ sung thêm thông tin về kinh nghiệm làm việc..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <div className={styles.actionButtons}>
                  <button className={styles.rejectBtn} onClick={() => onReject(expert)}>Từ chối hồ sơ</button>
                  <button className={styles.approveBtn} onClick={() => onApprove(expert)}>Phê duyệt chuyên gia</button>
                </div>
              </section>
            )}
          </div>

          {/* CỘT PHẢI: LỊCH SỬ TRA CỨU (TIMELINE) */}
          <div className={styles.sideColumn}>
            <h4 className={styles.sectionTitle}><FaHistory /> Lịch sử yêu cầu</h4>
            <div className={styles.timelineContainer}>
              {historyRequests.length > 0 ? (
                historyRequests.map((req) => (
                  <div key={req.expertFileId} className={styles.timelineCard}>
                    <div className={styles.cardHeader}>
                      <span className={`${styles.miniStatus} ${styles[req.status.toLowerCase()]}`}>
                        {req.status}
                      </span>
                      <div className={styles.infoTooltipWrapper}>
                        <FaInfoCircle className={styles.infoIcon} />
                        <div className={styles.tooltipCard}>
                          <p><strong>Bio:</strong> {req.bio || "N/A"}</p>
                          <p><strong>Field:</strong> {req.expertiseField}</p>
                          <p><strong>Exp:</strong> {req.yearsOfExperience} năm</p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.cardBody}>
                      <small className={styles.dateText}>
                        Ngày: {new Date(req.createdAt).toLocaleDateString("vi-VN")}
                      </small>
                      {req.reason && <p className={styles.historyReason}>"{req.reason}"</p>}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyHistory}>Không có dữ liệu lịch sử cũ.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ExpertModal;