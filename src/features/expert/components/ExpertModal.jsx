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
              <h3>Expert Profile: {expert.userName}</h3>
              <span className={styles.idBadge}>ID: #{expert.expertProfileId}</span>
            </div>
          </div>
          <button className={styles.btnClose} onClick={onClose}><IoMdClose size={24} /></button>
        </div>

        <div className={styles.twoColumnBody}>

          {/* CỘT TRÁI: ĐƠN HIỆN TẠI & XÉT DUYỆT */}
          <div className={styles.mainColumn}>
            <section className={styles.section}>
              <h4 className={styles.sectionTitle}><FaFileAlt /> Current Registration Details</h4>

              <div className={styles.statusBanner}>
                Status:
                <span className={`${styles.statusText} ${styles[displayStatus.toLowerCase()]}`}>
                  {displayStatus === "Approved" && <FaCheckCircle />}
                  {displayStatus === "Rejected" && <FaExclamationCircle />}
                  {displayStatus}
                </span>
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoBox}>
                  <label>Specialty</label>
                  <p>{latestRequest?.expertiseField || expert.expertiseField}</p>
                </div>
                <div className={styles.infoBox}>
                  <label>Years of Experience</label>
                  <p>{latestRequest?.yearsOfExperience || expert.yearsOfExperience} years</p>
                </div>
                <div className={styles.infoBox}>
                  <label>Style of Aesthetic</label>
                  <p>{latestRequest?.styleAesthetic || expert.styleAesthetic}</p>
                </div>
                <div className={styles.infoBox}>
                  <label>Submission Date</label>
                  <p>{latestRequest?.createdAt ? new Date(latestRequest.createdAt).toLocaleDateString("vi-VN") : "N/A"}</p>
                </div>
              </div>

              <div className={styles.bioGroup}>
                <label>Bio / Introduction</label>
                <div className={styles.bioContent}>
                  {latestRequest?.bio || expert.bio || "No detailed bio available."}
                </div>
              </div>

              <div className={styles.evidenceSection}>
                <label>Proof of Competency (Certificates/Licenses)</label>
                {evidenceUrl ? (
                  <a href={evidenceUrl} target="_blank" rel="noreferrer" className={styles.evidenceBtn}>
                    <FaExternalLinkAlt /> View Attached Documents
                  </a>
                ) : (
                  <div className={styles.noEvidence}>Expert has not attached any evidence</div>
                )}
              </div>
            </section>

            {/* Form xét duyệt chỉ hiện khi trạng thái là Pending */}
            {displayStatus === "Pending" && (
              <section className={styles.actionPanel}>
                <div className={styles.divider}></div>
                <label className={styles.inputLabel}>Reason for feedback (Required if rejecting)</label>
                <textarea
                  className={styles.rejectTextarea}
                  placeholder="Example: Invalid certificate, Additional information regarding work experience is required..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <div className={styles.actionButtons}>
                  <button className={styles.rejectBtn} onClick={() => onReject(expert)}>Reject Application</button>
                  <button className={styles.approveBtn} onClick={() => onApprove(expert)}>Approve Expert</button>
                </div>
              </section>
            )}
          </div>

          {/* CỘT PHẢI: LỊCH SỬ TRA CỨU (TIMELINE) */}
          <div className={styles.sideColumn}>
            <h4 className={styles.sectionTitle}><FaHistory /> History of Requests</h4>
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
                <div className={styles.emptyHistory}>No previous request data available.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ExpertModal;