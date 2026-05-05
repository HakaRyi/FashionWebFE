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
                    <h3>Cash flow details: {event.title}</h3>
                    <button onClick={onClose}>&times;</button>
                </div>
                <div className={styles.modalBody}>
                    {loading ? <p>Loading data...</p> : (
                        <table className={styles.detailTable}>
                            <thead>
                                <tr>
                                    <th>Transaction Code</th>
                                    <th>Time</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Balance After Transaction</th>
                                    <th>Content</th>
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