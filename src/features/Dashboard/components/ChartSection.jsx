import { useState, useMemo } from "react";
import styles from "../styles/Dashboard.module.scss";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,

} from "recharts";

import { useDashboardChart } from "../hooks/useDashboardChart";

function ChartSection() {
  const [activeTab, setActiveTab] = useState("revenue");
  const [timeRange, setTimeRange] = useState("week");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { finalStart, finalEnd } = useMemo(() => {
    if (timeRange === "custom") return { finalStart: startDate, finalEnd: endDate };
    
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - (timeRange === "week" ? 7 : 30));
    
    return { 
      finalStart: start.toISOString().split('T')[0], 
      finalEnd: end.toISOString().split('T')[0] 
    };
  }, [timeRange, startDate, endDate]);
  
  const { chartData: allCharts, loading } = useDashboardChart(finalStart, finalEnd);

  const displayData = useMemo(() => {
    if (!allCharts) return [];

    let rawData = [];
    switch (activeTab) {
      case "revenue": rawData = allCharts.revenueChart || []; break;
      case "users": rawData = allCharts.userChart || []; break;
      case "experts": rawData = allCharts.expertChart || []; break;
      case "posts": rawData = allCharts.postChart || []; break;
      default: rawData = [];
    }

    // FIX LỖI SORT THỜI GIAN NGAY TẠI ĐÂY
    return [...rawData].sort((a, b) => {
      if (!a.name || !b.name) return 0;
      // Cắt chuỗi "dd/MM" ra
      const [dayA, monthA] = a.name.split("/");
      const [dayB, monthB] = b.name.split("/");
      
      // Tạo Date giả định (dùng năm hiện tại) để so sánh
      const dateA = new Date(new Date().getFullYear(), monthA - 1, dayA);
      const dateB = new Date(new Date().getFullYear(), monthB - 1, dayB);
      
      return dateA - dateB;
    });
  }, [activeTab, allCharts]);

  const getColor = () => {
    if (activeTab === "revenue") return "#10b981";
    if (activeTab === "users") return "#4f46e5";
    if (activeTab === "experts") return "#10b981";
    if (activeTab === "posts") return "#f59e0b";
    return "#ef4444";
  };

  const tabs = [
    { type: "revenue", label: "Revenue" },
    { type: "users", label: "Users" },
    { type: "experts", label: "Experts" },
    { type: "posts", label: "Posts" },
  ];

  return (
    <div className={styles.chartSection}>
      <div className={styles.chartHeader}>
        <div className={styles.tabGroup}>
          {tabs.map(tab => (
            <button
              key={tab.type}
              className={`${styles.tabButton} ${activeTab === tab.type ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab.type)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.filterGroup}>
          <select
            className={styles.filterSelect}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">7 days</option>
            <option value="month">Month</option>
            <option value="custom">Custom</option>
          </select>

          {timeRange === "custom" && (
            <>
              <input
                type="date"
                className={styles.dateInput}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className={styles.dateInput}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </>
          )}
        </div>
      </div>

      <div className={styles.chartContainer}>
        {loading ? (
          <div className={styles.loadingOverlay}>Loading data...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={displayData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }} // Đẩy chart sát viền cho đẹp
            >
              {/* Định nghĩa dải màu Gradient đổ bóng cho biểu đồ */}
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getColor()} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={getColor()} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <XAxis 
                dataKey="name" 
                axisLine={false} // Tắt đường kẻ trục X
                tickLine={false} // Tắt nét đứt trục X
                tick={{ fill: '#9ca3af', fontSize: 12 }} 
                dy={10} 
              />
              
              <YAxis 
                axisLine={false} // Tắt đường kẻ trục Y
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                dx={-10}
              />

              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} // Chỉ giữ lại đường kẻ ngang cho thoáng
                stroke="#f3f4f6" 
              />

              <Tooltip
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                }}
                formatter={(value) =>
                  activeTab === 'revenue'
                    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
                    : value
                }
              />

              <Area
                type="monotone" // Hiệu ứng cong mượt
                dataKey="value"
                stroke={getColor()}
                strokeWidth={3} // Làm đường biểu đồ đậm và rõ hơn
                fill="url(#colorGradient)" // Sử dụng gradient đã tạo ở trên
                animationDuration={1500} // Thời gian animation chạy (1.5 giây)
                animationEasing="ease-in-out" // Hiệu ứng lúc bắt đầu và kết thúc
                activeDot={{ r: 6, strokeWidth: 0, fill: getColor() }} // Chấm tròn bự hơn khi hover
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default ChartSection;