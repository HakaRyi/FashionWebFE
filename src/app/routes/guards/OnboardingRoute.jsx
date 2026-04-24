import { Navigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { PATHS } from '../paths';

const OnboardingRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/" replace />;

    if (user.hasCompletedOnboarding) {
        return <Navigate to={PATHS.USER_FEED} replace />;
    }

    return children;
};

export default OnboardingRoute;
