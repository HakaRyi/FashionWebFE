import { useState } from "react";
import styles from "../styles/Dashboard.module.scss";
import { FaUsers, FaUserTie, FaNewspaper, FaShirt } from "react-icons/fa6";

function StatsGrid() {

  const [activeTab,setActiveTab] = useState("users")

  const stats = [
    {
      id: 1,
      title: "Tổng Người Dùng",
      value: "12,543",
      type: "users",
      icon: <FaUsers />,
      trend: "+12%",
      isUp: true,
      color: "#4f46e5"
    },
    {
      id: 2,
      title: "Tổng Chuyên Gia",
      value: "85",
      type: "experts",
      icon: <FaUserTie />,
      trend: "+4%",
      isUp: true,
      color: "#10b981"
    },
    {
      id: 3,
      title: "Tổng Bài Viết",
      value: "3,420",
      type: "posts",
      icon: <FaNewspaper />,
      trend: "+24%",
      isUp: true,
      color: "#f59e0b"
    },
    {
      id: 4,
      title: "Tổng Món Đồ",
      value: "45,210",
      type: "items",
      icon: <FaShirt />,
      trend: "-2%",
      isUp: false,
      color: "#ef4444"
    }
  ]

  return (
    <div className={styles.statsGrid}>
      {stats.map(stat => (
        <div
          key={stat.id}
          className={`${styles.statCard} ${styles[stat.type]}`}
          onClick={()=>setActiveTab(stat.type)}
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