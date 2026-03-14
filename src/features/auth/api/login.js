import axiosClient from "@/shared/lib/axios";

export const loginApi = async (email, password) => {
  const response = await axiosClient.post("/auth/login", {
    email,
    password
  });

  return response.data;
};