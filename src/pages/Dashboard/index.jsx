// src/pages/Dashboard/index.jsx

import React from "react";
import styles from "@/features/Dashboard/styles/Dashboard.module.scss";

import DashboardHeader from "@/features/Dashboard/components/DashboardHeader";
import StatsGrid from "@/features/Dashboard/components/StatsGrid";
import ChartSection from "@/features/Dashboard/components/ChartSection";
import RevenueTable from "@/features/Dashboard/components/RevenueTable";
import RecentUsers from "@/features/Dashboard/components/RecentUsers";
import ActivityList from "@/features/Dashboard/components/ActivityList";
import { useDashboardChart } from "@/features/Dashboard/hooks/useDashboardChart";

function Dashboard() {
  const end = new Date().toISOString().split("T")[0];

  const start = new Date();
  start.setDate(start.getDate() - 30);
  const startStr = start.toISOString().split("T")[0];

  const { chartData } = useDashboardChart(startStr, end);

  return (
    <div className={styles.wrapper}>
      <DashboardHeader />

      <StatsGrid data={chartData?.overview} />

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