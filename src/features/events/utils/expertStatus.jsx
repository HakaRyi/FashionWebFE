import React from "react";
import { CheckCircle, Clock, XCircle, HelpCircle } from "lucide-react";

export const EXPERT_STATUS_CONFIG = {
    Accepted: {
        label: "Đã chấp nhận",
        variant: "accepted", // Tương ứng với class trong SCSS
        icon: <CheckCircle size={12} />
    },
    Pending: {
        label: "Đang chờ phản hồi",
        variant: "pending",
        icon: <Clock size={12} />
    },
    Rejected: {
        label: "Đã từ chối",
        variant: "rejected",
        icon: <XCircle size={12} />
    }
};

/**
 * Hàm Helper lấy thông tin hiển thị của Expert
 */
export const getExpertStatusInfo = (status) => {
    return EXPERT_STATUS_CONFIG[status] || {
        label: status || "Không xác định",
        variant: "default",
        icon: <HelpCircle size={12} />
    };
};