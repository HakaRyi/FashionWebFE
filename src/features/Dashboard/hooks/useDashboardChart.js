import { useEffect, useState } from "react";
import { expertApi } from "../api/dashboardApi";

export function useDashboardChart(startDate, endDate) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
    if (!startDate || !endDate || startDate.includes("revenue") || startDate.includes("users")) {
      console.warn("Hook bị chặn do params chưa hợp lệ");
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      console.log("Đang gọi API với:", { StartDate: startDate, EndDate: endDate });
      try {
        const res = await expertApi.getDashboardStatic({
          StartDate: startDate,
          EndDate: endDate,
        });
        console.log("Kết quả API trả về:", res.data);
        setChartData(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [startDate, endDate]);

  return { chartData, loading };
}