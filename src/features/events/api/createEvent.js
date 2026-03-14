import axiosClient from "@/shared/lib/axios";

export const createEvent = async (eventData) => {

  const formData = new FormData();

  formData.append("title", eventData.title);
  formData.append("description", eventData.description);
  formData.append("startDate", eventData.startDate.toISOString());
  formData.append("endDate", eventData.endDate.toISOString());
  formData.append("expertWeight", eventData.expertWeight);

  formData.append("hashtags", JSON.stringify(eventData.hashtags));
  formData.append("prizes", JSON.stringify(eventData.prizes));

  if (eventData.imageFile) {
    formData.append("image", eventData.imageFile);
  }

  const res = await axiosClient.post("/events", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data;
};