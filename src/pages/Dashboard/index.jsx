import React from "react";
import styles from "@/features/Dashboard/styles/Dashboard.module.scss";
import {
  DashboardHeader,
  StatsGrid,
  ChartSection,
  RevenueTable,
  RecentUsers,
  ActivityList,
  useDashboardChart
} from "@/features/dashboard";

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