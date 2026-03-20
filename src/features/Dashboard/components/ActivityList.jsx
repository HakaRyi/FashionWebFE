// src/feature/Dashboard/components/ActivityList.jsx
import { useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.scss";
import { expertApi } from "../api/dashboardApi";
import { FaChevronLeft, FaChevronRight, FaCircleInfo } from "react-icons/fa6";

function ActivityList() {
  const [data, setData] = useState({ items: [], totalCount: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const res = await expertApi.getAdminNotifications({ pageIndex: page, pageSize });
        setData(res.data);
      } catch (error) {
        console.error("Lỗi fetch activities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [page]);

  // Hàm tính thời gian tương đối (X phút trước)
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " giờ trước";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " phút trước";
    return "Vừa xong";
  };

  const totalPages = Math.ceil(data.totalCount / pageSize);

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3>Hoạt động gần đây</h3>
      </div>

      <div className={styles.activityList}>
        {loading ? (
          <p>Đang tải...</p>
        ) : data.items.length > 0 ? (
          data.items.map((item) => (
            <div key={item.notificationId} className={styles.activityItem}>
              {/* Chấm màu thay đổi theo loại thông báo */}
              <div 
                className={styles.activityDot} 
                style={{ backgroundColor: item.title === "Top up" ? "#10b981" : "#4f46e5" }}
              />
              <div>
                <div>
                  <b style={{color: 'var(--primary-color)'}}>@{item.senderName}</b> {item.title}: {item.content}
                </div>
                <div className={styles.activityTime}>{timeAgo(item.createdAt)}</div>
              </div>
            </div>
          ))
        ) : (
          <div style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>
            <FaCircleInfo /> <br/> Không có thông báo nào gần đây.
          </div>
        )}
      </div>

      {/* Bộ nút phân trang nhỏ gọn */}
      {totalPages > 1 && (
        <div className={styles.paginationSmall}>
          <button 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
            className={styles.pageBtn}
          >
            <FaChevronLeft size={12}/>
          </button>
          <span>Trang {page} / {totalPages}</span>
          <button 
            disabled={page === totalPages} 
            onClick={() => setPage(p => p + 1)}
            className={styles.pageBtn}
          >
            <FaChevronRight size={12}/>
          </button>
        </div>
      )}
    </div>
  );
}

export default ActivityList;