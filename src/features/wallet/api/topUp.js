import axiosClient from "@/shared/lib/axios";

export const topUp = async (amount, provider = "VNPAY") => {
  const request = {
    amount: Number(amount),
    provider: provider,
    orderCode: `TOPUP_${Date.now()}`
  };

  const res = await axiosClient.post("/wallets/top-up", request);
  return res.data;
};