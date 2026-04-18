import { CheckCircle2 } from 'lucide-react';
import styles from '../styles/VotingManager.module.scss';

// Class unused
const VotingManager = ({ expertWeight, setWeight }) => {
    const handleChange = (e) => {
        setWeight(Number(e.target.value));
    };

    return (
        <div className={styles.configCard}>
            <div className={styles.cardHeader}>
                <CheckCircle2 size={18} />
                <h3>Weight of Expert Reviews</h3>
            </div>
            <div className={styles.votingRules}>
                <div className={styles.ruleRow}>
                    <div className={styles.ruleLabel}>
                        <span>Expert (You)</span>
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
                        <span>Community</span>
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