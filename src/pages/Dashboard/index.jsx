import React from "react";
import styles from "@/features/Dashboard/styles/Dashboard.module.scss";
import useDashboardChart from "@/features/Dashboard/hooks/useDashboardChart";
import {
  DashboardHeader,
  StatsGrid,
  ChartSection,
  RevenueTable,
  RecentUsers,
  ActivityList
} from "@/features/Dashboard";

function Dashboard() {
  const { overview } = useDashboardChart("revenue", "week", "", "");
  return (
    <div className={styles.wrapper}>
      <DashboardHeader />

      <StatsGrid data={overview}/>

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