"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export function LandingHeader() {
    const { isAuthenticated, user } = useAuth();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="w-full z-50 flex flex-col fixed top-0">
            {/* Top Webinar Banner */}
            <div className="bg-[#00382b] text-white py-2 px-4 text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-colors border-b border-emerald-950/20">
                <span>
                    <span className="text-[#ebd25b] font-bold">[Webinar]</span> Build & Deploy Your AI Agent on WhatsApp in Less than a Day.{" "}
                    <Link href="/register" className="underline hover:text-[#ebd25b] transition-colors ml-1">
                        Register Now
                    </Link>
                </span>
            </div>

            {/* Main Header */}
            <header className="bg-white border-b border-gray-100 shadow-xs h-20 flex items-center justify-between px-6 md:px-12 w-full">
                {/* Logo Section */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-1.5 group">
                        <svg className="w-8 h-8 text-[#35877D] transition-transform group-hover:scale-105" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 8V6a4 4 0 0 0-8 0v2H4v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8h-4zM9 6a3 3 0 0 1 6 0v2H9V6zm10 14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9h14v11z" />
                        </svg>
                        <span className="text-2xl font-black text-gray-900 tracking-tight">interakt</span>
                    </Link>
                </div>

                {/* Center Navigation Links */}
                <nav className="hidden lg:flex items-center gap-7">
                    <div className="relative group cursor-pointer py-2 flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-[#35877D] transition-colors">
                        <span>Products</span>
                        <ChevronDown size={14} className="text-gray-400 group-hover:text-[#35877D] transition-colors" />
                    </div>
                    <div className="relative group cursor-pointer py-2 flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-[#35877D] transition-colors">
                        <span>Solutions</span>
                        <ChevronDown size={14} className="text-gray-400 group-hover:text-[#35877D] transition-colors" />
                    </div>
                    <div className="relative group cursor-pointer py-2 flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-[#35877D] transition-colors">
                        <span>Integrations</span>
                        <ChevronDown size={14} className="text-gray-400 group-hover:text-[#35877D] transition-colors" />
                    </div>
                    <Link href="/pricing" className={`text-sm font-bold hover:text-[#35877D] transition-colors ${pathname === "/pricing" ? "text-[#35877D]" : "text-gray-700"}`}>
                        Pricing
                    </Link>
                    <Link href="/contact" className={`text-sm font-bold hover:text-[#35877D] transition-colors ${pathname === "/contact" ? "text-[#35877D]" : "text-gray-700"}`}>
                        Partnerships
                    </Link>
                    <div className="relative group cursor-pointer py-2 flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-[#35877D] transition-colors">
                        <span>Resources</span>
                        <ChevronDown size={14} className="text-gray-400 group-hover:text-[#35877D] transition-colors" />
                    </div>
                </nav>

                {/* Right Actions Menu */}
                <div className="hidden lg:flex items-center gap-6">
                    <Link href="/contact" className="text-sm font-bold text-gray-700 hover:text-[#35877D] transition-colors">
                        Demo
                    </Link>
                    {isAuthenticated ? (
                        <>
                            <span className="text-xs text-gray-500 font-semibold">Hello, {user?.name || "Admin"}</span>
                            <Button asChild className="rounded-full px-6 py-5.5 bg-[#35877D] hover:bg-[#2c6f66] text-white transition-all shadow-sm font-extrabold text-sm flex items-center gap-1.5">
                                <Link href="/dashboard">
                                    Dashboard <ArrowRight size={14} />
                                </Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-bold text-gray-700 hover:text-[#35877D] transition-colors">
                                Login
                            </Link>
                            <Button asChild className="rounded-full px-6 py-5.5 bg-[#35877D] hover:bg-[#2c6f66] text-white transition-all shadow-sm font-extrabold text-sm flex items-center gap-1.5">
                                <Link href="/register">
                                    Start Free Trial <ArrowRight size={14} />
                                </Link>
                            </Button>
                        </>
                    )}

                    {/* Language selector */}
                    <div className="flex items-center gap-1 cursor-pointer hover:opacity-85 text-sm font-bold text-gray-700 pl-2 border-l border-gray-200">
                        <span className="text-base">🇬🇧</span>
                        <span>EN</span>
                        <ChevronDown size={12} className="text-gray-400" />
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden text-gray-700 hover:text-[#35877D]"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-32 left-0 w-full bg-white border-b border-gray-100 p-6 flex flex-col gap-4 shadow-lg z-50">
                    <span className="text-base font-bold text-gray-700 p-2 border-b border-gray-50">Products</span>
                    <span className="text-base font-bold text-gray-700 p-2 border-b border-gray-50">Solutions</span>
                    <span className="text-base font-bold text-gray-700 p-2 border-b border-gray-50">Integrations</span>
                    <Link href="/pricing" className="text-base font-bold text-gray-700 p-2 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                    <Link href="/contact" className="text-base font-bold text-gray-700 p-2 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>Partnerships</Link>
                    <span className="text-base font-bold text-gray-700 p-2 border-b border-gray-50">Resources</span>

                    <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                        <Link href="/contact" className="text-center font-bold text-gray-700 p-2" onClick={() => setMobileMenuOpen(false)}>Demo</Link>
                        {isAuthenticated ? (
                            <Button asChild className="w-full bg-[#35877D] text-white font-extrabold rounded-full py-5">
                                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Link href="/login" className="text-center font-bold text-gray-700 p-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                                <Button asChild className="w-full bg-[#35877D] text-white font-extrabold rounded-full py-5">
                                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>Start Free Trial</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

