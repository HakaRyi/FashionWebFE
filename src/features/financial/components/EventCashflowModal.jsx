import React, { useEffect, useState } from "react";
import axiosClient from "@/shared/lib/axios";
import styles from "../styles/EventCashflowModal.module.scss";

const EventCashflowModal = ({ event, onClose }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlow = async () => {
            try {
                // Gọi Hàm 6: Get theo ReferenceType='Event' và ReferenceId
                const res = await axiosClient.get(`/transaction/by-reference?refType=Event&refId=${event.eventId}`);
                setTransactions(res.data);
            } catch (err) {
                console.error("Error fetching event cashflow", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFlow();
    }, [event.eventId]);

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3>Chi tiết dòng tiền: {event.title}</h3>
                    <button onClick={onClose}>&times;</button>
                </div>
                <div className={styles.modalBody}>
                    {loading ? <p>Đang tải dữ liệu...</p> : (
                        <table className={styles.detailTable}>
                            <thead>
                                <tr>
                                    <th>Mã GD</th>
                                    <th>Thời gian</th>
                                    <th>Loại</th>
                                    <th>Số tiền</th>
                                    <th>Số dư sau GD</th>
                                    <th>Nội dung</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t) => (
                                    <tr key={t.transactionId}>
                                        <td>{t.transactionCode}</td>
                                        <td>{new Date(t.createdAt).toLocaleString()}</td>
                                        <td><span className={styles[t.type]}>{t.type}</span></td>
                                        <td className={t.amount > 0 ? styles.positive : styles.negative}>
                                            {t.amount.toLocaleString()}đ
                                        </td>
                                        <td>{t.balanceAfter.toLocaleString()}đ</td>
                                        <td>{t.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventCashflowModal;