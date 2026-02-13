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

const guestRoutes = [
    {
        path: '/login',
        component: AuthPage,
        layout: null,
    }
];

const privateRoutes = [
    {
        path: '/unauthorized',
        component: Unauthorized,
        layout: null,
    },
    {
        path: '/',
        component: Dashboard,
        layout: DefaultLayout,
        roles: ['admin'],
    },
    {
        path: '/dashboard',
        component: Dashboard,
        layout: DefaultLayout,
        roles: ['admin'],
    },
    {
        path: '/users',
        component: UserManagement,
        layout: DefaultLayout,
        roles: ['admin'],
    },
    {
        path: '/experts',
        component: ExpertManagement,
        layout: DefaultLayout,
        roles: ['admin'],
    },
    {
        path: '/posts',
        component: PostManagement,
        layout: DefaultLayout,
        roles: ['admin'],
    },
    {
        path: '/products',
        component: ProductManagement,
        layout: DefaultLayout,
        roles: ['admin'],
    },
    {
        path: '/transactions',
        component: TransactionManagement,
        layout: DefaultLayout,
        roles: ['admin'],
    },
    {
        path: '/reports',
        component: ReportManagement,
        layout: DefaultLayout,
        roles: ['admin'],
    },
    {
        path: '/unauthorized',
        component: Unauthorized,
        layout: null,
    }
];

export { guestRoutes, privateRoutes };