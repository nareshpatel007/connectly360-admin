"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (data.status && data.data?.access_token) {
                toast.success("Welcome back, Administrator!");
                login(data.data.access_token, {
                    id: data.data.user_id,
                    name: data.data.name,
                    email: data.data.email,
                    role: data.data.role,
                    is_admin: 1,
                    tenant_id: data.data.tenant_id
                });
            } else {
                setError(data.message || "Invalid credentials or unauthorized admin access.");
            }
        } catch (err: any) {
            setError("Server connection failed. Please check network or API status.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-6 z-10">
            {/* Header / Branding */}
            <div className="text-center space-y-3">
                <div className="flex justify-center items-center gap-2">
                    <img
                        src="/images/logo.png"
                        alt="Connectly360 Logo"
                        className="h-9 w-auto object-contain"
                    />
                </div>
            </div>

            {/* Admin Login Card */}
            <Card className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-md space-y-5">
                {error && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-bold text-slate-900">
                            Email address
                        </Label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                            <Input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                disabled={loading}
                                placeholder="admin@connectly360.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 h-11 bg-slate-50 border-slate-200 text-slate-900 focus-visible:ring-[#35877D] focus-visible:border-[#35877D] rounded-xl text-xs sm:text-sm font-medium"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="password" className="text-xs font-bold text-slate-900">
                                Password
                            </Label>
                            <Link
                                href="/forgot-password"
                                className="text-xs font-bold text-[#35877D] hover:text-[#2c6f66] hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                autoComplete="current-password"
                                disabled={loading}
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 pr-10 h-11 bg-slate-50 border-slate-200 text-slate-900 focus-visible:ring-[#35877D] focus-visible:border-[#35877D] rounded-xl text-xs sm:text-sm font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer border-0 mt-2 transition-all"
                    >
                        {loading ? (
                            <>
                                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                <span>Authenticating Admin...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign in to Admin Console</span>
                                <ArrowRight size={15} />
                            </>
                        )}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
