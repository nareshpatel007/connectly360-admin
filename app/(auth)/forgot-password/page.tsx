"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertCircle, ArrowLeft, Loader2, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminAuthSplitLayout } from "@/components/auth/AdminAuthSplitLayout";
import { AuthInput } from "@/components/auth/AuthInput";

export default function AdminForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        if (!email.trim()) {
            setEmailError("Administrator email is required.");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setEmailError("Please enter a valid email address.");
            return false;
        }
        setEmailError(null);
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validate()) {
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await res.json();

            if (data.status) {
                setSubmitted(true);
            } else {
                setError(data.message || "Unable to send password recovery instructions. Please ensure the email is registered.");
            }
        } catch {
            setError("Connection failure. Unable to reach authentication server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminAuthSplitLayout>
            <Card className="w-full bg-white border border-slate-200/90 shadow-xl shadow-slate-200/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-5">
                {!submitted ? (
                    <>
                        {/* Header */}
                        <div className="space-y-1 text-left">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2"
                            >
                                <ArrowLeft size={14} />
                                <span>Back to Sign In</span>
                            </Link>
                            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                                Reset Admin Password
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">
                                Enter your administrator account email to receive recovery instructions.
                            </p>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div
                                role="alert"
                                aria-live="polite"
                                className="flex items-start gap-2.5 p-3.5 bg-rose-50/90 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium leading-relaxed animate-in fade-in duration-200"
                            >
                                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                                <div className="flex-1">{error}</div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                            <AuthInput
                                id="admin-email"
                                label="Administrator Email"
                                type="email"
                                required
                                autoComplete="email"
                                disabled={isLoading}
                                placeholder="admin@connectly360.com"
                                value={email}
                                error={emailError}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (emailError) setEmailError(null);
                                }}
                            />

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#35877D] hover:bg-[#2b7068] active:scale-[0.99] text-white font-semibold h-11 rounded-xl gap-2 cursor-pointer shadow-sm shadow-[#35877D]/25 transition-all text-xs sm:text-sm mt-1 focus-visible:ring-2 focus-visible:ring-[#35877D]/40"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin shrink-0" size={16} />
                                        <span>Dispatching Reset Email...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Recovery Instructions</span>
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="text-center pt-3 border-t border-slate-100">
                            <span className="text-xs text-slate-500">Remember your credentials? </span>
                            <Link href="/login" className="text-xs font-bold text-[#35877D] hover:underline">
                                Return to Sign In
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="text-center space-y-4 py-2 animate-in fade-in zoom-in-95 duration-200">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-[#35877D] border border-emerald-200 shadow-sm">
                            <CheckCircle2 size={28} />
                        </div>
                        <div className="space-y-1.5">
                            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                                Recovery Email Dispatched
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                                If an active administrator account exists for{" "}
                                <strong className="text-slate-900 font-bold">{email}</strong>, you will receive a secure password reset link shortly.
                            </p>
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs text-slate-600 space-y-1">
                            <p className="font-semibold text-slate-800">Next Steps:</p>
                            <ul className="list-disc list-inside text-[11px] text-slate-500 space-y-0.5">
                                <li>Check your inbox and spam folder.</li>
                                <li>Follow the secure link within 60 minutes.</li>
                            </ul>
                        </div>

                        <div className="pt-2 space-y-2">
                            <Button
                                onClick={() => setSubmitted(false)}
                                variant="outline"
                                className="w-full h-10 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl text-xs"
                            >
                                Try a different email
                            </Button>

                            <Link
                                href="/login"
                                className="block w-full text-center text-xs font-bold text-[#35877D] hover:underline py-2"
                            >
                                Return to Administrator Sign In
                            </Link>
                        </div>
                    </div>
                )}
            </Card>
        </AdminAuthSplitLayout>
    );
}
