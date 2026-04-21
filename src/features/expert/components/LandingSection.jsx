import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import styles from '../styles/ExpertApplication.module.scss';

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
            <span className={styles.badge}>WAPO PROFESSIONAL</span>
            <h1 className={styles.title}>Turn Your Passion <span>Into Influence</span></h1>
            <p className={styles.subtitle}>Join an elite community exclusively for top fashion professionals.</p>
            <button className={styles.btnMain} onClick={onStart}>
                Apply for Expert Role <ArrowRight size={20} />
            </button>
        </header>

        <section className={styles.featuresSection}>
            <div className={styles.grid}>
                <FeatureCard icon={<ShieldCheck />} title="Verified" desc="Receive verified badge for trusted expert status." />
                <FeatureCard icon={<Zap />} title="Pro Tools" desc="Advanced analytics tools and exclusive privileges." />
                <FeatureCard icon={<Globe />} title="Network" desc="Direct connections with global luxury brands." />
            </div>
        </section>
    </motion.div>
);

export default LandingSection;