import { useEffect, useState } from "react";
import { expertApi } from "../api/dashboardApi";

export function useDashboardChart(startDate, endDate) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      !startDate ||
      !endDate ||
      startDate.includes("revenue") ||
      startDate.includes("users")
    ) {
      console.warn("The hook was blocked due to invalid parameters.");
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);

      try {
        const res = await expertApi.getDashboardStatic({
          StartDate: startDate,
          EndDate: endDate,
        });

        setChartData(res.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [startDate, endDate]);

  return { chartData, loading };
}