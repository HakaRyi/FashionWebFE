import axiosClient from "@/shared/lib/axios";

export const getMyWallet = async () => {
  const res = await axiosClient.get("/wallet");
  return res.data;
};