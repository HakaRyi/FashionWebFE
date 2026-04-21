import { loginApi, googleLoginApi } from '../api/login';
import { useAuth } from '@/app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/app/routes/paths';
import { jwtDecode } from 'jwt-decode';

export const useLogin = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (email, password) => {
        try {
            const data = await loginApi(email, password);

            await login(data.accessToken, data.refreshToken);

            const decoded = jwtDecode(data.accessToken);
            const role = (
                decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role
            )?.toLowerCase();

            const redirectPath = role === 'admin' ? PATHS.DASHBOARD : PATHS.USER_FEED;
            navigate(redirectPath, { replace: true });
        } catch (error) {
            throw error;
        }
    };

    const handleGoogleLogin = async (idToken) => {
        try {
            const data = await googleLoginApi(idToken);
            await processLoginData(data);
        } catch (error) {
            throw error;
        }
    };

    return { handleLogin, handleGoogleLogin };
};
