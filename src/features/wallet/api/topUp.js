import axiosClient from "@/shared/lib/axios";

export const topUp = async (amount, provider = "VNPAY") => {
  const request = {
    amount,
    provider,
    orderCode: `TOPUP_${Date.now()}`
  };

  const res = await axiosClient.post("/wallet/topup", request);
  return res.data;
};