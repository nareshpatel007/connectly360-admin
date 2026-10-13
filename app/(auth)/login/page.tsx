"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, AlertCircle, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { AdminAuthSplitLayout } from "@/components/auth/AdminAuthSplitLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthPasswordInput } from "@/components/auth/AuthPasswordInput";
import { toast } from "sonner";

function AdminLoginContent() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    // Load remembered email on initial mount
    useEffect(() => {
        try {
            const savedEmail = localStorage.getItem("connectly360_admin_remembered_email");
            if (savedEmail) {
                setEmail(savedEmail);
                setRememberMe(true);
            }
        } catch {
            // ignore localStorage errors
        }
    }, []);

    const validateForm = () => {
        const errors: { email?: string; password?: string } = {};
        if (!email.trim()) {
            errors.email = "Administrator email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            errors.email = "Please enter a valid administrator email address.";
        }

        if (!password) {
            errors.password = "Password is required.";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters.";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/admin/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), password }),
            });

            const data = await res.json();

            if (data.status && data.data?.access_token) {
                // Check if user has admin privileges
                const role = (data.data.role || "").toLowerCase();
                const isAdmin = data.data.is_admin === 1 || ["super_admin", "owner", "admin"].includes(role);

                if (!isAdmin) {
                    setError("Access denied: You do not have platform administrator privileges.");
                    setIsLoading(false);
                    return;
                }

                // Handle remember me preference
                try {
                    if (rememberMe) {
                        localStorage.setItem("connectly360_admin_remembered_email", email.trim());
                    } else {
                        localStorage.removeItem("connectly360_admin_remembered_email");
                    }
                } catch {
                    // ignore
                }

                toast.success(`Welcome back, ${data.data.name || "Administrator"}!`);
                login(data.data.access_token, {
                    id: data.data.user_id,
                    name: data.data.name || "Administrator",
                    email: data.data.email,
                    role: data.data.role,
                    is_admin: 1,
                    tenant_id: data.data.tenant_id,
                });
            } else {
                setError(data.message || "Invalid credentials or unauthorized admin access.");
            }
        } catch {
            setError("Unable to connect to Connectly360 Admin API. Please check your network or server status.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full bg-white border border-slate-200/90 shadow-xl shadow-slate-200/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-5">
            {/* Form Header */}
            <div className="space-y-1 text-left">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                    Sign in to Admin Console
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Enter your administrator credentials to access platform controls.
                </p>
            </div>

            {/* Error Banner */}
            {error && (
                <div
                    role="alert"
                    aria-live="polite"
                    className="flex items-start gap-2.5 p-3.5 bg-rose-50/90 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200"
                >
                    <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">{error}</div>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4" noValidate>
                {/* Email Address */}
                <AuthInput
                    id="email"
                    label="Administrator Email"
                    type="email"
                    required
                    autoComplete="email"
                    disabled={isLoading}
                    placeholder="admin@connectly360.com"
                    value={email}
                    error={fieldErrors.email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) {
                            setFieldErrors((prev) => ({ ...prev, email: undefined }));
                        }
                    }}
                />

                {/* Password & Forgot Password */}
                <AuthPasswordInput
                    id="password"
                    label="Password"
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                    placeholder="••••••••••••"
                    value={password}
                    error={fieldErrors.password}
                    rightLabelAction={
                        <Link
                            href="/forgot-password"
                            className="text-xs font-semibold text-[#35877D] hover:text-[#286f66] hover:underline transition-colors focus:outline-none"
                            tabIndex={isLoading ? -1 : 0}
                        >
                            Forgot password?
                        </Link>
                    }
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) {
                            setFieldErrors((prev) => ({ ...prev, password: undefined }));
                        }
                    }}
                />

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            disabled={isLoading}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-[#35877D] focus:ring-[#35877D] cursor-pointer"
                        />
                        <span className="text-xs text-slate-600 font-medium">Remember my session email</span>
                    </label>
                </div>

                {/* Submit Primary Button */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#35877D] hover:bg-[#2b7068] active:scale-[0.99] text-white font-semibold h-11 rounded-xl gap-2 cursor-pointer shadow-sm shadow-[#35877D]/25 transition-all text-xs sm:text-sm mt-1 focus-visible:ring-2 focus-visible:ring-[#35877D]/40"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin shrink-0" size={16} />
                            <span>Authenticating Administrator...</span>
                        </>
                    ) : (
                        <>
                            <span>Access Platform Console</span>
                            <ArrowRight size={16} />
                        </>
                    )}
                </Button>
            </form>

            {/* Security Notice Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-center text-[11px] text-slate-400 font-medium">
                <ShieldAlert size={13} className="text-slate-400 shrink-0" />
                <span>Restricted to authorized personnel. All attempts are audit logged.</span>
            </div>
        </Card>
    );
}

export default function AdminLoginPage() {
    return (
        <AdminAuthSplitLayout>
            <Suspense
                fallback={
                    <Card className="w-full bg-white border border-slate-200 shadow-sm rounded-2xl sm:rounded-3xl p-8 flex flex-col items-center justify-center min-h-[360px] space-y-3">
                        <Loader2 className="animate-spin text-[#35877D]" size={32} />
                        <p className="text-xs font-semibold text-slate-500">Loading admin authentication...</p>
                    </Card>
                }
            >
                <AdminLoginContent />
            </Suspense>
        </AdminAuthSplitLayout>
    );
}
