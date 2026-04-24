import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/app/routes/paths';
import styles from '../styles/Home.module.scss';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className={styles.hero}>
            <div className={styles.heroGrid}>
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={styles.heroLeft}
                >
                    {/* <div className={styles.badge}>
                        <span className={styles.dot}></span>
                        NEW ERA OF FASHION
                    </div> */}
                    <h1 className={styles.mainTitle}>
                        STYLING <br />
                        <span className={styles.italic}>Future</span> <br />
                        <span className={styles.outline}>Moments.</span>
                    </h1>
                    <p className={styles.heroSub}>
                        The first AI-integrated fashion ecosystem that helps you manage, connect with, and elevate your personal style professionally.
                    </p>
                    <div className={styles.heroActions}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={styles.primaryBtn}
                            onClick={() => navigate(PATHS.LOGIN)}
                        >
                            GET STARTED <ArrowRight size={18} />
                        </motion.button>
                        <button className={styles.videoBtn}>
                            <div className={styles.playCircle}><Play size={12} fill="currentColor" /></div>
                            SHOWCASE
                        </button>
                    </div>
                </motion.div>

                <div className={styles.heroRight}>
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                        className={styles.imageCard}
                    >
                        <img src="https://cdn.mos.cms.futurecdn.net/upLMiPtbgff8VhXtuHaFZM-1024-80.jpg.webp" alt="Fashion" />
                        {/* <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className={styles.floatingTag}
                        >
                            <Star size={14} fill="#000" />
                            <span>AI Stylist Online</span>
                        </motion.div> */}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;