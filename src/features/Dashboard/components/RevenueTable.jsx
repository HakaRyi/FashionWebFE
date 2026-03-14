import { useState } from "react"
import styles from "../styles/Dashboard.module.scss"
import { FaCoins } from "react-icons/fa6"
import { formatCurrency,calculateRevenue } from "../utils/dashboardUtils"

function RevenueTable(){

 const [revenueMonth,setRevenueMonth] = useState("2026-02")

 const transactions = [
  {id:1,user:"Nguyễn Văn A",amount:"500.000đ",date:"02/02/2026"},
  {id:2,user:"Trần Thị B",amount:"50.000đ",date:"02/02/2026"},
  {id:3,user:"Phạm Minh C",amount:"200.000đ",date:"01/02/2026"}
 ]

 return(

  <div className={styles.panel}>

   <div className={styles.panelHeader}>

    <h3>
     <FaCoins/> Doanh Thu Coin
    </h3>

    <input
     type="month"
     value={revenueMonth}
     onChange={(e)=>setRevenueMonth(e.target.value)}
     className={styles.dateInput}
    />

   </div>

   <table className={styles.table}>

    <thead>
     <tr>
      <th>Khách hàng</th>
      <th>Ngày</th>
      <th style={{textAlign:"right"}}>Thành tiền</th>
     </tr>
    </thead>

    <tbody>

     {transactions.map(t=>(
      <tr key={t.id}>
       <td>{t.user}</td>
       <td>{t.date}</td>
       <td style={{textAlign:"right"}}>{t.amount}</td>
      </tr>
     ))}

    </tbody>

   </table>

   <div className={styles.panelFooter}>

    <span>Tổng doanh thu:</span>

    <span>
     {formatCurrency(calculateRevenue(transactions))}
    </span>

   </div>

  </div>

 )

}

export default RevenueTable