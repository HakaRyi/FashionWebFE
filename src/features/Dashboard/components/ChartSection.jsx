import { useState } from "react";
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

  const [startDate,setStartDate] = useState("")
  const [endDate,setEndDate] = useState("")
  const [activeTab,setActiveTab] = useState("users")
  const [timeRange,setTimeRange] = useState("week")

  const chartData = useDashboardChart(activeTab,timeRange,startDate,endDate)

  const getColor = () => {

    if(activeTab==="users") return "#4f46e5"
    if(activeTab==="experts") return "#10b981"
    if(activeTab==="posts") return "#f59e0b"
    return "#ef4444"

  }

  const tabs = [
    {type:"users",label:"Users"},
    {type:"experts",label:"Experts"},
    {type:"posts",label:"Posts"},
    {type:"items",label:"Items"}
  ]

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

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart data={chartData}>

            <XAxis dataKey="name" />
            <YAxis />

            <CartesianGrid strokeDasharray="3 3"/>

            <Tooltip/>

            <Area
              type="monotone"
              dataKey="value"
              stroke={getColor()}
              fill={getColor()}
              fillOpacity={0.2}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  )
}

export default ChartSection