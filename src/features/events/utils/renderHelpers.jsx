import React from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import styles from "../styles/EventDetail.module.scss";

export const renderExpertStatus = (status) => {
  switch (status) {
    case "Accepted":
      return (
        <span className={`${styles.expertStatus} ${styles.accepted}`}>
          <CheckCircle size={12} /> Đã chấp nhận
        </span>
      );
    case "Pending":
      return (
        <span className={`${styles.expertStatus} ${styles.pending}`}>
          <Clock size={12} /> Đang chờ phản hồi
        </span>
      );
    case "Rejected":
      return (
        <span className={`${styles.expertStatus} ${styles.rejected}`}>
          <XCircle size={12} /> Đã từ chối
        </span>
      );
    default:
      return <span className={styles.expertStatus}>{status}</span>;
  }
};