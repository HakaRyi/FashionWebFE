//src/features/Dashboard/components/RecentUsers.jsx
import styles from "../styles/Dashboard.module.scss"
import { expertApi } from "../api/dashboardApi";
import { useEffect, useState } from "react";
import UserDetailDialog from "./UserDetailDialog";
function RecentUsers(){

//  const users = [
//   {id:1,name:"Nguyễn Văn A",role:"User",status:"Active",date:"01/02"},
//   {id:2,name:"Trần Thị B",role:"Expert",status:"Active",date:"01/02"},
//   {id:3,name:"Lê Hoàng C",role:"User",status:"Pending",date:"31/01"}
//  ]
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      setLoading(true);
      try {
        const res = await expertApi.getNewUserRecently();
        // Kiểm tra xem res.data có phải là mảng không
        setUsers(res.data || []);
      } catch (error) {
        console.error("Lỗi fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentUsers();
  }, []);

  if (loading) return <div className={styles.panel}>Đang tải...</div>;

 return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3>Người dùng mới</h3>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Vai trò</th>
            <th>Ngày tham gia</th>
            <th>Trạng thái</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id} onClick={() => setSelectedUser(u)} 
                className={styles.clickableRow}   >
                
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Nếu có avatar thì hiện, ko thì hiện chữ cái đầu */}
                    <div className={styles.avatarMini}>
                      {u.avatar ? <img src={u.avatar} alt="" /> : u.username[0].toUpperCase()}
                    </div>
                    <b>{u.username}</b>
                  </div>
                </td>

                <td>{u.role}</td>

                <td>
                  {/* Format lại ngày tháng cho đẹp */}
                  {new Date(u.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </td>

                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      u.status === "Active" ? styles.statusActive : styles.statusPending
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                Chưa có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {selectedUser && (
        <UserDetailDialog 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
}

export default RecentUsers