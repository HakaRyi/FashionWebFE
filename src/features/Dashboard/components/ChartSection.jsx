//src/features/Dashboard/components/ChartSection.jsx
import { useState,useMemo } from "react";
import styles from "../styles/Dashboard.module.scss";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import useDashboardChart from "../hooks/useDashboardChart";

function ChartSection() {

  const [activeTab,setActiveTab] = useState("users")
  const [timeRange,setTimeRange] = useState("week")
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
  
  const {chartData: allCharts, loading} = useDashboardChart(activeTab,timeRange,finalStart,finalEnd)

  const displayData = useMemo(() => {
    if (!allCharts) return [];

    switch (activeTab) {
      case "revenue": return allCharts.revenueChart || [];
      case "users": return allCharts.userChart || [];     
      case "experts": return allCharts.expertChart || []; 
      case "posts": return allCharts.postChart || [];     
      default: return [];
    }
  }, [activeTab, allCharts]);
  const getColor = () => {
    if (activeTab === "revenue") return "#10b981";
    if(activeTab==="users") return "#4f46e5"
    if(activeTab==="experts") return "#10b981"
    if(activeTab==="posts") return "#f59e0b"
    return "#ef4444"

  }

  const tabs = [
    {type: "revenue", label: "Revenue" },
    {type:"users",label:"Users"},
    {type:"experts",label:"Experts"},
    {type:"posts",label:"Posts"},
    // {type:"items",label:"Items"}
  ]
  console.log("Dữ liệu đang hiển thị:", displayData);
  return (
    <div className={styles.chartSection}>

      <div className={styles.chartHeader}>

        <div className={styles.tabGroup}>
          {tabs.map(tab=>(
            <button
              key={tab.type}
              className={`${styles.tabButton} ${activeTab===tab.type?styles.tabActive:""}`}
              onClick={()=>setActiveTab(tab.type)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.filterGroup}>

          <select
            className={styles.filterSelect}
            value={timeRange}
            onChange={(e)=>setTimeRange(e.target.value)}
          >
            <option value="week">7 ngày</option>
            <option value="month">Tháng</option>
            <option value="custom">Tuỳ chọn</option>
          </select>

          {timeRange==="custom" && (
            <>
              <input
                type="date"
                className={styles.dateInput}
                value={startDate}
                onChange={(e)=>setStartDate(e.target.value)}
              />

              <input
                type="date"
                className={styles.dateInput}
                value={endDate}
                onChange={(e)=>setEndDate(e.target.value)}
              />
            </>
          )}

        </div>

      </div>

      <div className={styles.chartContainer}>
      {loading ? (
                <div className={styles.loadingOverlay}>Đang tải dữ liệu...</div>
              ) : (
        <ResponsiveContainer width="100%" height="100%">

          <AreaChart data={displayData}>

            <XAxis dataKey="name" />
            <YAxis />

            <CartesianGrid strokeDasharray="3 3"/>

            <Tooltip
              formatter={(value) => 
                   activeTab === 'revenue' 
                   ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
                   : value
                }
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={getColor()}
              fill={getColor()}
              fillOpacity={0.2}
            />

          </AreaChart>

        </ResponsiveContainer>
       )}
      </div>

    </div>
  )
}

export default ChartSection