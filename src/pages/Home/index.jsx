import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, ShoppingBag, Users, Zap, ArrowRight, Play, Star, ChevronRight } from 'lucide-react';
import styles from './Home.module.scss';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

const Home = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'circOut' } },
    };

    return (
        <div className={styles.homeContainer}>
            {/* --- HERO SECTION --- */}
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
                                <div className={styles.playCircle}>
                                    <Play size={12} fill="currentColor" />
                                </div>
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
                            <img
                                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000"
                                alt="Fashion"
                            />
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

            {/* --- SERVICES: THE ECOSYSTEM --- */}
            <section className={styles.serviceSection}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className={styles.contentWrapper}
                >
                    <motion.div variants={itemVariants} className={styles.sectionHeader}>
                        <span className={styles.preTitle}>DỊCH VỤ CỐT LÕI</span>
                        <h2>Khám phá hệ sinh thái của chúng tôi</h2>
                    </motion.div>

                    <div className={styles.serviceGrid}>
                        {[
                            {
                                icon: <LayoutGrid />,
                                title: 'Smart Closet',
                                label: '01',
                                desc: 'Số hóa tủ đồ, gợi ý phối đồ hàng ngày dựa trên thời tiết và sự kiện.',
                            },
                            {
                                icon: <Users />,
                                title: 'Social Feed',
                                label: '02',
                                desc: 'Nơi các Fashionista chia sẻ cảm hứng và kết nối cùng cộng đồng.',
                            },
                            {
                                icon: <ShoppingBag />,
                                title: 'Marketplace',
                                label: '03',
                                desc: 'Sàn thương mại điện tử dành cho các sản phẩm thời trang cao cấp.',
                            },
                            {
                                icon: <Zap />,
                                title: 'AI Consultant',
                                label: '04',
                                desc: 'Trợ lý ảo phân tích vóc dáng và tư vấn phong cách riêng biệt.',
                            },
                        ].map((item, index) => (
                            <motion.div variants={itemVariants} key={index} className={styles.serviceCard}>
                                <span className={styles.cardNumber}>{item.label}</span>
                                <div className={styles.iconBox}>{item.icon}</div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                                <div className={styles.arrowBox}>
                                    <ChevronRight size={20} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* --- BENTO SHOWCASE --- */}
            <section className={styles.bentoSection}>
                <div className={styles.bentoHeader}>
                    <h2>STYLE MOMENTS</h2>
                    <button className={styles.viewAll}>XEM TẤT CẢ</button>
                </div>
                <div className={styles.bentoGrid}>
                    <div className={styles.bentoMain}>
                        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800" alt="Main" />
                        <div className={styles.overlay}>
                            <h3>CỘNG ĐỒNG VOGUE</h3>
                            <p>Hơn 1 triệu bộ outfit được chia sẻ</p>
                        </div>
                    </div>
                    <div className={styles.bentoSide}>
                        <div className={styles.sideTop}>
                            <img
                                src="https://media.istockphoto.com/id/1489207181/vi/anh/ng%C6%B0%E1%BB%9Di-ph%E1%BB%A5-n%E1%BB%AF-h%E1%BA%A5p-d%E1%BA%ABn-m%E1%BB%89m-c%C6%B0%E1%BB%9Di-th%C3%A2n-thi%E1%BB%87n-r%E1%BB%9Di-kh%E1%BB%8Fi-t%C3%B2a-nh%C3%A0.jpg?s=612x612&w=0&k=20&c=a1s6bErekOxKYu57ermDkOkB2_sZSpUrIE2KLk5Mimo="
                                alt="Side"
                            />
                        </div>
                        <div className={styles.sideBottom}>
                            <div className={styles.darkCard}>
                                <h4>Nâng tầm phong cách cá nhân ngay hôm nay</h4>
                                <ArrowRight />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
