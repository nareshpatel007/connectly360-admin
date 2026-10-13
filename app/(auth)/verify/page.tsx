"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdminAuthSplitLayout } from "@/components/auth/AdminAuthSplitLayout";

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const { login } = useAuth();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your administrator account...");
    const verifiedRef = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification request: Missing token.");
            return;
        }

        if (verifiedRef.current) return;
        verifiedRef.current = true;

        const verifyEmail = async () => {
            try {
                const res = await fetch("/api/admin/auth/verification", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (data.status && data.data?.access_token) {
                    setStatus("success");
                    setMessage("Admin email verified successfully! Logging you in...");
                    setTimeout(() => {
                        login(data.data.access_token);
                    }, 1200);
                } else {
                    setStatus("error");
                    setMessage(data.message || "Failed to verify admin email. The token might be invalid or expired.");
                }
            } catch {
                setStatus("error");
                setMessage("Could not connect to the verification server. Please try again.");
            }
        };

        verifyEmail();
    }, [token, login]);

    return (
        <Card className="w-full bg-white border border-slate-200/90 shadow-xl shadow-slate-200/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-5 text-center">
            {/* Status Indicator */}
            <div className="flex justify-center pt-2">
                {status === "loading" && (
                    <div className="h-14 w-14 rounded-2xl bg-[#35877D]/10 flex items-center justify-center text-[#35877D]">
                        <Loader2 size={32} className="animate-spin" />
                    </div>
                )}
                {status === "success" && (
                    <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                        <CheckCircle size={32} />
                    </div>
                )}
                {status === "error" && (
                    <div className="h-14 w-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600">
                        <XCircle size={32} />
                    </div>
                )}
            </div>

            {/* Status Message Text */}
            <div className="space-y-1.5">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {status === "loading" && "Admin Email Verification"}
                    {status === "success" && "Verification Complete"}
                    {status === "error" && "Verification Failed"}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                    {message}
                </p>
            </div>

            {/* Action Buttons if Failed */}
            {status === "error" && (
                <div className="pt-2 flex flex-col gap-2">
                    <Button
                        onClick={() => router.push("/login")}
                        className="w-full h-11 bg-[#35877D] hover:bg-[#2b7068] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm"
                    >
                        Back to Admin Sign In
                    </Button>
                </div>
            )}

            {status === "success" && (
                <div className="pt-2 text-xs font-bold text-[#35877D] animate-pulse">
                    Redirecting to Admin Dashboard...
                </div>
            )}
        </Card>
    );
}

export default function AdminVerifyPage() {
    return (
        <AdminAuthSplitLayout>
            <Suspense
                fallback={
                    <Card className="w-full bg-white border border-slate-200 shadow-sm rounded-2xl sm:rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px] space-y-3">
                        <Loader2 className="animate-spin text-[#35877D]" size={32} />
                        <p className="text-xs font-semibold text-slate-500">Loading verification details...</p>
                    </Card>
                }
            >
                <VerifyContent />
            </Suspense>
        </AdminAuthSplitLayout>
    );
}
