// src/pages/Dashboard/index.jsx

import React from "react";
import styles from "@/features/Dashboard/styles/Dashboard.module.scss";

// Import các components từ thư mục components
import DashboardHeader from "@/features/Dashboard/components/DashboardHeader";
import StatsGrid from "@/features/Dashboard/components/StatsGrid";
import ChartSection from "@/features/Dashboard/components/ChartSection";
import RevenueTable from "@/features/Dashboard/components/RevenueTable";
import RecentUsers from "@/features/Dashboard/components/RecentUsers";
import ActivityList from "@/features/Dashboard/components/ActivityList";

// Import Hook từ thư mục hooks
import { useDashboardChart } from "@/features/Dashboard/hooks/useDashboardChart";

function Dashboard() {
  // Logic ngày tháng (giữ nguyên như trước)
  const end = new Date().toISOString().split('T')[0];
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const startStr = start.toISOString().split('T')[0];

  // GỌI HOOK: lấy dữ liệu overview cho StatsGrid
  const { chartData } = useDashboardChart(startStr, end);

  return (
    <div className={styles.wrapper}>
      <DashboardHeader />

      {/* Truyền dữ liệu tổng quan vào StatsGrid */}
      <StatsGrid data={chartData?.overview} />

      {/* ChartSection tự fetch dữ liệu riêng cho biểu đồ */}
      <ChartSection />

      <div className={styles.revenueSection}>
        <RevenueTable />
      </div>

      <div className={styles.sectionGrid}>
        <RecentUsers />
        <ActivityList />
      </div>
    </div>
  );
}

export default Dashboard;