export function formatCurrency(value){
 return new Intl.NumberFormat("vi-VN",{
  style:"currency",
  currency:"VND"
 }).format(value)
}

export function calculateRevenue(transactions){

 return transactions.reduce((total,trans)=>{

  const number = parseInt(
   trans.amount.replace(/\./g,"").replace("đ","")
  )

  return total + number

 },0)

}