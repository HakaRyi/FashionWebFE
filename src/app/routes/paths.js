export const PATHS = {
    //guest
    HOME: '/',
    LOGIN: '/login',
    UNAUTHORIZED: '/unauthorized',
    
    //user
    ONBOARDING: '/onboarding',
    USER_FEED: '/home',
    PAYMENT_RESULT: '/payment-result',
    USER_POLICY: '/policy',
    SEARCH_RESULTS: '/search',
    POST_DETAIL: '/post/:id',
    USER_EVENTS: '/events',
    EVENT_DETAIL: '/events/:id',
    EVENT_SUMMARY: '/summary-event/:id',
    EVENT_SUMMARY_FULL_ARCHIVE: '/summary-event/:id/full-archive',

    //expert
    EXPERT_APPLICATION: '/expert/registration',
    EXPERT_DASHBOARD: '/expert/dashboard',
    EXPERT_PROFILE: '/expert/profile/:id',
    EXPERT_PAYMENT: '/expert/posts',
    EXPERT_CREATE_EVENTS: '/expert/create-events',
    EXPERT_EVENTS: '/expert/events',
    EXPERT_WALLET: '/expert/wallet',
    EXPERT_SUBMISSION_REVIEW: '/expert/events/:eventId/submissions',
    EXPERT_EVENT_DETAIL: '/expert/events/:id',
    EXPERT_INVITATIONS: '/expert/invitation',
    EXPERT_SUMMARY_EVENT: '/expert/summary-event/:id',
    EXPERT_REPUTATION: '/expert/reputation',
    EXPERT_FINANCIAL: '/expert/financial',
    EXPERT_FINANCIAL_EVENT: '/expert/financial/event/:eventId',

    //admin
    DASHBOARD: '/dashboard',
    USERS: '/users',
    EXPERTS: '/experts',
    EVENTS: '/admin/events',
    POSTS: '/posts',
    PRODUCTS: '/products',
    TRANSACTIONS: '/transactions',
    REPORTS: '/reports',
    QUARTZ: '/admin/quartz',
    SYSTEM: '/system-settings',
    REFUNDS: '/refunds',
};
