import { PATHS } from '@/app/routes/paths';

export const getNotificationLink = (notification) => {
    const { type, relatedId } = notification;

    switch (type) {
        // --- REPUTATION & PENALTY ---
        case 'Reputation_Updated':
        case 'Expert_Penalty':
            return PATHS.EXPERT_REPUTATION;

        // --- EVENT LIFECYCLE (Bắt đầu & Kết thúc) ---
        case 'Event_Started':
        case 'Event_Approved':
        case 'Expert_Accepted':
        case 'Expert_Rejected':
            return relatedId ? PATHS.EXPERT_EVENT_DETAIL.replace(':id', relatedId) : PATHS.EXPERT_EVENTS;

        case 'Event_Completed':
            return PATHS.EXPERT_SUMMARY_EVENT.replace(':id', relatedId);

        // --- EVENT INVITATIONS ---
        case 'Event_Invitation':
            return PATHS.EXPERT_INVITATIONS;

        // --- EXPERT REGISTRATION ---
        case 'NewExpertApplication':
            return PATHS.EXPERTS;

        case 'Expert_Application_Approved':
            return PATHS.EXPERT_DASHBOARD;

        case 'Expert_Application_Rejected':
            return PATHS.EXPERT_APPLICATION;

        // --- EVENT PROCESS (Dành cho Creator/Admin) ---
        case 'Event_Rejected':
            return PATHS.EXPERT_EVENTS;

        // --- RATING ---
        case 'Expert_Rated':
            return `/posts/${relatedId}`;

        // --- MẶC ĐỊNH ---
        default:
            return PATHS.USER_FEED;
    }
};
