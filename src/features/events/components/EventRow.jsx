import React from 'react';
import { Eye, Users, Edit3 } from 'lucide-react';
import styles from '../styles/EventManagement.module.scss';

const EventRow = ({ event, onOpenDetail, onQuickEdit }) => {
    const totalEscrow = (event.totalPrizePool || 0) + (event.appliedFee || 0);

    return (
        <tr>
            <td>{new Date(event.createdAt).toLocaleDateString('vi-VN')}</td>
            <td className={styles.nameCol}>
                <div className={styles.eventInfo}>
                    <strong>{event.title}</strong>
                    <span><Users size={12} /> {event.creatorName}</span>
                </div>
            </td>
            <td className={styles.timeCol}>
                <div className={styles.timeRange}>
                    <span>Start day: {new Date(event.startTime).toLocaleDateString('vi-VN')}</span>
                    <span>End day: {new Date(event.endTime).toLocaleDateString('vi-VN')}</span>
                </div>
            </td>
            <td className={styles.priceCol}>
                {totalEscrow.toLocaleString()} đ
            </td>
            <td>
                <span className={`${styles.statusBadge} ${styles[event.status?.toLowerCase()]}`}>
                    {event.status}
                </span>
            </td>
            <td style={{ textAlign: 'right' }}>
                <button className={styles.btnView} onClick={() => onOpenDetail(event)}>
                    <Eye size={16} /> View Details
                </button>
                <button className={styles.btnEdit} onClick={() => onQuickEdit(event)}>
                    <Edit3 size={16} /> <span>Edit</span>
                </button>
            </td>
        </tr>
    );
};

export default EventRow;