// Auth Context - Admin Authentication
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const adminSession = localStorage.getItem('fairy_admin');
        if (adminSession === 'true') {
            setIsAdmin(true);
        }
        setLoading(false);
    }, []);

    const login = (username, password) => {
        // Simple demo authentication
        if (username === 'admin' && password === 'fairy2024') {
            setIsAdmin(true);
            localStorage.setItem('fairy_admin', 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAdmin(false);
        localStorage.removeItem('fairy_admin');
    };

    return (
        <AuthContext.Provider value={{ isAdmin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
