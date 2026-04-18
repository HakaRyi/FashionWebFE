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
            desc: 'Digitize your wardrobe and get daily outfit ideas based on the weather and occasion.',
        },
        {
            icon: <Users />,
            title: 'Social Feed',
            label: '02',
            desc: 'A place where fashionistas share inspiration and connect with the community.',
        },
        {
            icon: <ShoppingBag />,
            title: 'Marketplace',
            label: '03',
            desc: 'An online marketplace for high-end fashion products.',
        },
        {
            icon: <Zap />,
            title: 'AI Consultant',
            label: '04',
            desc: 'An AI assistant that analyzes your body type and provides personalized style advice.',
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
                    <span className={styles.preTitle}>CORE SERVICES</span>
                    <h2>Explore Our Ecosystem</h2>
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