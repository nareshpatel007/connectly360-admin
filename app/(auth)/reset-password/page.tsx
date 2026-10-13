"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminAuthSplitLayout } from "@/components/auth/AdminAuthSplitLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthPasswordInput } from "@/components/auth/AuthPasswordInput";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [fieldErrors, setFieldErrors] = useState<{ token?: string; password?: string; confirm?: string }>({});
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const queryToken = searchParams.get("token");
        if (queryToken) {
            setToken(queryToken);
        }
    }, [searchParams]);

    const validate = () => {
        const errors: { token?: string; password?: string; confirm?: string } = {};

        if (!token.trim()) {
            errors.token = "Password reset verification token is required.";
        }

        if (!password) {
            errors.password = "New password is required.";
        } else if (password.length < 8) {
            errors.password = "Password must be at least 8 characters long.";
        }

        if (password !== passwordConfirmation) {
            errors.confirm = "Passwords do not match.";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validate()) {
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: token.trim(),
                    password,
                }),
            });

            const data = await res.json();

            if (data.status) {
                setIsSuccess(true);
            } else {
                setError(data.message || "Invalid or expired reset token. Please request a new link.");
            }
        } catch {
            setError("Connection failure. Unable to contact password reset service.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full bg-white border border-slate-200/90 shadow-xl shadow-slate-200/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-5">
            {!isSuccess ? (
                <>
                    {/* Header */}
                    <div className="space-y-1 text-left">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-50 border border-teal-200/60 text-[#35877D] text-[11px] font-bold uppercase tracking-wider mb-1">
                            Credential Update
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                            Create New Admin Password
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                            Enter your reset token and define a strong new password.
                        </p>
                    </div>

                    {/* Error Banner */}
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

                    <form onSubmit={handleReset} className="space-y-4" noValidate>
                        {/* Token Input if not prefilled */}
                        <AuthInput
                            id="reset-token"
                            label="Reset Security Token"
                            type="text"
                            required
                            disabled={isLoading}
                            placeholder="Paste token received in email"
                            value={token}
                            error={fieldErrors.token}
                            onChange={(e) => {
                                setToken(e.target.value);
                                if (fieldErrors.token) {
                                    setFieldErrors((prev) => ({ ...prev, token: undefined }));
                                }
                            }}
                        />

                        {/* New Password */}
                        <AuthPasswordInput
                            id="new-password"
                            label="New Administrator Password"
                            required
                            autoComplete="new-password"
                            disabled={isLoading}
                            placeholder="At least 8 characters"
                            value={password}
                            error={fieldErrors.password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (fieldErrors.password) {
                                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                                }
                            }}
                        />

                        {/* Confirm Password */}
                        <AuthPasswordInput
                            id="confirm-password"
                            label="Confirm New Password"
                            required
                            autoComplete="new-password"
                            disabled={isLoading}
                            placeholder="Repeat new password"
                            value={passwordConfirmation}
                            error={fieldErrors.confirm}
                            onChange={(e) => {
                                setPasswordConfirmation(e.target.value);
                                if (fieldErrors.confirm) {
                                    setFieldErrors((prev) => ({ ...prev, confirm: undefined }));
                                }
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
                                    <span>Updating Password...</span>
                                </>
                            ) : (
                                <>
                                    <span>Reset Password & Sign In</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="text-center pt-3 border-t border-slate-100">
                        <Link href="/login" className="text-xs font-bold text-[#35877D] hover:underline">
                            Return to Administrator Sign In
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
                            Password Successfully Reset
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                            Your administrator password has been updated. You can now authenticate with your new credentials.
                        </p>
                    </div>

                    <div className="pt-2">
                        <Button
                            onClick={() => router.push("/login")}
                            className="w-full h-11 bg-[#35877D] hover:bg-[#2b7068] text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm"
                        >
                            Proceed to Admin Sign In
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
}

export default function AdminResetPasswordPage() {
    return (
        <AdminAuthSplitLayout>
            <Suspense
                fallback={
                    <Card className="w-full bg-white border border-slate-200 shadow-sm rounded-2xl sm:rounded-3xl p-8 flex flex-col items-center justify-center min-h-[360px] space-y-3">
                        <Loader2 className="animate-spin text-[#35877D]" size={32} />
                        <p className="text-xs font-semibold text-slate-500">Loading password reset form...</p>
                    </Card>
                }
            >
                <ResetPasswordContent />
            </Suspense>
        </AdminAuthSplitLayout>
    );
}
