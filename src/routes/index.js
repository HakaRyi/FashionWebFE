import Dashboard from '~/pages/Dashboard';
import DefaultLayout from '~/layouts/DefaultLayout';
import UserManagement from '~/pages/User/index';
import ExpertManagement from '~/pages/Expert/index';
import PostManagement from '~/pages/Post/index';
import ProductManagement from '~/pages/Product/index';
import TransactionManagement from '~/pages/Transaction/index';
import ReportManagement from '~/pages/Report/index';

const publicRoutes = [
    {
        path: '/',
        component: Dashboard,
        layout: DefaultLayout,
    },
    {
        path: '/dashboard', // Thêm đường dẫn tường minh cho Dashboard
        component: Dashboard,
        layout: DefaultLayout,
    },
    {
        path: '/users', // Đường dẫn cho trang Quản lý User
        component: UserManagement,
        layout: DefaultLayout,
    },
    {
        path: '/experts', // Đường dẫn cho trang Quản lý Expert
        component: ExpertManagement,
        layout: DefaultLayout,
    },
    {
        path: '/posts', // Đường dẫn cho trang Quản lý Bài viết
        component: PostManagement,
        layout: DefaultLayout,
    },
    {
        path: '/products', // Đường dẫn cho trang Quản lý Sản phẩm
        component: ProductManagement,
        layout: DefaultLayout,
    },
    {
        path: '/transactions', // Đường dẫn cho trang Quản lý Giao dịch
        component: TransactionManagement,
        layout: DefaultLayout,
    },
    {
        path: '/reports', // Đường dẫn cho trang Báo cáo
        component: ReportManagement,
        layout: DefaultLayout,
    }
    
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
