import Dashboard from '~/pages/Dashboard';
import DefaultLayout from '~/layouts/DefaultLayout';

const publicRoutes = [
    {
        path: '/',
        component: Dashboard,
        layout: DefaultLayout,
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
