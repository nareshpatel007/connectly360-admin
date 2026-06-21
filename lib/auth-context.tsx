"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
    id: number;
    tenant_id: number | null;
    name: string;
    email: string;
    role: string | null;
    plan?: string;
    trial_ends_at?: string | null;
    credits?: number;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const fetchProfile = async (authToken: string) => {
        try {
            const res = await fetch("/api/auth/profile", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            });
            const data = await res.json();
            if (data.status) {
                const fetchedUser = data.data;
                setUser({
                    id: fetchedUser.id,
                    tenant_id: fetchedUser.tenant_id,
                    name: fetchedUser.name || `${fetchedUser.first_name || ""} ${fetchedUser.last_name || ""}`.trim() || "User",
                    email: fetchedUser.email,
                    role: fetchedUser.role,
                    plan: fetchedUser.plan,
                    trial_ends_at: fetchedUser.trial_ends_at,
                    credits: fetchedUser.credits
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

    useEffect(() => {
        // Load auth data from localStorage on mount
        const storedToken = localStorage.getItem("auth_token");
        // Ensure legacy auth_user is completely removed
        localStorage.removeItem("auth_user");

        if (storedToken) {
            setToken(storedToken);
            fetchProfile(storedToken);
        } else {
            setIsLoading(false);
        }
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
            pathname === "/forgot-password" ||
            pathname.startsWith("/verify");

        const isAuthPage =
            pathname === "/login" ||
            pathname === "/register" ||
            pathname === "/forgot-password";

        const planName = user?.plan?.toLowerCase();
        const isFree = planName === "free";
        let isTrialExpired = false;
        if (isFree && user?.trial_ends_at) {
            const trialEnd = new Date(user.trial_ends_at);
            const now = new Date();
            isTrialExpired = trialEnd.getTime() - now.getTime() <= 0;
        }

        if (!token && !isPublicPage) {
            // Redirect to login if not authenticated and not on a public page
            router.push("/login");
        } else if (token && isAuthPage) {
            // Redirect to dashboard home if already logged in and visiting auth pages
            router.push("/dashboard");
        } else if (token && isTrialExpired && !isPublicPage && pathname !== "/billing/subscription") {
            // Redirect to subscription page if trial is expired
            router.push("/billing/subscription");
        }
    }, [token, user, pathname, isLoading, router]);

    const login = (newToken: string) => {
        localStorage.setItem("auth_token", newToken);
        setToken(newToken);
        setIsLoading(true);
        fetchProfile(newToken);
        router.push("/dashboard");
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        setToken(null);
        setUser(null);
        router.push("/login");
    };

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
        pathname === "/forgot-password" ||
        pathname.startsWith("/verify");

    const showContent = isPublicPage || (token && !isLoading);

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
                <div className="flex h-screen w-screen items-center justify-center bg-[#FAF8F5]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#35877D] border-t-transparent" />
                        <p className="text-xs font-semibold text-gray-500 font-sans">Loading...</p>
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
