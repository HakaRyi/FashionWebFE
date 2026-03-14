import React from "react";
import styles from "@/features/Dashboard/styles/Dashboard.module.scss";

import {
  DashboardHeader,
  StatsGrid,
  ChartSection,
  CoinPackages,
  RevenueTable,
  RecentUsers,
  ActivityList
} from "@/features/Dashboard";

function Dashboard() {
  return (
    <div className={styles.wrapper}>
      <DashboardHeader />

      <StatsGrid />

      <ChartSection />

      <div className={styles.coinSection}>
        <CoinPackages />
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