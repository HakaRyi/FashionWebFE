import { useState, useEffect } from 'react';
import styles from '../styles/QuickUpdateModal.module.scss';

const QuickUpdateModal = ({ event, onClose, onSave }) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const formatToLocalInput = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const [formData, setFormData] = useState({
        title: event.title || '',
        description: event.description || '',
        startTime: formatToLocalInput(event.startTime),
        submissionDeadline: formatToLocalInput(event.submissionDeadline),
        endTime: formatToLocalInput(event.endTime),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = () => {
        const toUTC = (localStr) => {
            if (!localStr) return null;
            const date = new Date(localStr);
            return date.toISOString();
        };

        const dataToSave = {
            ...formData,
            startTime: toUTC(formData.startTime),
            submissionDeadline: toUTC(formData.submissionDeadline),
            endTime: toUTC(formData.endTime),
        };

        onSave(event.eventId, dataToSave);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.modalHeader}>
                    <h2>Edit event</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.formGroup}>
                        <label>Title</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter event title..."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Short description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Event description..."
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>Start time</label>
                            <input
                                type="datetime-local"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Submission deadline</label>
                            <input
                                type="datetime-local"
                                name="submissionDeadline"
                                value={formData.submissionDeadline}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>End time</label>
                            <input
                                type="datetime-local"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                            />
                        </div>
                    </div>


                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.btnBack} onClick={onClose}>
                        Cancel
                    </button>
                    <button className={styles.btnApprove} onClick={handleSaveClick}>
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuickUpdateModal;