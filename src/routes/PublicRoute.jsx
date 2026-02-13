import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (token) {
        const redirectPath = userRole === 'admin' ? '/dashboard' : '/';
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
