import styles from "../styles/Expert.module.scss";
import { FaIdCard } from "react-icons/fa";

function ExpertRow({expert,onView}) {

  return (

    <tr>

      <td>
        {expert.account?.userName}
      </td>

      <td>
        {expert.expertiseField}
      </td>

      <td>
        {new Date(expert.createdAt)
          .toLocaleDateString("vi-VN")}
      </td>

      <td>
        {expert.expertFile?.status}
      </td>

      <td>

        <button
          onClick={()=>onView(expert)}
        >
          <FaIdCard/> Chi tiết
        </button>

      </td>

    </tr>

  )

}

export default ExpertRow