import React from 'react';
import { Hero, ServiceSection, BentoShowcase } from '@/features/home';
import styles from '@/features/home/styles/Home.module.scss';

const Home = () => {
    return (
        <div className={styles.homeContainer}>
            <Hero />

            <ServiceSection />

            <BentoShowcase />
        </div>
    );
};

export default Home;