import React from 'react';
import { ArrowRight } from 'lucide-react';
import styles from '../styles/Home.module.scss';

const BentoShowcase = () => (
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
                    <img src="https://media.istockphoto.com/id/1489207181/vi/anh/ng%C6%B0%E1%BB%9Di-ph%E1%BB%A5-n%E1%BB%AF-h%E1%BA%A5p-d%E1%BA%ABn-m%E1%BB%89m-c%C6%B0%E1%BB%9Di-th%C3%A2n-thi%E1%BB%87n-r%E1%BB%9Di-kh%E1%BB%8Fi-t%C3%B2a-nh%C3%A0.jpg?s=612x612&w=0&k=20&c=a1s6bErekOxKYu57ermDkOkB2_sZSpUrIE2KLk5Mimo=" alt="Side" />
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
);

export default BentoShowcase;