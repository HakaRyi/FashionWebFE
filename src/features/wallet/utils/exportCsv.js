export const exportToCsv = (data, fileName) => {
  const headers = ["Transaction Code, Details, Date, Quantity, Type, Status"];
  const rows = data.map(tx => 
    `${tx.id},${tx.detail},${tx.date},${tx.amount},${tx.type},${tx.status}`
  );
  
  const blob = new Blob([[...headers, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.csv`;
  link.click();
};