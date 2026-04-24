import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { PATHS } from "../paths";

const PublicRoute = () => {
    const { user } = useAuth();
    const location = useLocation();

    if (user && (location.pathname === PATHS.LOGIN || location.pathname === PATHS.HOME)) {
        // Nếu admin -> Dashboard
        if (user.role === 'admin') return <Navigate to={PATHS.DASHBOARD} replace />;

        // Nếu user chưa onboarding -> trang onboarding
        if (!user.hasCompletedOnboarding) return <Navigate to={PATHS.ONBOARDING} replace />;

        // Ngược lại -> Feed
        return <Navigate to={PATHS.USER_FEED} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;