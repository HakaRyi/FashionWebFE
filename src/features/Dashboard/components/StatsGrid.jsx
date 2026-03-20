//src/features/Dashboard/components/StatsGrid.jsx
import {  } from "react";
import styles from "../styles/Dashboard.module.scss";
import { FaUsers, FaUserTie, FaNewspaper, FaShirt,FaMoneyBillTrendUp } from "react-icons/fa6";

function StatsGrid({ data }) {
  if (!data) return <div className={styles.statsGrid}>Đang tải...</div>;
  //const [setActiveTab] = useState("users")

  const stats = [
    {
    id: 1, // Thêm ô doanh thu lên đầu hoặc tùy vị trí bạn muốn
    title: "Tổng Doanh Thu",
    value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.totalRevenue), // Sau này map từ api /admin/dashboard-information
    type: "revenue",
    icon: <FaMoneyBillTrendUp />,
    trend: "+15%",
    isUp: true,
    color: "#10b981"
  },  
    {
      id: 2,
      title: "Tổng Người Dùng",
      value: data.totalUsers.toLocaleString(),
      type: "users",
      icon: <FaUsers />,
      trend: "+12%",
      isUp: true,
      color: "#4f46e5"
    },
    {
      id: 3,
      title: "Tổng Chuyên Gia",
      value: data.totalExperts.toLocaleString(),
      type: "experts",
      icon: <FaUserTie />,
      trend: "+4%",
      isUp: true,
      color: "#ef4444"
    },
    {
      id: 4,
      title: "Tổng Bài Viết",
      value: data.totalPosts.toLocaleString(),
      type: "posts",
      icon: <FaNewspaper />,
      trend: "+24%",
      isUp: true,
      color: "#f59e0b"
    },
    // {
    //   id: 5,
    //   title: "Tổng Món Đồ",
    //   value: "45,210",
    //   type: "items",
    //   icon: <FaShirt />,
    //   trend: "-2%",
    //   isUp: false,
    //   color: "#ef4444"
    // }
  ]

  return (
    <div className={styles.statsGrid}>
      {stats.map(stat => (
        <div
          key={stat.id}
          className={`${styles.statCard} ${styles[stat.type]}`}
          //onClick={()=>setActiveTab(stat.type)}
        >
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>{stat.title}</span>
            <div className={styles.statIcon}>{stat.icon}</div>
          </div>

          <div className={styles.statValue}>{stat.value}</div>

          <div className={styles.statTrend}>
            <span className={stat.isUp ? styles.trendUp : styles.trendDown}>
              {stat.isUp ? "↑" : "↓"} {stat.trend}
            </span>
          </div>

        </div>
      ))}
    </div>
  )
}

export default StatsGrid