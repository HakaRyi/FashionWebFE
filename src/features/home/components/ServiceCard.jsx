import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import styles from '../styles/Home.module.scss';

const ServiceCard = ({ item, variants }) => (
    <motion.div variants={variants} className={styles.serviceCard}>
        <span className={styles.cardNumber}>{item.label}</span>
        <div className={styles.iconBox}>{item.icon}</div>
        <h3>{item.title}</h3>
        <p>{item.desc}</p>
        <div className={styles.arrowBox}>
            <ChevronRight size={20} />
        </div>
    </motion.div>
);

export default ServiceCard;