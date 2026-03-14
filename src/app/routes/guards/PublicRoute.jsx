import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { PATHS } from "../paths";

const PublicRoute = () => {
    const { user } = useAuth();
    const location = useLocation();

    if (user && location.pathname === PATHS.LOGIN) {
        const redirectPath = user.role === 'admin' ? PATHS.DASHBOARD : PATHS.USER_FEED;
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;