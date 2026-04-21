import axiosClient from "@/shared/lib/axios";

export const loginApi = async (email, password) => {
  const response = await axiosClient.post("/auth/login", {
    email,
    password
  });

  return response.data;
};

export const googleLoginApi = async (idToken) => {
  const response = await axiosClient.post("/auth/google-login", {
    idToken: idToken
  });
  return response.data;
};