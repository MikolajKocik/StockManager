import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '@/api/config/api';

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isAuthenticating, setIsAuthenticating] = useState(!token);

    const login = (newToken: string) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
        setIsAuthenticating(false);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    const isAuthenticated = !!token;

    useEffect(() => {
        if (import.meta.env.DEV && !token) {
            setIsAuthenticating(true);
            api.post('/auth/login', { userName: 'admin', password: 'admin' })
                .then(response => {
                    const token = response.data.result.value.token;
                    login(token);
                })
                .catch(err => {
                    console.error("Auto-login failed:", err);
                    setIsAuthenticating(false);
                });
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated, isAuthenticating }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined || context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
