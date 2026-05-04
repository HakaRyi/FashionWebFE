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

            login(data.accessToken, data.refreshToken);
            navigate(PATHS.USER_FEED, { replace: true });

            return data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const handleGoogleLogin = async (credential) => {
        try {
            const data = await googleLoginApi(credential);
            login(data.accessToken, data.refreshToken);
            navigate(PATHS.USER_FEED, { replace: true });
        } catch (error) {
            console.error('Google login failed:', error);
            throw error;
        }
    };

    return { handleLogin, handleGoogleLogin };
};
