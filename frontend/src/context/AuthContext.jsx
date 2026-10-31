
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import api from "../api/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "wealthwise_token";
const USER_KEY = "wealthwise_user";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem(USER_KEY);
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            localStorage.removeItem(USER_KEY);
            return null;
        }
    });

    const [token, setToken] = useState(
        () => localStorage.getItem(TOKEN_KEY)
    );

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token || !user) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            setToken(null);
            setUser(null);
        }
    }, []);

    const saveSession = (response) => {
        const { token, tokenType, ...userData } = response;

        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));

        setToken(token);
        setUser(userData);
    };

    const login = async (credentials) => {
        setLoading(true);

        try {
            const response = await api.post(
                "/auth/login",
                credentials
            );

            saveSession(response.data);

            return response.data;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);

        try {
            const response = await api.post(
                "/auth/register",
                userData
            );

            saveSession(response.data);

            return response.data;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated: Boolean(token && user),
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}
