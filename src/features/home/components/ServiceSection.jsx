import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Users, ShoppingBag, Zap } from 'lucide-react';
import ServiceCard from './ServiceCard';
import styles from '../styles/Home.module.scss';

const ServiceSection = () => {
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

    const services = [
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
    ];

    return (
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
                    {services.map((item, index) => (
                        <ServiceCard 
                            key={index} 
                            item={item} 
                            variants={itemVariants} 
                        />
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default ServiceSection;