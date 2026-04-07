import axiosClient from "@/shared/lib/axios";

export const topUp = async (amount, provider = "VNPAY") => {
  const request = {
    amount: Number(amount),
    source: "WEB",
  };

  const res = await axiosClient.post("/payment/topup/vnpay", request);
  return res.data;
};