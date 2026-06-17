"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Sparkles, ArrowRight, Users, Zap, Bot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await fetch(`/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (data.status) {
                login(data.data.access_token, {
                    id: data.data.user_id,
                    tenant_id: data.data.tenant_id,
                    name: data.data.name,
                    email: data.data.email,
                    role: data.data.role,
                });
            } else {
                setError(data.message || "Failed to log in.");
            }
        } catch (err) {
            setError("Unable to connect to authentication server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#143d27] font-sans flex flex-col relative overflow-hidden">
            {/* Background Decorative Glow Elements */}
            <div className="absolute top-24 right-[-10%] w-[500px] h-[500px] bg-radial-gradient from-[#35877D]/5 via-[#35877D]/1 to-transparent -z-10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-24 left-[-10%] w-[400px] h-[400px] bg-radial-gradient from-[#D99B26]/4 via-[#D99B26]/1 to-transparent -z-10 rounded-full blur-2xl pointer-events-none"></div>

            {/* Header */}
            <LandingHeader />

            <main className="flex-1 pt-40 pb-28 flex items-center justify-center z-10">
                <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">

                        {/* Left Side: Product Highlights (Simple Light Premium Background) */}
                        <div className="lg:col-span-7 flex flex-col justify-between bg-gradient-to-br from-white via-slate-50/80 to-[#35877D]/5 border border-[#35877D]/10 p-8 md:p-12 lg:p-16 text-[#143d27] rounded-3xl min-h-[500px] shadow-sm relative">
                            {/* Inner Top Content */}
                            <div>
                                {/* Core Marketing Copy */}
                                <div className="space-y-4 max-w-xl">
                                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0B2E1E] leading-tight">
                                        Turn WhatsApp Chats Into <span className="text-[#D99B26]">Qualified CRM Leads Automatically.</span>
                                    </h1>
                                    <p className="text-sm text-gray-550 leading-relaxed font-semibold">
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
                                    <p className="text-[10px] font-extrabold text-[#35877D] uppercase tracking-wider">Trusted Meta Partner</p>
                                    <p className="text-xs text-gray-550 font-bold mt-0.5">Secure, reliable APIs compliant with WhatsApp policy</p>
                                </div>
                                <div className="flex items-center gap-1 bg-white border border-gray-150 px-3.5 py-1.5 rounded-full shadow-xs text-xs font-bold text-[#0B2E1E]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span>Meta Verified Portal</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Sign In Form */}
                        <div className="lg:col-span-5 flex flex-col justify-center items-center">
                            {/* SaaS Sign In Card */}
                            <Card className="w-full max-w-md bg-white/95 backdrop-blur-md border border-[#EAE6DF] shadow-2xl rounded-3xl overflow-hidden p-6 md:p-8 lg:p-10 space-y-6">
                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl font-black tracking-tight text-[#0B2E1E]">Sign in to Connectly360</h2>
                                    <p className="text-sm text-gray-550 font-semibold">Welcome back! Please sign in to continue.</p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-3.5 text-xs font-semibold text-center">
                                        {error}
                                    </div>
                                )}

                                {/* Google SSO Button */}
                                <Button
                                    variant="outline"
                                    className="w-full justify-center gap-2 border-gray-250 text-gray-700 font-bold hover:bg-gray-50 h-11.5 rounded-xl transition-all shadow-xs"
                                    onClick={() => router.push("/dashboard")}
                                >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                                        <g transform="matrix(1, 0, 0, 1, 0, 0)">
                                            <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4C21.68,11.83 21.56,11.43 21.35,11.1z" fill="#4285F4" />
                                            <path d="M12,21c2.43,0 4.47,-0.8 5.96,-2.18l-3.3,-2.57c-0.9,0.6 -2.07,0.97 -3.3,0.97 -2.34,0 -4.33,-1.58 -5.04,-3.7L2.92,16.3c1.5,2.98 4.6,5 8.2,5z" fill="#34A853" />
                                            <path d="M6.96,13.57C6.78,13.04 6.68,12.48 6.68,11.9c0,-0.58 0.1,-1.14 0.28,-1.67L3.63,7.57C3.01,8.8 2.68,10.2 2.68,11.9c0,1.7 0.33,3.1 0.95,4.33z" fill="#FBBC05" />
                                            <path d="M12,5.27c1.3,0 2.48,0.45 3.4,1.33L17.5,4.5C16.03,3.12 14,2.27 12,2.27c-3.6,0 -6.7,2.02 -8.2,5l3.7,2.83c0.7,-2.12 2.7,-3.7 5.04,-3.7z" fill="#EA4335" />
                                        </g>
                                    </svg>
                                    Continue with Google
                                </Button>

                                {/* Divider */}
                                <div className="relative flex py-1 items-center">
                                    <div className="flex-grow border-t border-gray-150"></div>
                                    <span className="flex-shrink mx-4 text-xs text-gray-400 font-extrabold uppercase tracking-wider">or</span>
                                    <div className="flex-grow border-t border-gray-150"></div>
                                </div>

                                {/* Sign In Form */}
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label htmlFor="email" className="text-xs font-bold text-[#0B2E1E] uppercase tracking-wider">
                                            Email address
                                        </label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            disabled={isLoading}
                                            placeholder="name@company.com"
                                            className="h-11 border-gray-200 focus-visible:ring-[#35877D] focus-visible:border-[#35877D] rounded-xl bg-[#FAF8F5] font-semibold"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <label htmlFor="password" className="text-xs font-bold text-[#0B2E1E] uppercase tracking-wider">
                                                Password
                                            </label>
                                            <Link href="/forgot-password" className="text-xs font-bold text-[#35877D] hover:text-[#2c6f66] hover:underline cursor-pointer">
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            disabled={isLoading}
                                            placeholder="••••••••"
                                            className="h-11 border-gray-200 focus-visible:ring-[#35877D] focus-visible:border-[#35877D] rounded-xl bg-[#FAF8F5] font-semibold"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-[#35877D] hover:bg-[#2c6f66] text-white font-bold h-11.5 rounded-xl gap-1.5 cursor-pointer shadow-md transition-all mt-2"
                                    >
                                        {isLoading ? "Signing In..." : "Sign In"}
                                        {!isLoading && <ArrowRight size={16} />}
                                    </Button>
                                </form>

                                {/* Sign Up Link */}
                                <div className="text-center text-xs text-gray-500 font-medium">
                                    Don't have an account?{" "}
                                    <Link href="/register" className="text-[#35877D] font-extrabold hover:underline cursor-pointer">
                                        Sign up
                                    </Link>
                                </div>
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
                <h4 className="text-xs font-bold text-[#0B2E1E] tracking-tight">{title}</h4>
                <p className="text-[11px] text-gray-550 mt-1 leading-normal font-semibold">{description}</p>
            </div>
        </div>
    );
}
