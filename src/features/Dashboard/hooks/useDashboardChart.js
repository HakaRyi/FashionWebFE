import { useEffect,useState } from "react"

export default function useDashboardChart(activeTab,timeRange,startDate,endDate){

 const [chartData,setChartData] = useState([])

 useEffect(()=>{

  let days = 7

  if(timeRange==="month") days=30

  const baseValue =
    activeTab==="users"?1000:
    activeTab==="experts"?50:
    activeTab==="posts"?300:4000

  const data=[]

  for(let i=1;i<=days;i++){

    data.push({
      name:`Day ${i}`,
      value:Math.floor(baseValue + Math.random()*baseValue/2)
    })

  }

  setChartData(data)

 },[activeTab,timeRange,startDate,endDate])


 return chartData
}