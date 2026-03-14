export const filterExperts = (
  experts,
  searchTerm,
  statusFilter,
  sortOrder
) => {

  return experts
    .filter(exp => {

      const userName = exp.account?.userName || ""
      const expertise = exp.expertiseField || ""

      const matchesSearch =
        userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expertise.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === "All" ||
        exp.expertFile?.status === statusFilter

      return matchesSearch && matchesStatus

    })
    .sort((a,b)=>{

      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)

      return sortOrder==="newest"
        ? dateB - dateA
        : dateA - dateB

    })

}