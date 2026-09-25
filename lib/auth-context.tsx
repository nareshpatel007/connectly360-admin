"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: string | null;
    is_admin?: boolean | number;
    tenant_id?: number | null;
    credits?: number;
}

interface AuthContextType {
    token: string | null;
    user: AdminUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user?: AdminUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isEmpty(val: unknown) {
    return val === undefined || val === null || val === "" || val === 0;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const isFirstRender = useRef(true);

    const logout = useCallback(() => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("admin_auth_token");
        }
        setToken(null);
        setUser(null);
        setIsLoading(false);
        router.push("/login");
    }, [router]);

    // Primary profile fetch (used on initial reload / mount)
    const fetchAdminProfile = useCallback(async (authToken: string) => {
        try {
            const res = await fetch("/api/auth/profile", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "X-Api-Token": authToken
                }
            });
            const data = await res.json();
            if (data.status && data.data) {
                const fetchedUser = data.data;
                const isAdmin = (!isEmpty(fetchedUser.is_admin) && fetchedUser.is_admin === 1) ||
                               (fetchedUser.role && ["super_admin", "owner", "admin"].includes(fetchedUser.role.toLowerCase()));

                if (!isAdmin) {
                    logout();
                    return;
                }

                setUser({
                    id: fetchedUser.id,
                    name: fetchedUser.name || `${fetchedUser.first_name || ""} ${fetchedUser.last_name || ""}`.trim() || "Administrator",
                    email: fetchedUser.email,
                    role: fetchedUser.role,
                    is_admin: fetchedUser.is_admin,
                    tenant_id: fetchedUser.tenant_id
                });
            } else {
                logout();
            }
        } catch {
            logout();
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

    // Silent background auth & permission check on route / page navigation
    const checkAuthInBackground = useCallback(async (authToken: string) => {
        try {
            const res = await fetch("/api/auth/profile", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "X-Api-Token": authToken
                }
            });
            const data = await res.json();
            if (data.status && data.data) {
                const fetchedUser = data.data;
                const isAdmin = (!isEmpty(fetchedUser.is_admin) && fetchedUser.is_admin === 1) ||
                               (fetchedUser.role && ["super_admin", "owner", "admin"].includes(fetchedUser.role.toLowerCase()));

                if (!isAdmin) {
                    logout();
                    return;
                }

                setUser({
                    id: fetchedUser.id,
                    name: fetchedUser.name || `${fetchedUser.first_name || ""} ${fetchedUser.last_name || ""}`.trim() || "Administrator",
                    email: fetchedUser.email,
                    role: fetchedUser.role,
                    is_admin: fetchedUser.is_admin,
                    tenant_id: fetchedUser.tenant_id
                });
            } else {
                logout();
            }
        } catch {
            logout();
        }
    }, [logout]);

    // Initial load / browser reload check
    useEffect(() => {
        const storedToken = typeof window !== "undefined" ? localStorage.getItem("admin_auth_token") : null;
        if (storedToken) {
            setToken(storedToken);
            fetchAdminProfile(storedToken);
        } else {
            setIsLoading(false);
        }
    }, [fetchAdminProfile]);

    // Background auth & permission check on page navigation (route changes)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const isAuthPage =
            pathname === "/login" ||
            pathname === "/forgot-password" ||
            pathname === "/reset-password" ||
            pathname === "/register" ||
            pathname === "/verify";

        if (token && !isAuthPage) {
            checkAuthInBackground(token);
        }
    }, [pathname, token, checkAuthInBackground]);

    // Route Protection logic
    useEffect(() => {
        if (isLoading) return;

        const isAuthPage =
            pathname === "/login" ||
            pathname === "/forgot-password" ||
            pathname === "/reset-password" ||
            pathname === "/register" ||
            pathname === "/verify";

        if (!token && !isAuthPage) {
            router.push("/login");
        } else if (token && isAuthPage) {
            router.push("/dashboard");
        }
    }, [token, pathname, isLoading, router]);

    const login = (newToken: string, userObj?: AdminUser) => {
        localStorage.setItem("admin_auth_token", newToken);
        setToken(newToken);
        if (userObj) {
            setUser(userObj);
            setIsLoading(false);
        } else {
            setIsLoading(true);
            fetchAdminProfile(newToken);
        }
        router.push("/dashboard");
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
