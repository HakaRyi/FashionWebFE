import styles from "../styles/Expert.module.scss";

function ExpertModal({
  expert,
  onClose,
  onApprove,
  onReject,
  rejectReason,
  setRejectReason
}) {

  if(!expert) return null

  return(

    <div className={styles.modalOverlay}>

      <div className={styles.modalContent}>

        <h3>Expert #{expert.expertProfileId}</h3>

        <p>
          Bio: {expert.bio}
        </p>

        <p>
          Style: {expert.styleAesthetic}
        </p>

        <textarea
          placeholder="Reason..."
          value={rejectReason}
          onChange={(e)=>setRejectReason(e.target.value)}
        />

        <div>

          <button
            onClick={()=>onReject(expert)}
          >
            Reject
          </button>

          <button
            onClick={()=>onApprove(expert)}
          >
            Approve
          </button>

          <button
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>

    </div>

  )

}

export default ExpertModal