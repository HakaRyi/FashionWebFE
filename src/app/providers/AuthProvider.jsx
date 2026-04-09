import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../routes/paths";
import axiosClient from "@/shared/lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // 1. Hàm giải mã token (giữ nguyên logic cũ của bạn)
    const decodeToken = (token) => {
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
            };
        } catch (error) {
            console.error("Invalid token:", error);
            return null;
        }
    };

    const fetchFullProfile = useCallback(async (userId) => {
        try {
            const response = await axiosClient.get(`/profile/${userId}`);
            return response.data; 
        } catch (error) {
            console.error("Lỗi lấy profile chi tiết:", error);
            return null;
        }
    }, []);

    // 3. Khởi tạo Auth khi load trang
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                const decoded = decodeToken(token);
                if (decoded) {
                    const fullUser = await fetchFullProfile(decoded.id);
                    setUser(fullUser ? { ...fullUser, role: fullUser.role?.toLowerCase() } : decoded);
                } else {
                    localStorage.clear();
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, [fetchFullProfile]);

    const login = async (accessToken, refreshToken) => {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        
        const decoded = decodeToken(accessToken);
        if (decoded) {
            const fullUser = await fetchFullProfile(decoded.id);
            setUser(fullUser ? { ...fullUser, role: fullUser.role?.toLowerCase() } : decoded);
            return true;
        }
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        navigate(PATHS.HOME, { replace: true });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading, setUser }}>
            {children}
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