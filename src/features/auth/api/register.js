import axiosClient from "@/shared/lib/axios";

export const registerApi = async (userData) => {
  const response = await axiosClient.post("/auth/register", userData);
  return response.data;
};