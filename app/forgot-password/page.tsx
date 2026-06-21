"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Sparkles, ArrowRight, CheckCircle2, Bot, Users, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await fetch(`/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.status) {
                setSubmitted(true);
            } else {
                setError(data.message || "Failed to submit reset request.");
            }
        } catch (err) {
            setError("Unable to connect to authentication server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col relative overflow-hidden">
            {/* Background Decorative Glow Elements */}
            <div className="absolute top-24 right-[-10%] w-[500px] h-[500px] bg-radial-gradient from-[#35877D]/5 via-[#35877D]/1 to-transparent -z-10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-24 left-[-10%] w-[400px] h-[400px] bg-radial-gradient from-[#35877D]/4 via-[#35877D]/1 to-transparent -z-10 rounded-full blur-2xl pointer-events-none"></div>

            {/* Header */}
            <LandingHeader />

            <main className="flex-1 pt-40 pb-14 md:pb-10 flex items-center justify-center z-10">
                <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">

                        {/* Left Side: Product Highlights (Simple White Premium Background) */}
                        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between bg-white border border-[#35877D]/10 p-8 md:p-12 lg:p-16 text-slate-800 rounded-3xl min-h-[500px] shadow-sm relative">
                            {/* Inner Top Content */}
                            <div>
                                {/* Core Marketing Copy */}
                                <div className="space-y-4 max-w-xl">
                                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                                        Turn WhatsApp Chats Into <span className="text-[#35877D]">Qualified CRM Leads Automatically.</span>
                                    </h1>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                        Connectly360 natively integrates your entire sales and support pipeline, automating standard inquiries to save your team hours of work.
                                    </p>
                                </div>

                                {/* Feature list */}
                                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                                    <FeatureRow
                                        icon={MessageSquare}
                                        title="WhatsApp Integration"
                                        description="Official Meta WhatsApp API integrations"
                                    />
                                    <FeatureRow
                                        icon={Bot}
                                        title="AI Chatbot Agent"
                                        description="Smart 24/7 support Trained on your data"
                                    />
                                    <FeatureRow
                                        icon={Users}
                                        title="CRM Pipeline"
                                        description="Organize leads and track directories"
                                    />
                                    <FeatureRow
                                        icon={Zap}
                                        title="Workflows Engine"
                                        description="No-code visual automation builder"
                                    />
                                </div>
                            </div>

                            {/* Trust Badge Strip */}
                            <div className="border-t border-[#35877D]/10 pt-6 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-medium text-[#35877D] uppercase tracking-wider">Trusted Meta Partner</p>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">Secure, reliable APIs compliant with WhatsApp policy</p>
                                </div>
                                <div className="flex items-center gap-1 bg-white border border-gray-150 px-3.5 py-1.5 rounded-full shadow-xs text-xs font-bold text-slate-900">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span>Meta Verified Portal</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Forgot Password Form */}
                        <div className="lg:col-span-5 flex flex-col justify-center items-center">
                            {/* Reset Password Card */}
                            <Card className="w-full max-w-md bg-white border border-slate-200 shadow-md rounded-3xl overflow-hidden p-6 md:p-8 lg:p-10 space-y-6">

                                {!submitted ? (
                                    <>
                                        <div className="text-center space-y-2">
                                            <h2 className="text-2xl font-black tracking-tight text-slate-900">Forgot Password?</h2>
                                            <p className="text-sm text-slate-500 leading-normal font-semibold">
                                                Enter your email address and we'll send you a link to reset your password.
                                            </p>
                                        </div>

                                        {error && (
                                            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-3.5 text-xs font-semibold text-center">
                                                {error}
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div className="space-y-1.5">
                                                <label htmlFor="email" className="text-xs font-bold text-slate-900">
                                                    Email Address
                                                </label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    disabled={isLoading}
                                                    placeholder="name@company.com"
                                                    className="h-11 border-gray-200 focus-visible:ring-[#35877D] focus-visible:border-[#35877D] rounded-md bg-slate-50 font-semibold"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full bg-[#35877D] hover:bg-[#2c6f66] text-white font-bold h-11.5 rounded-xl gap-1.5 shadow-md transition-all mt-2"
                                            >
                                                {isLoading ? "Sending..." : "Send Reset Link"}
                                                {!isLoading && <ArrowRight size={16} />}
                                            </Button>
                                        </form>

                                        <div className="text-center text-xs">
                                            <Link href="/login" className="text-[#35877D] font-extrabold hover:underline">
                                                Back to sign in
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center space-y-5 py-4">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-[#35877D] border border-emerald-100">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Reset Link Sent!</h2>
                                            <p className="text-sm text-slate-500 leading-normal max-w-sm mx-auto font-semibold">
                                                We've emailed a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
                                            </p>
                                        </div>
                                        <Button onClick={() => setSubmitted(false)} className="w-full bg-[#35877D] hover:bg-[#2c6f66] text-white font-bold h-11">
                                            Resend Email
                                        </Button>
                                        <div className="text-xs">
                                            <Link href="/login" className="text-[#35877D] font-extrabold hover:underline">
                                                Back to sign in
                                            </Link>
                                        </div>
                                    </div>
                                )}

                            </Card>
                        </div>

                    </div>
                </div>
            </main>

            {/* Footer */}
            <LandingFooter />
        </div>
    );
}

function FeatureRow({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
    return (
        <div className="flex gap-3.5 p-3.5 rounded-2xl hover:bg-white/60 transition-all duration-300 border border-transparent hover:border-gray-100 hover:shadow-xs group">
            <div className="flex-shrink-0 flex h-9.5 w-9.5 items-center justify-center rounded-xl bg-[#35877D]/10 text-[#35877D] border border-[#35877D]/15 transition-transform group-hover:scale-105">
                <Icon size={16} />
            </div>
            <div>
                <h4 className="text-sm font-semibold text-slate-900 tracking-tight">{title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-normal font-medium">{description}</p>
            </div>
        </div>
    );
}
