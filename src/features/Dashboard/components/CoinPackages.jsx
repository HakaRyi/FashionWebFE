//src/features/Dashboard/components/CoinPackages.jsx
import styles from "../styles/Dashboard.module.scss"
import { FaCrown } from "react-icons/fa6"

function CoinPackages(){

 const coinPackages = [
  { id:1,name:"Gói Cơ Bản",sales:120,color:"#3b82f6"},
  { id:2,name:"Gói Nâng Cao",sales:85,color:"#10b981"},
  { id:3,name:"Gói VIP",sales:45,color:"#f59e0b"},
  { id:4,name:"Gói Kim Cương",sales:20,color:"#8b5cf6"}
 ]

 return(

  <div className={styles.panel}>

   <div className={styles.panelHeader}>
    <h3>
     <FaCrown/> Top Gói Coin
    </h3>
   </div>

   <div className={styles.packageList}>

    {coinPackages.map(pkg=>(
     
     <div key={pkg.id} className={styles.packageItem}>

      <div className={styles.packageInfo}>
       <span style={{color:pkg.color,fontWeight:"bold"}}>
        {pkg.name}
       </span>

       <span>{pkg.sales} lượt mua</span>
      </div>

      <div className={styles.progressBarBg}>

       <div
        className={styles.progressBarFill}
        style={{
         width:`${(pkg.sales/150)*100}%`,
         backgroundColor:pkg.color
        }}
       />

      </div>

     </div>

    ))}

   </div>

  </div>

 )

}

export default CoinPackages