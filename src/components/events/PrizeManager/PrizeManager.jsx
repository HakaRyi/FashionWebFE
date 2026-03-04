import React from 'react';
import { Trophy, Coins, X, Plus } from 'lucide-react';
import styles from './PrizeManager.module.scss';

const PrizeManager = ({ prizes, setPrizes, totalBudget, isOverBudget }) => {
    
    const updatePrize = (index, field, value) => {
        const newPrizes = [...prizes];
        newPrizes[index][field] = value;
        setPrizes(newPrizes);
    };

    const addPrize = () => setPrizes([...prizes, { label: 'Giải mới', amount: 0 }]);
    
    const removePrize = (index) => setPrizes(prizes.filter((_, i) => i !== index));

    return (
        <div className={styles.configCard}>
            <div className={styles.cardHeader}>
                <Trophy size={18} />
                <h3>Cơ chế giải thưởng</h3>
                <div className={`${styles.totalBadge} ${isOverBudget ? styles.err : ''}`}>
                    Tổng: {totalBudget.toLocaleString()}
                </div>
            </div>

            <div className={styles.prizeScroll}>
                {prizes.map((prize, index) => (
                    <div key={index} className={styles.prizeRow}>
                        <input
                            value={prize.label}
                            onChange={(e) => updatePrize(index, 'label', e.target.value)}
                        />
                        <div className={styles.inputWrap}>
                            <input
                                type="number"
                                value={prize.amount}
                                onChange={(e) => updatePrize(index, 'amount', e.target.value)}
                            />
                            <Coins size={14} />
                        </div>
                        <button onClick={() => removePrize(index)}><X size={14} /></button>
                    </div>
                ))}
                <button className={styles.addBtn} onClick={addPrize}>
                    <Plus size={16} /> Thêm hạng mục
                </button>
            </div>
        </div>
    );
};

export default PrizeManager;