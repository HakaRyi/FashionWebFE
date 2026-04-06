import React, { useMemo } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import styles from '../../styles/StepCriteria.module.scss';

const StepCriteria = ({ criteria, setCriteria }) => {

    const handleAddCriteria = () => {
        setCriteria([...criteria, { id: Date.now(), name: '', description: '', weightPercentage: 0 }]);
    };

    const handleRemoveCriteria = (id) => {
        setCriteria(criteria.filter(c => c.id !== id));
    };

    const handleChange = (id, field, value) => {
        setCriteria(criteria.map(c => {
            if (c.id === id) {
                const val = field === 'weightPercentage'
                    ? (value === '' ? '' : Math.max(0, parseInt(value) || 0))
                    : value;
                return { ...c, [field]: val };
            }
            return c;
        }));
    };

    const totalWeight = useMemo(() => {
        return criteria.reduce((sum, c) => sum + Number(c.weightPercentage || 0), 0);
    }, [criteria]);

    return (
        <div className={styles.stepContainer}>
            <div className={styles.stepHeader}>
                <h2>Tiêu chí chấm điểm</h2>
                <p>Thiết lập các tiêu chí và trọng số để ban giám khảo có cơ sở chấm điểm công bằng. Tổng trọng số phải bằng 100%.</p>
            </div>

            <div className={styles.criteriaList}>
                {criteria.map((c, index) => (
                    <div key={c.id} className={styles.criteriaCard}>
                        <div className={styles.criteriaHeader}>
                            <h4>Tiêu chí {index + 1}</h4>
                            <button
                                type="button"
                                className={styles.btnRemove}
                                onClick={() => handleRemoveCriteria(c.id)}
                                disabled={criteria.length <= 1}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Tên tiêu chí *</label>
                            <input
                                type="text"
                                placeholder="VD: Tính sáng tạo, Thẩm mỹ..."
                                value={c.name}
                                onChange={(e) => handleChange(c.id, 'name', e.target.value)}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Mô tả (Tuỳ chọn)</label>
                            <textarea
                                placeholder="Hướng dẫn chi tiết cho giám khảo về tiêu chí này..."
                                rows={2}
                                value={c.description}
                                onChange={(e) => handleChange(c.id, 'description', e.target.value)}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Trọng số (%) *</label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={c.weightPercentage}
                                onChange={(e) => handleChange(c.id, 'weightPercentage', e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <button type="button" className={styles.btnAddItem} onClick={handleAddCriteria}>
                <Plus size={16} /> Thêm tiêu chí
            </button>

            {/* Hiển thị tổng trọng số và cảnh báo */}
            <div className={`${styles.weightSummary} ${totalWeight !== 100 ? styles.invalid : styles.valid}`}>
                <div className={styles.weightStatus}>
                    <span>Tổng trọng số hiện tại:</span>
                    <strong>{totalWeight}%</strong>
                </div>
                {totalWeight !== 100 && (
                    <div className={styles.warningMessage}>
                        <AlertCircle size={16} />
                        <span>Tổng trọng số phải bằng đúng 100%. Vui lòng điều chỉnh!</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StepCriteria;