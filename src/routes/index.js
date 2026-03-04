import Dashboard from '../pages/Dashboard';
import DefaultLayout from '../layouts/DefaultLayout';
import UserManagement from '../pages/User';
import ExpertManagement from '../pages/Expert';
import PostManagement from '../pages/Post';
import ProductManagement from '../pages/Product';
import TransactionManagement from '../pages/Transaction';
import ReportManagement from '../pages/Report';
import AuthPage from '../pages/Authentication';
import Unauthorized from '../pages/Unauthorized';
import ExpertApplication from '../pages/ExpertApplication';
import ExpertProfile from '../pages/ExpertProfile';
import CreateEvent from '../pages/CreateEvent';
import Home from '../pages/Home/index';
import FashionFeed from '../pages/Feed/index';
import HomeLayout from '../layouts/HomeLayout';
import { PATHS } from './paths';

export const routes = [
    // ===== PUBLIC =====
    {
        path: PATHS.HOME,
        component: Home,
        layout: HomeLayout,
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

    // ===== USER =====
    {
        path: PATHS.USER_FEED,
        component: FashionFeed,
        layout: HomeLayout,
        roles: ['user'],
    },

    // ===== EXPERT =====
    {
        path: PATHS.EXPERT_APPLICATION,
        component: ExpertApplication,
        layout: HomeLayout,
        roles: ['expert'],
    },
    {
        path: PATHS.EXPERT_PROFILE,
        component: ExpertProfile,
        layout: HomeLayout,
        roles: ['expert'],
    },
    {
        path: PATHS.EXPERT_CREATE_EVENTS,
        component: CreateEvent,
        layout: HomeLayout,
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
        path: PATHS.REPORTS,
        component: ReportManagement,
        layout: DefaultLayout,
        roles: ['admin'],
    },
];