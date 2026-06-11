"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
    id: number;
    tenant_id: number | null;
    name: string;
    email: string;
    role: string | null;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Load auth data from localStorage on mount
        const storedToken = localStorage.getItem("auth_token");
        const storedUser = localStorage.getItem("auth_user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    // Route protection logic
    useEffect(() => {
        if (isLoading) return;

        const isPublicPage =
            pathname === "/" ||
            pathname === "/pricing" ||
            pathname === "/contact" ||
            pathname === "/privacy" ||
            pathname === "/terms" ||
            pathname === "/cookie-policy" ||
            pathname === "/refund-policy" ||
            pathname === "/faq" ||
            pathname === "/login" ||
            pathname === "/register" ||
            pathname === "/forgot-password";

        const isAuthPage =
            pathname === "/login" ||
            pathname === "/register" ||
            pathname === "/forgot-password";

        if (!token && !isPublicPage) {
            // Redirect to login if not authenticated and not on a public page
            router.push("/login");
        } else if (token && isAuthPage) {
            // Redirect to dashboard home if already logged in and visiting auth pages
            router.push("/dashboard");
        }
    }, [token, pathname, isLoading, router]);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem("auth_token", newToken);
        localStorage.setItem("auth_user", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        router.push("/dashboard");
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        setToken(null);
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isAuthenticated: !!token,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
