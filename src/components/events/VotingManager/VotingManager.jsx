import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import styles from './VotingManager.module.scss';

const VotingManager = ({ expertWeight, setWeight }) => {
    const handleChange = (e) => {
        setWeight(Number(e.target.value));
    };

    return (
        <div className={styles.configCard}>
            <div className={styles.cardHeader}>
                <CheckCircle2 size={18} />
                <h3>Trọng số chấm điểm</h3>
            </div>
            <div className={styles.votingRules}>
                <div className={styles.ruleRow}>
                    <div className={styles.ruleLabel}>
                        <span>Expert (Bạn)</span>
                        <strong>{expertWeight}%</strong>
                    </div>
                    <input 
                        type="range" 
                        min="0" max="100" 
                        value={expertWeight} 
                        onChange={handleChange} 
                    />
                </div>
                <div className={styles.ruleRow}>
                    <div className={styles.ruleLabel}>
                        <span>Cộng đồng</span>
                        <strong>{100 - expertWeight}%</strong>
                    </div>
                    <div className={styles.subBar}>
                        <div style={{ width: `${100 - expertWeight}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VotingManager;