"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await fetch(`/api/admin/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.status) {
                setSubmitted(true);
            } else {
                setError(data.message || "Failed to submit password reset request.");
            }
        } catch (err) {
            setError("Unable to connect to authentication server.");
        } finally {
            setIsLoading(false);
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
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#35877D]/10 text-[#35877D] border border-[#35877D]/20">
                        Admin Console
                    </span>
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Reset Admin Password
                    </h1>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                        Enter your admin account email to receive a password reset link.
                    </p>
                </div>
            </div>

            {/* Reset Card */}
            <Card className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-md space-y-5">
                {!submitted ? (
                    <>
                        {error && (
                            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-bold text-slate-900">
                                    Admin Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    disabled={isLoading}
                                    placeholder="admin@connectly360.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11 bg-slate-50 border-slate-200 text-slate-900 focus-visible:ring-[#35877D] focus-visible:border-[#35877D] rounded-xl text-xs sm:text-sm font-medium"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer border-0 transition-all mt-2"
                            >
                                {isLoading ? "Sending Link..." : "Send Password Reset Link"}
                                {!isLoading && <ArrowRight size={15} />}
                            </Button>
                        </form>

                        <div className="text-center pt-2 border-t border-slate-100">
                            <Link href="/login" className="text-xs font-bold text-[#35877D] hover:underline">
                                Return to Admin Sign In
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="text-center space-y-4 py-3">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-[#35877D] border border-emerald-200">
                            <CheckCircle2 size={24} />
                        </div>
                        <div className="space-y-1.5">
                            <h2 className="text-lg font-bold text-slate-900">Reset Link Sent</h2>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                We sent a reset link to <strong className="text-slate-800">{email}</strong>. Please check your inbox and spam folder.
                            </p>
                        </div>
                        <Button
                            onClick={() => setSubmitted(false)}
                            variant="outline"
                            className="w-full h-10 border-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                        >
                            Resend Email
                        </Button>
                        <div className="pt-2">
                            <Link href="/login" className="text-xs font-bold text-[#35877D] hover:underline">
                                Return to Admin Sign In
                            </Link>
                        </div>
                    </div>
                )}
            </Card>

            <p className="text-center text-[11px] text-slate-400 font-medium">
                Authorized Connectly360 administrators only.
            </p>
        </div>
    );
}
