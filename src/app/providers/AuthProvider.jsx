import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../routes/paths";
import axiosClient, { API_URL } from "@/shared/lib/axios";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const refreshTimer = useRef(null);
    const handleAuthSuccessRef = useRef();

    const logout = useCallback(() => {
        if (refreshTimer.current) clearTimeout(refreshTimer.current);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        delete axiosClient.defaults.headers.common['Authorization'];
        setUser(null);
        navigate(PATHS.HOME, { replace: true });
    }, [navigate]);

    const decodeToken = useCallback((token) => {
        try {
            const decoded = jwtDecode(token);
            console.log("JWT Decoded:", decoded);
            const role =
                decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
                decoded.role;

            return {
                id: decoded.sub,
                email: decoded.email,
                username: decoded.Username,
                role: role?.toLowerCase(),
                exp: decoded.exp,
            };
        } catch (error) {
            console.error("Invalid token:", error);
            return null;
        }
    }, []);

    const setupSilentRefresh = useCallback((token) => {
        if (refreshTimer.current) clearTimeout(refreshTimer.current);

        const decoded = decodeToken(token);
        if (!decoded || !decoded.exp) return;

        const expiresAt = decoded.exp * 1000;
        const timeout = expiresAt - Date.now() - (60 * 1000);

        if (timeout > 0) {
            refreshTimer.current = setTimeout(async () => {
                try {
                    const rfToken = localStorage.getItem('refreshToken');
                    if (!rfToken) throw new Error("No refresh token found");

                    const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken: rfToken });

                    if (handleAuthSuccessRef.current) {
                        await handleAuthSuccessRef.current(data.accessToken, data.refreshToken);
                        console.log("Token refreshed silently");
                    }
                } catch (error) {
                    console.error("Silent refresh failed", error);
                    logout();
                }
            }, timeout);
        }
    }, [decodeToken, logout]);

    const handleAuthSuccess = useCallback(async (accessToken, refreshToken) => {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        const decoded = decodeToken(accessToken);
        if (decoded) {
            setupSilentRefresh(accessToken);
            // Fetch thông tin chi tiết
            try {
                const response = await axiosClient.get(`/profile/${decoded.id}`);
                const fullUser = response.data;
                setUser({ ...fullUser, role: fullUser.role?.toLowerCase() });
            } catch (error) {
                setUser(decoded);
            }
            return true;
        }
        return false;
    }, [decodeToken, setupSilentRefresh]);

    useEffect(() => {
        handleAuthSuccessRef.current = handleAuthSuccess;
    }, [handleAuthSuccess]);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                const decoded = decodeToken(token);
                // Nếu token còn hạn > 10 giây (tránh edge case)
                if (decoded && decoded.exp * 1000 > Date.now() + 10000) {
                    await handleAuthSuccess(token, localStorage.getItem("refreshToken"));
                } else {
                    logout();
                }
            }
            setIsLoading(false);
        };

        initAuth();

        // LẮNG NGHE SỰ KIỆN TỪ AXIOS_CLIENT
        const handleRefreshedEvent = (e) => {
            handleAuthSuccess(e.detail.accessToken, e.detail.refreshToken);
        };
        const handleLogoutEvent = () => logout();

        window.addEventListener('auth-refreshed', handleRefreshedEvent);
        window.addEventListener('auth-logout', handleLogoutEvent);

        return () => {
            if (refreshTimer.current) clearTimeout(refreshTimer.current);
            window.removeEventListener('auth-refreshed', handleRefreshedEvent);
            window.removeEventListener('auth-logout', handleLogoutEvent);
        };
    }, [decodeToken, handleAuthSuccess, logout]);

    return (
        <AuthContext.Provider value={{ user, login: handleAuthSuccess, logout, isLoading, setUser }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};