import { useState, useEffect } from "react";
import { expertApi } from "../api/expertApi";

export default function useExperts() {

  const [experts,setExperts] = useState([])
  const [loading,setLoading] = useState(false)

  const fetchExperts = async () => {

    setLoading(true)

    try {

      const res = await expertApi.getAllExperts()

      const actualData = res.data || res

      const finalArray =
        actualData?.$values ||
        (Array.isArray(actualData) ? actualData : [])

      setExperts(finalArray)

    } catch (err) {

      console.error("Fetch experts error",err)

    } finally {

      setLoading(false)

    }

  }

  useEffect(()=>{

    fetchExperts()

  },[])

  return {
    experts,
    loading,
    fetchExperts
  }

}