"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const fetchAdminProfile = async (authToken: string) => {
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
                const isAdmin = (!empty(fetchedUser.is_admin) && fetchedUser.is_admin == 1) ||
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
        } catch (err) {
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    function empty(val: any) {
        return val === undefined || val === null || val === "" || val === 0;
    }

    useEffect(() => {
        const storedToken = localStorage.getItem("admin_auth_token");
        if (storedToken) {
            setToken(storedToken);
            fetchAdminProfile(storedToken);
        } else {
            setIsLoading(false);
        }
    }, []);

    // Route Protection logic
    useEffect(() => {
        if (isLoading) return;

        const isAuthPage =
            pathname === "/login" ||
            pathname === "/forgot-password" ||
            pathname === "/reset-password";

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

    const logout = () => {
        localStorage.removeItem("admin_auth_token");
        setToken(null);
        setUser(null);
        setIsLoading(false);
        router.push("/login");
    };

    const isAuthPage =
        pathname === "/login" ||
        pathname === "/forgot-password" ||
        pathname === "/reset-password";

    const showContent = isAuthPage || (token && !isLoading);

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
            {showContent ? (
                children
            ) : (
                <div className="flex h-screen w-screen items-center justify-center bg-slate-900 text-white font-sans">
                    <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-slate-800/80 backdrop-blur-lg border border-slate-700 shadow-2xl">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full bg-[#35877D]/30 blur-xl animate-pulse" />
                            <div className="h-12 w-12 rounded-full border-4 border-[#35877D]/30 border-t-[#35877D] animate-spin" />
                        </div>
                        <p className="text-sm font-bold text-[#35877D] tracking-wide animate-pulse">
                            Initializing Connectly360 Admin Portal...
                        </p>
                    </div>
                </div>
            )}
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
