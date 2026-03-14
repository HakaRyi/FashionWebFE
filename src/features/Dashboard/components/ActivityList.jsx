import styles from "../styles/Dashboard.module.scss"

function ActivityList(){

 const activities = [1,2,3,4]

 return(

  <div className={styles.panel}>

   <div className={styles.panelHeader}>
    <h3>Hoạt động gần đây</h3>
   </div>

   <div className={styles.activityList}>

    {activities.map(i=>(
     
     <div key={i} className={styles.activityItem}>

      <div className={styles.activityDot}/>

      <div>

       <b>User #{1000+i}</b> đăng bài viết mới

       <div className={styles.activityTime}>
        2 phút trước
       </div>

      </div>

     </div>

    ))}

   </div>

  </div>

 )

}

export default ActivityList