import React, { useState } from 'react';
import styles from '../styles/QuickUpdateModal.module.scss';

const QuickUpdateModal = ({ event, onClose, onSave }) => {

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const tzOffset = date.getTimezoneOffset() * 60000;
        const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
        return localISOTime;
    };

    const [formData, setFormData] = useState({
        title: event.title || '',
        description: event.description || '',
        startTime: formatDateTime(event.startTime),
        submissionDeadline: formatDateTime(event.submissionDeadline),
        endTime: formatDateTime(event.endTime),
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveClick = () => {
        const convertToISOWithTimezone = (dateStr) => {
            if (!dateStr) return null;
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return `${year}-${month}-${day}T${hours}:${minutes}:00+07:00`;
        };

        const dataToSave = {
            ...formData,
            startTime: convertToISOWithTimezone(formData.startTime),
            submissionDeadline: convertToISOWithTimezone(formData.submissionDeadline),
            endTime: convertToISOWithTimezone(formData.endTime),
        };

        onSave(event.eventId, dataToSave);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Chỉnh sửa: {event.title}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.formGroup}>
                        <label>Tiêu đề</label>
                        <input name="title" value={formData.title} onChange={handleChange} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Mô tả</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Bắt đầu</label>
                        <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Hạn nộp bài</label>
                        <input type="datetime-local" name="submissionDeadline" value={formData.submissionDeadline} onChange={handleChange} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Kết thúc</label>
                        <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} />
                    </div>

                    <div className={styles.modalFooter}>
                        <button className={styles.btnApprove} onClick={handleSaveClick}>
                            Lưu thay đổi
                        </button>
                        <button className={styles.btnBack} onClick={onClose}>Hủy</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickUpdateModal;