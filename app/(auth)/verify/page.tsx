"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

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
            } catch (err) {
                setStatus("error");
                setMessage("Could not connect to the verification server. Please try again.");
            }
        };

        verifyEmail();
    }, [token, login]);

    return (
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-md text-center space-y-6 z-10">
            {/* Brand Logo Header */}
            <div className="flex justify-center items-center gap-2 mb-2">
                <img
                    src="/images/logo.png"
                    alt="Connectly360"
                    className="h-9 w-auto object-contain"
                />
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#35877D]/10 text-[#35877D] border border-[#35877D]/20">
                    Admin Console
                </span>
            </div>

            {/* Status Indicator */}
            <div className="flex justify-center">
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
            <div className="space-y-2">
                <h1 className="text-xl font-extrabold text-slate-900">
                    {status === "loading" && "Admin Email Verification"}
                    {status === "success" && "Verification Complete"}
                    {status === "error" && "Verification Failed"}
                </h1>
                <p className="text-xs text-slate-500 font-medium leading-relaxed px-4">
                    {message}
                </p>
            </div>

            {/* Action Buttons if Failed */}
            {status === "error" && (
                <div className="pt-4 flex flex-col gap-2">
                    <Button
                        onClick={() => router.push("/login")}
                        className="w-full h-11 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs font-bold shadow-sm"
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
        </div>
    );
}

export default function AdminVerifyPage() {
    return (
        <Suspense fallback={
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-md text-center space-y-4">
                <Loader2 size={32} className="animate-spin text-[#35877D] mx-auto" />
                <p className="text-xs font-semibold text-slate-500">Loading verification details...</p>
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
