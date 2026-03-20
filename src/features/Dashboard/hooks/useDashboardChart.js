//src/features/Dashboard/hooks/useDashboardChart.js
import { useEffect,useState } from "react"
import { expertApi } from "../api/dashboardApi";
export default function useDashboardChart(activeTab,timeRange,startDate,endDate){

 const [chartData,setChartData] = useState([])
 const [overview, setOverview] = useState(null);
 const [loading, setLoading] = useState(false);

 useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Gửi params startDate, endDate lên Server
        const res = await expertApi.getDashboardStatic({ 
          StartDate: startDate, 
          EndDate: endDate 
        });
        
        if (res.data) {
          setOverview(res.data.overview);
          setChartData(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [startDate, endDate]); // Chỉ gọi lại khi thay đổi ngày

  return { chartData, overview, loading };
}