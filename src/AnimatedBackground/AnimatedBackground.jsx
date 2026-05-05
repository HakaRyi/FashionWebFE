import React from 'react';
import styles from './AnimatedBackground.module.scss';

const AnimatedBackground = ({ children }) => {
  return (
    <div className={styles.container}>
      {/* Lớp nền chứa các khối màu chuyển động */}
      <div className={styles.background}>
        <div className={`${styles.blob} ${styles.blob1}`}></div>
        <div className={`${styles.blob} ${styles.blob2}`}></div>
        <div className={`${styles.blob} ${styles.blob3}`}></div>
        {/* Lớp phủ kính mờ (glass) làm dịu màu */}
        <div className={styles.overlay}></div>
      </div>
      
      {/* Nội dung Dashboard đè lên trên */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;