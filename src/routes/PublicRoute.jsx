import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PATHS } from "../routes/paths";

const PublicRoute = () => {
    const { user } = useAuth();
    const location = useLocation();

    if (user && location.pathname === PATHS.LOGIN) {
    return <Navigate to={PATHS.USER_FEED} replace />;
}

    return <Outlet />;
};

export default PublicRoute;


/*
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
*/