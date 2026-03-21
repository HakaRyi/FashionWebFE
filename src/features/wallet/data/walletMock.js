import { Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export const walletTransactions = [
  {
    id: "#TX1024",
    type: "deposit",
    amount: 5000,
    date: "2024-03-08",
    status: "Completed",
    detail: "Nạp tiền qua VNPay",
  },
  {
    id: "#TX1025",
    type: "expense",
    amount: 1500,
    date: "2024-03-05",
    status: "Completed",
    detail: "Trả thưởng: Spring Fashion Event",
  },
  {
    id: "#TX1026",
    type: "expense",
    amount: 300,
    date: "2024-03-02",
    status: "Pending",
    detail: "Phí tổ chức Workshop",
  },
];

export const walletStats = [
  {
    label: "Số dư hiện tại",
    value: "12,500",
    icon: Wallet,
    sub: "Coins khả dụng",
  },
  {
    label: "Tổng nạp",
    value: "45,000",
    icon: ArrowUpRight,
    sub: "Tích lũy",
  },
  {
    label: "Đã chi thưởng",
    value: "32,500",
    icon: ArrowDownLeft,
    sub: "Tổng 12 sự kiện",
  },
];