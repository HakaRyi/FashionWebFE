import React from 'react';
import styles from '../styles/CinematicBackground.module.scss';

const CinematicBackground = () => {
  return (
    <>
      <div className={styles.masterContainer}>
        {/* Các lớp chuyển động Liquid */}
        <div className={`${styles.blob} ${styles.blob1}`}></div>
        <div className={`${styles.blob} ${styles.blob2}`}></div>
        <div className={`${styles.blob} ${styles.blob3}`}></div>
        
        {/* Lớp tạo chiều sâu ánh sáng */}
        <div className={styles.vignette}></div>
      </div>

      {/* SVG Filter Cấp độ Master: Tạo độ mượt và dính cực cao */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <defs>
          <filter id="liquid-master">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
            {/* Phép toán Matrix để tạo hiệu ứng nhựa lỏng - Liquify */}
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -15" 
              result="goo" 
            />
            {/* Tạo bóng đổ nhẹ cho các đường viền uốn lượn */}
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodOpacity="0.1" />
          </filter>
        </defs>
      </svg>
    </>
  );
};

export default CinematicBackground;