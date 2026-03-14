import ExpertRow from "./ExpertRow";
import styles from "../styles/Expert.module.scss";

function ExpertTable({experts,onView}) {

  if(!experts.length){

    return <div className={styles.empty}>
      Không có dữ liệu
    </div>

  }

  return (

    <table className={styles.table}>

      <thead>

        <tr>
          <th>Chuyên gia</th>
          <th>Chuyên môn</th>
          <th>Ngày đăng ký</th>
          <th>Trạng thái</th>
          <th></th>
        </tr>

      </thead>

      <tbody>

        {experts.map(exp=>(
          <ExpertRow
            key={exp.expertProfileId}
            expert={exp}
            onView={onView}
          />
        ))}

      </tbody>

    </table>

  )

}

export default ExpertTable