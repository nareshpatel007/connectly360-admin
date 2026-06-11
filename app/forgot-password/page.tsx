"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Sparkles, TrendingUp, Shield, HelpCircle, ArrowRight, CheckCircle2, Users, Zap, Bot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
            const res = await fetch("https://crmapi.sandboxtechnology.in/api/auth/forgot-password", {
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
        <div className="flex min-h-screen w-full flex-col md:flex-row bg-[#FAF8F5] text-[#143d27] font-sans">

            {/* Left Panel: Product Highlights (Forest Green) */}
            <div className="flex flex-col justify-between w-full md:w-[48%] bg-[#0B2E1E] p-8 md:p-12 text-[#E2EBE5] relative overflow-hidden shrink-0">

                {/* Top Header Logo */}
                <div className="flex items-center gap-2">
                    <img src="/images/logo-white.png" alt="Connectly360 Logo" className="h-16 w-auto object-contain" />
                </div>

                {/* Core Marketing Copy */}
                <div className="my-auto py-12 md:py-0 space-y-8 max-w-lg z-10">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                            Smart Conversations.<br />
                            <span className="text-[#D99B26]">Simplified.</span>
                        </h1>
                        <p className="text-base text-gray-300 leading-relaxed">
                            Connect WhatsApp, automate replies, capture leads, and grow your business with AI-powered customer engagement.
                        </p>
                    </div>

                    {/* Feature list */}
                    <div className="space-y-6">
                        <FeatureRow
                            icon={MessageSquare}
                            title="WhatsApp Integration"
                            description="Official Meta WhatsApp API for reliable customer messaging"
                        />
                        <FeatureRow
                            icon={Bot}
                            title="AI Chatbot"
                            description="Smart 24/7 automated support to qualify leads & answer FAQs"
                        />
                        <FeatureRow
                            icon={Users}
                            title="CRM"
                            description="Track contacts, pipelines, and chat history in one dashboard"
                        />
                        <FeatureRow
                            icon={Zap}
                            title="Automation"
                            description="Build workflows, bulk templates, and automated alerts"
                        />
                    </div>
                </div>

                {/* Footer Badges */}
                <div className="flex flex-wrap gap-2 text-[11px] text-gray-300 z-10">
                    <span className="bg-[#123E28] px-3 py-1.5 rounded-full border border-emerald-950">For SMBs & Enterprises</span>
                    <span className="bg-[#123E28] px-3 py-1.5 rounded-full border border-emerald-950">Official WhatsApp API</span>
                    <span className="bg-[#123E28] px-3 py-1.5 rounded-full border border-emerald-950">AI Assistant</span>
                    <span className="bg-[#123E28] px-3 py-1.5 rounded-full border border-emerald-950">Secure & Reliable</span>
                </div>

                {/* Tilted Graphic (Mock card in background) */}
                <div className="absolute right-[-10%] bottom-[-5%] w-[320px] h-[180px] bg-[#14532D] border border-emerald-800 rounded-2xl rotate-[-12deg] shadow-2xl opacity-40 p-4 flex flex-col justify-between hidden md:flex">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center">
                                <MessageSquare size={14} className="text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-white font-medium">WhatsApp Business</p>
                                <p className="text-[10px] text-emerald-300">Auto-Responder</p>
                            </div>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <div className="w-full h-2 bg-[#0C321B] rounded-full" />
                        <div className="w-3/4 h-2 bg-[#0C321B] rounded-full" />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-emerald-200">
                        <span>Verified Integration</span>
                        <span className="text-[#D99B26]">Active</span>
                    </div>
                </div>

            </div>

            {/* Right Panel: Sign In Form (Ivory/Cream) */}
            <div className="flex flex-col items-center justify-center flex-grow p-8 relative">

                {/* Reset Password Card */}
                <Card className="w-full max-w-md bg-white border border-[#EAE6DF] shadow-xl rounded-2xl overflow-hidden p-6 md:p-8 space-y-6">

                    {!submitted ? (
                        <>
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold tracking-tight text-[#0B2E1E]">Forgot Password?</h2>
                                <p className="text-sm text-gray-500 leading-normal">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 text-xs font-semibold text-center">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label htmlFor="email" className="text-xs font-semibold text-[#0B2E1E] uppercase tracking-wider">
                                        Email address
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        disabled={isLoading}
                                        placeholder="Enter your registered email"
                                        className="h-11 border-gray-200 focus-visible:ring-emerald-700 bg-[#FAF8F5]"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#1B633E] hover:bg-[#12452A] text-white font-medium h-11 gap-1.5"
                                >
                                    {isLoading ? "Sending..." : "Send Reset Link"}
                                    {!isLoading && <ArrowRight size={16} />}
                                </Button>
                            </form>

                            <div className="text-center text-xs">
                                <Link href="/login" className="text-[#1B633E] font-semibold hover:underline">
                                    Back to sign in
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center space-y-5 py-4">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-[#1B633E] border border-emerald-100">
                                <CheckCircle2 size={24} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold tracking-tight text-[#0B2E1E]">Reset Link Sent!</h2>
                                <p className="text-sm text-gray-500 leading-normal max-w-sm mx-auto">
                                    We've emailed a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
                                </p>
                            </div>
                            <Button onClick={() => setSubmitted(false)} className="w-full bg-[#1B633E] hover:bg-[#12452A] text-white font-medium h-11">
                                Resend Email
                            </Button>
                            <div className="text-xs">
                                <Link href="/login" className="text-[#1B633E] font-semibold hover:underline">
                                    Back to sign in
                                </Link>
                            </div>
                        </div>
                    )}

                </Card>

                {/* Bottom Right Promo Badge */}
                <div className="absolute right-6 bottom-6 hidden md:flex items-center gap-1.5 bg-[#F2EDE2] border border-gray-200/50 text-xs px-3.5 py-2 rounded-full cursor-pointer hover:bg-[#eae3d5] transition shadow-sm font-semibold">
                    <HelpCircle size={14} className="text-gray-500" />
                    <span>Build yours free</span>
                    <ArrowRight size={12} className="text-gray-500" />
                </div>

            </div>

        </div>
    );
}

function FeatureRow({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-[#14532D]/40 text-[#D99B26] border border-emerald-800/20">
                <Icon size={18} />
            </div>
            <div>
                <h4 className="text-sm font-bold text-white">{title}</h4>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}
