import axiosClient from "@/shared/lib/axios";

export const createEventApi = async (eventData) => {
  const formData = new FormData();

  // 1. Các trường đơn giản (giữ nguyên nhưng đảm bảo kiểu dữ liệu)
  formData.append("Title", eventData.title);
  formData.append("Description", eventData.description || "");
  formData.append("StartTime", eventData.startDate); 
  formData.append("EndTime", eventData.endDate);

  // Ép kiểu số thực rõ ràng
  formData.append("ExpertWeight", parseFloat(eventData.expertWeight / 100));
  formData.append("UserWeight", parseFloat((100 - eventData.expertWeight) / 100));
  formData.append("PointPerLike", 1.0);
  formData.append("PointPerShare", 2.0);

  // Validation Range(2, 20)
  const minReq = parseInt(eventData.minExpertsRequired) || 2;
  formData.append("MinExpertsRequired", minReq);

  // 2. Xử lý File
  if (eventData.imageFile) {
    formData.append("ImageFile", eventData.imageFile);
  }

  // 3. Xử lý Prizes (Đây là phần hay gây lỗi 400 nhất)
  if (eventData.prizes && eventData.prizes.length > 0) {
    eventData.prizes.forEach((p, index) => {
      // Cấu trúc: TenList[index].TenThuocTinh
      formData.append(`Prizes[${index}].Ranked`, parseInt(index + 1));
      formData.append(`Prizes[${index}].RewardAmount`, parseFloat(p.amount));
    });
  }

  // 4. Xử lý InvitedExpertIds
  if (eventData.invitedExpertIds && eventData.invitedExpertIds.length > 0) {
    eventData.invitedExpertIds.forEach((id) => {
      // Gửi nhiều field cùng tên "InvitedExpertIds" để .NET tự map vào List<int>
      formData.append("InvitedExpertIds", id);
    });
  }

  const res = await axiosClient.post("/events/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};