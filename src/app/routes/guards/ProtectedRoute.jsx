import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { PATHS } from "../paths";

const ProtectedRoute = ({ roles, children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/" replace />;

  if (
    user.role === 'user' &&
    user.hasCompletedOnboarding === false &&
    location.pathname !== PATHS.ONBOARDING
  ) {
    return <Navigate to={PATHS.ONBOARDING} replace />;
  }

  const userRole = user.role?.toLowerCase();
  const allowedRoles = roles?.map(r => r.toLowerCase());

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to={PATHS.UNAUTHORIZED} replace />;
  }

  return children;
};

export default ProtectedRoute;