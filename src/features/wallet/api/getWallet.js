import axiosClient from "@/shared/lib/axios";

export const getMyWallet = async () => {
  const res = await axiosClient.get("/wallets/me");
  return res.data;
};

export const getWalletDashboard = async () => {
  const res = await axiosClient.get("/wallets/dashboard");
  return res.data;
};