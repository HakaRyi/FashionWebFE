import Dashboard from '../../pages/Dashboard';
import UserManagement from '../../pages/User';
import ExpertManagement from '../../pages/ExpertManagement';
import PostManagement from '../../pages/Post';
import ProductManagement from '../../pages/Product';
import TransactionManagement from '../../pages/Transaction';
import ReportManagement from '../../pages/Report';
import QuartzManager from '../../pages/Jobs';
import EventManagement from '../../pages/EventManagement';
import SystemSettingsPage from '../../pages/System';

import AuthPage from '../../pages/Authentication';
import Unauthorized from '../../pages/Unauthorized';

import ExpertApplication from '../../pages/ExpertRegistration';
import ProfilePage from '../../pages/Profile';
import CreateEvent from '../../pages/ExpertCreateEvent';
import MyEvents from '../../pages/ExpertEvent';
import EventDetailPage from '../../pages/ExpertEventDetail';
import ExpertInvitations from '../../pages/ExpertInvitations';
import Analytics from '../../pages/ExpertAnalytics';
import ExpertWallet from '../../pages/ExpertWallet';
import SubmissionsReview from '../../pages/ExpertSubmissionsReview';
import EventSummary from '../../pages/EventSummary';
import Policy from '../../pages/Policy';
import ExpertReputation from '../../pages/ExpertReputation';

import Home from '../../pages/Home';
import FashionFeed from '../../pages/Feed';
import SearchResultsPage from '../../pages/FeedSearch';
import PostDetailPage from '../../pages/PostDetail';
import EventsPage from '../../pages/Events';
import FullArchive from '../../pages/EventFullArchive';
import Onboarding from '../../pages/Onboarding';

import DefaultLayout from '../../widgets/layouts/DefaultLayout';
import HomeLayout from '../../widgets/layouts/HomeLayout';
import ExpertLayout from '../../widgets/layouts/ExpertLayout';
import PaymentResult from '../../pages/PaymentResult';

import RefundManagement from '@/pages/Refund';

import { PATHS } from './paths';

export const routes = [
    // ===== PUBLIC =====
    {
        path: PATHS.HOME,
        component: Home,
        layout: HomeLayout,
        isAuthRoute: true,
    },
    {
        path: PATHS.LOGIN,
        component: AuthPage,
        layout: null,
        isAuthRoute: true,
    },
    {
        path: PATHS.UNAUTHORIZED,
        component: Unauthorized,
        layout: null,
    },
    {
        path: PATHS.USER_POLICY,
        component: Policy,
        layout: HomeLayout,
        roles: ['user', 'expert'],
    },

    // ===== USER =====
    {
        path: PATHS.ONBOARDING,
        component: Onboarding,
        layout: HomeLayout,
        isOnboardingRoute: true,
        // roles: ['user', 'expert'],
    },
    {
        path: PATHS.USER_FEED,
        component: FashionFeed,
        layout: HomeLayout,
        roles: ['user', 'expert'],
    },
    {
        path: PATHS.SEARCH_RESULTS,
        component: SearchResultsPage,
        layout: HomeLayout,
        roles: ['user', 'expert'],
    },
    {
        path: PATHS.POST_DETAIL,
        component: PostDetailPage,
        layout: HomeLayout,
        roles: ['user', 'expert'],
    },
    {
        path: PATHS.USER_EVENTS,
        component: EventsPage,
        layout: HomeLayout,
        roles: ['user', 'expert'],
    },
    {
        path: PATHS.EVENT_DETAIL,
        component: EventDetailPage,
        layout: HomeLayout,
        roles: ['user', 'expert'],
    },
    {
        path: PATHS.EVENT_SUMMARY,
        component: EventSummary,
        layout: HomeLayout,
        roles: ['user', 'expert'],
    },
    {
        path: PATHS.EVENT_SUMMARY_FULL_ARCHIVE,
        component: FullArchive,
        layout: HomeLayout,
        roles: ['user', 'expert'],
    },
    {
        path: PATHS.PAYMENT_RESULT,
        component: PaymentResult,
        layout: HomeLayout,
        roles: ['user', 'expert'],
    },

    // ===== EXPERT =====
    {
        path: PATHS.EXPERT_APPLICATION,
        component: ExpertApplication,
        layout: HomeLayout,
        roles: ['user'],
    },
    {
        path: PATHS.EXPERT_PROFILE,
        component: ProfilePage,
        layout: HomeLayout,
        roles: ['user', 'expert'],
    },
    {
        path: PATHS.EXPERT_CREATE_EVENTS,
        component: CreateEvent,
        layout: ExpertLayout,
        roles: ['expert'],
    },
    {
        path: PATHS.EXPERT_EVENTS,
        component: MyEvents,
        layout: ExpertLayout,
        roles: ['expert'],
    },
    {
        path: PATHS.EXPERT_EVENT_DETAIL,
        component: EventDetailPage,
        layout: ExpertLayout,
        roles: ['expert'],
    },
    {
        path: PATHS.EXPERT_INVITATIONS,
        component: ExpertInvitations,
        layout: ExpertLayout,
        roles: ['expert'],
    },
    {
        path: PATHS.EXPERT_DASHBOARD,
        component: Analytics,
        layout: ExpertLayout,
        roles: ['expert'],
    },
    {
        path: PATHS.EXPERT_WALLET,
        component: ExpertWallet,
        layout: ExpertLayout,
        roles: ['expert'],
    },
    {
        path: PATHS.EXPERT_SUBMISSION_REVIEW,
        component: SubmissionsReview,
        layout: ExpertLayout,
        roles: ['expert'],
    },
    {
        path: PATHS.EXPERT_SUMMARY_EVENT,
        component: EventSummary,
        layout: ExpertLayout,
        roles: ['expert'],
    },
    {
        path: PATHS.EXPERT_REPUTATION,
        component: ExpertReputation,
        layout: ExpertLayout,
        roles: ['expert'],
    },

    // ===== ADMIN =====
    {
        path: PATHS.DASHBOARD,
        component: Dashboard,
        layout: DefaultLayout,
        roles: ['admin'],
    },
    {
        path: PATHS.USERS,
        component: UserManagement,
        layout: DefaultLayout,
        roles: ['admin'],
    },
    {
        path: PATHS.EXPERTS,
        component: ExpertManagement,
        layout: DefaultLayout,
        roles: ['admin'],
    },
    {
        path: PATHS.EVENTS,
        component: EventManagement,
        layout: DefaultLayout,
        roles: ['admin'],
    },
    {
        path: PATHS.POSTS,
        component: PostManagement,
        layout: DefaultLayout,
        roles: ['admin'],
    },
    {
        path: PATHS.PRODUCTS,
        component: ProductManagement,
        layout: DefaultLayout,
        roles: ['admin'],
    },
    {
        path: PATHS.TRANSACTIONS,
        component: TransactionManagement,
        layout: DefaultLayout,
        roles: ['admin'],
    },
    {
        path: PATHS.REFUNDS,
        component: RefundManagement,
        layout: DefaultLayout,
        roles: ['admin'],
    },
    {
        path: PATHS.REPORTS,
        component: ReportManagement,
        layout: DefaultLayout,
        roles: ['admin'],
    },
    {
        path: PATHS.QUARTZ,
        component: QuartzManager,
        layout: DefaultLayout,
        roles: ['admin'],
    },
    {
        path: PATHS.SYSTEM,
        component: SystemSettingsPage,
        layout: DefaultLayout,
        roles: ['admin'],
    },
];
