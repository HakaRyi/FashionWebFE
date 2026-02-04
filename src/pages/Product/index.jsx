import React, { useState } from 'react';
import styles from './Product.module.scss';
import { FaCoins, FaEdit, FaTrash, FaPlus, FaGem, FaCrown, FaBolt, FaStar } from 'react-icons/fa';

const initialPackages = [
    { 
        id: 1, 
        name: 'Gói Cơ Bản', 
        coins: 50, 
        price: 50000, 
        bonus: 0,
        icon: <FaBolt />, 
        color: '#3b82f6',
        description: 'Phù hợp cho người mới bắt đầu trải nghiệm.'
    },
    { 
        id: 2, 
        name: 'Gói Nâng Cao', 
        coins: 210, // 200 + 5% (10 coins)
        price: 200000, 
        bonus: 5,
        icon: <FaStar />, 
        color: '#10b981',
        description: 'Tặng thêm 5% giá trị coin khi mua.'
    },
    { 
        id: 3, 
        name: 'Gói VIP', 
        coins: 550, // 500 + 10% (50 coins)
        price: 500000, 
        bonus: 10,
        icon: <FaCrown />, 
        color: '#f59e0b',
        description: 'Tặng thêm 10% giá trị coin + Badge VIP.'
    },
    { 
        id: 4, 
        name: 'Gói Kim Cương', 
        coins: 1200, // 1000 + 20% (200 coins)
        price: 1000000, 
        bonus: 20,
        icon: <FaGem />, 
        color: '#8b5cf6',
        description: 'Ưu đãi cao nhất, tặng 20% coin & hỗ trợ ưu tiên.'
    },
];

function ProductManagement() {
    const [packages] = useState(initialPackages);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div>
                    <h2>Quản Lý Gói Coin</h2>
                    <p>Cấu hình mệnh giá và tỷ lệ quy đổi (1 Coin = 1,000đ)</p>
                </div>
                <button className={styles.btnAdd}>
                    <FaPlus /> Thêm gói mới
                </button>
            </div>

            <div className={styles.grid}>
                {packages.map((pkg) => (
                    <div key={pkg.id} className={styles.card} style={{ '--brand-color': pkg.color }}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconBox}>{pkg.icon}</div>
                            <div className={styles.actions}>
                                <button className={styles.btnEdit}><FaEdit /></button>
                                <button className={styles.btnDelete}><FaTrash /></button>
                            </div>
                        </div>
                        
                        <div className={styles.cardBody}>
                            <h3 className={styles.packageName}>{pkg.name}</h3>
                            <div className={styles.coinValue}>
                                <FaCoins className={styles.coinIcon} />
                                <span>{pkg.coins} Coins</span>
                            </div>
                            <p className={styles.description}>{pkg.description}</p>
                        </div>

                        <div className={styles.cardFooter}>
                            <div className={styles.priceLabel}>Giá bán:</div>
                            <div className={styles.priceValue}>{formatCurrency(pkg.price)}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.infoNote}>
                <p><b>Lưu ý:</b> Việc thay đổi giá trị gói Coin sẽ ảnh hưởng trực tiếp đến doanh thu và số dư ví của người dùng. Hãy kiểm tra kỹ trước khi cập nhật.</p>
            </div>
        </div>
    );
}

export default ProductManagement;