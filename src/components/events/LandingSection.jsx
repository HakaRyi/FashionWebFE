import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import styles from '../../pages/ExpertApplication/ExpertApplication.module.scss';

const FeatureCard = ({ icon, title, desc }) => (
    <div className={styles.featureCard}>
        <div className={styles.icon}>{icon}</div>
        <h3>{title}</h3>
        <p>{desc}</p>
    </div>
);

const LandingSection = ({ onStart }) => (
    <motion.div
        key="landing"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className={styles.introWrapper}
    >
        <header className={styles.hero}>
            <span className={styles.badge}>VOGUE PROFESSIONAL</span>
            <h1 className={styles.title}>Turn Your Passion <span>Into Influence</span></h1>
            <p className={styles.subtitle}>Gia nhập cộng đồng tinh hoa dành riêng cho chuyên gia thời trang hàng đầu.</p>
            <button className={styles.btnMain} onClick={onStart}>
                Apply for Expert Role <ArrowRight size={20} />
            </button>
        </header>

        <section className={styles.featuresSection}>
            <div className={styles.grid}>
                <FeatureCard icon={<ShieldCheck />} title="Verified" desc="Nhận tích xanh định danh chuyên gia uy tín." />
                <FeatureCard icon={<Zap />} title="Pro Tools" desc="Công cụ phân tích xu hướng và quản lý đặc quyền." />
                <FeatureCard icon={<Globe />} title="Network" desc="Kết nối trực tiếp với các nhãn hàng xa xỉ toàn cầu." />
            </div>
        </section>
    </motion.div>
);

export default LandingSection;