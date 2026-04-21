import React from "react";
import { CheckCircle, Clock, XCircle, HelpCircle } from "lucide-react";

export const EXPERT_STATUS_CONFIG = {
    Accepted: {
        label: "Accepted",
        variant: "accepted",
        icon: <CheckCircle size={12} />
    },
    Pending: {
        label: "Waiting for a response.",
        variant: "pending",
        icon: <Clock size={12} />
    },
    Rejected: {
        label: "Rejected",
        variant: "rejected",
        icon: <XCircle size={12} />
    }
};

/**
 * Hàm Helper lấy thông tin hiển thị của Expert
 */
export const getExpertStatusInfo = (status) => {
    return EXPERT_STATUS_CONFIG[status] || {
        label: status || "Unknown",
        variant: "default",
        icon: <HelpCircle size={12} />
    };
};