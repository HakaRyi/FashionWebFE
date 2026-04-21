import axiosClient from "@/shared/lib/axios";

export const registerApi = async (userData) => {
  const response = await axiosClient.post("/auth/register", userData);
  return response.data;
};

export const verifyOtpApi = async (verifyData) => {
  const response = await axiosClient.post("/auth/verify", verifyData);
  return response.data;
};