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
                <h2>Scoring criteria</h2>
                <p>Set up the criteria and weights for the judging panel to have a fair basis for scoring. The total weight must equal 100%.</p>
            </div>

            <div className={styles.criteriaList}>
                {criteria.map((c, index) => (
                    <div key={c.id} className={styles.criteriaCard}>
                        <div className={styles.criteriaHeader}>
                            <h4>Criterion {index + 1}</h4>
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
                            <label>Criterion Name *</label>
                            <input
                                type="text"
                                placeholder="e.g., Creativity, Aesthetics..."
                                value={c.name}
                                onChange={(e) => handleChange(c.id, 'name', e.target.value)}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Description (Optional)</label>
                            <textarea
                                placeholder="Detailed instructions for judges about this criterion..."
                                rows={2}
                                value={c.description}
                                onChange={(e) => handleChange(c.id, 'description', e.target.value)}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Weight (%) *</label>
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
                <Plus size={16} /> Add Criterion
            </button>

            {/* Hiển thị tổng trọng số và cảnh báo */}
            <div className={`${styles.weightSummary} ${totalWeight !== 100 ? styles.invalid : styles.valid}`}>
                <div className={styles.weightStatus}>
                    <span>Total weight:</span>
                    <strong>{totalWeight}%</strong>
                </div>
                {totalWeight !== 100 && (
                    <div className={styles.warningMessage}>
                        <AlertCircle size={16} />
                        <span>The total weight must equal exactly 100%. Please adjust!</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StepCriteria;