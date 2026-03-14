import { Navigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

const ProtectedRoute = ({ roles, children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const userRole = user.role?.toLowerCase();
  const allowedRoles = roles?.map(r => r.toLowerCase());

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

export default ProtectedRoute;