"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
            setError("Server connection failed. Please check network/API status.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-slate-950 p-4 font-sans selection:bg-[#35877D] selection:text-white">
            <div className="w-full max-w-md space-y-6">
                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#35877D]/10 border border-[#35877D]/30 text-[#35877D] shadow-lg mb-2">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Connectly360 Admin</h1>
                    <p className="text-xs text-slate-400 font-medium">Platform Management & System Operations Console</p>
                </div>

                <Card className="p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-6">
                    {error && (
                        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-semibold flex items-start gap-2.5">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-bold text-slate-300">Admin Email</Label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="admin@connectly360.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 h-11 bg-slate-950 border-slate-800 text-slate-100 rounded-xl focus:border-[#35877D] text-xs font-semibold"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-xs font-bold text-slate-300">Password</Label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 h-11 bg-slate-950 border-slate-800 text-slate-100 rounded-xl focus:border-[#35877D] text-xs font-semibold"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer border-0 mt-2"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    <span>Authenticating Admin...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In to Admin Portal</span>
                                    <ArrowRight size={14} />
                                </>
                            )}
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-[11px] text-slate-500 font-medium">
                    Protected System Area • Unauthorized Access Monitored &amp; Logged
                </p>
            </div>
        </div>
    );
}
