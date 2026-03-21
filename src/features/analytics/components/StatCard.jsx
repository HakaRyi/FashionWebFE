import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import styles from '../styles/Analytics.module.scss';

const StatCard = ({ stat, index }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={styles.statCard}
    >
        <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>{stat.icon}</div>
            <span className={`${styles.badge} ${stat.isUp ? styles.up : styles.down}`}>
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
            </span>
        </div>
        <div className={styles.cardContent}>
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
        </div>
    </motion.div>
);

export default StatCard;