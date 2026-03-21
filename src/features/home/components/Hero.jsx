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
                    <div className={styles.badge}>
                        <span className={styles.dot}></span>
                        NEW ERA OF FASHION
                    </div>
                    <h1 className={styles.mainTitle}>
                        CURATING <br />
                        <span className={styles.italic}>Digital</span> <br />
                        <span className={styles.outline}>Elegance.</span>
                    </h1>
                    <p className={styles.heroSub}>
                        Hệ sinh thái thời trang tích hợp AI đầu tiên giúp bạn quản lý, kết nối và nâng tầm phong
                        cách cá nhân một cách chuyên nghiệp.
                    </p>
                    <div className={styles.heroActions}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={styles.primaryBtn}
                            onClick={() => navigate(PATHS.LOGIN)}
                        >
                            BẮT ĐẦU HÀNH TRÌNH <ArrowRight size={18} />
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
                        <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000" alt="Fashion" />
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className={styles.floatingTag}
                        >
                            <Star size={14} fill="#000" />
                            <span>AI Stylist Online</span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;