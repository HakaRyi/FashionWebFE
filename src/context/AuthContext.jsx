import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedUser = decodeToken(token);
            if (decodedUser) {
                setUser(decodedUser);
            } else {
                localStorage.clear();
            }
        }
    }, []);

    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);

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
            console.error("Invalid token");
            return null;
        }
    };

    const login = (accessToken, refreshToken) => {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setUser(decodeToken(accessToken));
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/', { replace: true });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);