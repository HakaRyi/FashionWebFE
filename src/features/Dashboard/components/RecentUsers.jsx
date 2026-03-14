import styles from "../styles/Dashboard.module.scss"

function RecentUsers(){

 const users = [
  {id:1,name:"Nguyễn Văn A",role:"User",status:"Active",date:"01/02"},
  {id:2,name:"Trần Thị B",role:"Expert",status:"Active",date:"01/02"},
  {id:3,name:"Lê Hoàng C",role:"User",status:"Pending",date:"31/01"}
 ]

 return(

  <div className={styles.panel}>

   <div className={styles.panelHeader}>
    <h3>Người dùng mới</h3>
   </div>

   <table className={styles.table}>

    <thead>
     <tr>
      <th>Tên</th>
      <th>Vai trò</th>
      <th>Ngày</th>
      <th>Trạng thái</th>
     </tr>
    </thead>

    <tbody>

     {users.map(u=>(
      <tr key={u.id}>

       <td><b>{u.name}</b></td>

       <td>{u.role}</td>

       <td>{u.date}</td>

       <td>
        <span className={styles.statusBadge}>
         {u.status}
        </span>
       </td>

      </tr>
     ))}

    </tbody>

   </table>

  </div>

 )

}

export default RecentUsers