"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageSquare, ArrowRight, Users, Zap, Bot, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await fetch("https://crmapi.sandboxtechnology.in/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (data.status) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                setError(data.message || "Failed to create account.");
            }
        } catch (err) {
            setError("Unable to connect to registration server.");
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

                {/* Footer Badges & Tilted Graphics */}
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

            {/* Right Panel: Sign Up Form (Ivory/Cream) */}
            <div className="flex flex-col items-center justify-center flex-grow p-8 relative">

                {/* SaaS Sign Up Card */}
                <Card className="w-full max-w-md bg-white border border-[#EAE6DF] shadow-xl rounded-2xl overflow-hidden p-6 md:p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight text-[#0B2E1E]">Create your account</h2>
                        <p className="text-sm text-gray-500">Get started with Connectly360 today.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 text-xs font-semibold text-center">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-3.5 text-xs font-semibold text-center">
                            Account created successfully! Redirecting to login...
                        </div>
                    )}

                    {/* Google SSO Button */}
                    <Button
                        variant="outline"
                        className="w-full justify-center gap-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 h-11"
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
                        Sign up with Google
                    </Button>

                    {/* Divider */}
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-xs text-gray-400 font-medium">or</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="name" className="text-xs font-semibold text-[#0B2E1E] uppercase tracking-wider">
                                Full Name
                            </label>
                            <Input
                                id="name"
                                type="text"
                                required
                                disabled={isLoading || success}
                                placeholder="Enter your full name"
                                className="h-11 border-gray-200 focus-visible:ring-emerald-700 bg-[#FAF8F5]"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-xs font-semibold text-[#0B2E1E] uppercase tracking-wider">
                                Email address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                required
                                disabled={isLoading || success}
                                placeholder="Enter your email address"
                                className="h-11 border-gray-200 focus-visible:ring-emerald-700 bg-[#FAF8F5]"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="text-xs font-semibold text-[#0B2E1E] uppercase tracking-wider">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                required
                                disabled={isLoading || success}
                                placeholder="Create a secure password"
                                className="h-11 border-gray-200 focus-visible:ring-emerald-700 bg-[#FAF8F5]"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || success}
                            className="w-full bg-[#1B633E] hover:bg-[#12452A] text-white font-medium h-11 gap-1.5"
                        >
                            {isLoading ? "Creating Account..." : success ? "Account Created!" : "Create Account"}
                            {!isLoading && !success && <ArrowRight size={16} />}
                        </Button>
                    </form>

                    {/* Sign In Link */}
                    <div className="text-center text-xs text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[#1B633E] font-semibold hover:underline">
                            Sign in
                        </Link>
                    </div>

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
