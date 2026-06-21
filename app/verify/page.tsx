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
    const [message, setMessage] = useState("Verifying your email address...");
    const verifiedRef = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification request: Missing token.");
            return;
        }

        // Use a ref to prevent double calls in React StrictMode
        if (verifiedRef.current) return;
        verifiedRef.current = true;

        const verifyEmail = async () => {
            try {
                const res = await fetch("/api/auth/verification", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (data.status) {
                    setStatus("success");
                    setMessage("Email verified successfully! Logging you in...");

                    // Perform secure autologin
                    setTimeout(() => {
                        login(data.data.access_token);
                    }, 1500);
                } else {
                    setStatus("error");
                    setMessage(data.message || "Failed to verify email. The token might have expired.");
                }
            } catch (err) {
                setStatus("error");
                setMessage("Could not connect to the verification server. Please try again.");
            }
        };

        verifyEmail();
    }, [token, login]);

    return (
        <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white border border-[#EAE6DF] rounded-3xl p-8 shadow-sm text-center space-y-6">

                {/* Brand Logo Header */}
                <div className="flex justify-center mb-2">
                    <img
                        src="https://connectly360.sandboxtechnology.in/images/logo.png"
                        alt="Connectly360"
                        className="h-10 w-auto object-contain"
                    />
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
                        {status === "loading" && "Email Verification"}
                        {status === "success" && "Verification Complete"}
                        {status === "error" && "Verification Failed"}
                    </h1>
                    <p className="text-sm text-slate-500 font-semibold leading-relaxed px-4">
                        {message}
                    </p>
                </div>

                {/* Action Buttons if Failed */}
                {status === "error" && (
                    <div className="pt-4 flex flex-col gap-2">
                        <Button
                            onClick={() => router.push("/login")}
                            className="w-full h-11 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-sm font-bold shadow-sm"
                        >
                            Back to Sign In
                        </Button>
                        <Button
                            onClick={() => router.push("/")}
                            variant="outline"
                            className="w-full h-11 border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700"
                        >
                            Go to Homepage
                        </Button>
                    </div>
                )}

                {status === "success" && (
                    <div className="pt-2 text-xs font-bold text-[#35877D] animate-pulse">
                        Redirecting to workspace...
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 size={32} className="animate-spin text-[#35877D]" />
                    <p className="text-xs font-semibold text-gray-550">Loading verification details...</p>
                </div>
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
