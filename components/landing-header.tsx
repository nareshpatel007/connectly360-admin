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
            <div className="bg-[#00382b] text-white py-2.5 px-4 text-xs font-normal text-center flex items-center justify-center gap-1.5 transition-colors border-b border-emerald-950/20">
                <span>
                    Start Sending Bulk Campaigns Today! 🎉{" "}
                    <Link href="/pricing" className="underline hover:text-[#ebd25b] transition-colors ml-1">
                        Pay ₹999 & Get 500 Messages Free.
                    </Link>
                </span>
            </div>

            {/* Main Header */}
            <header className="bg-white border-b border-gray-100 shadow-xs h-20 flex items-center justify-between px-6 md:px-12 w-full">
                {/* Logo Section */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 group">
                        <img src="/images/logo.png" alt="Connectly360 Logo" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
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
                    <Link href="/blog" className={`text-sm font-bold hover:text-[#35877D] transition-colors ${pathname.startsWith("/blog") ? "text-[#35877D]" : "text-gray-700"}`}>
                        Blog
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
                <div className="hidden lg:flex items-center gap-2">
                    {isAuthenticated ? (
                        <>
                            <Button asChild variant="outline" size="sm" className="rounded-full px-4 py-2 h-9 border-[#35877D] text-[#35877D] hover:bg-[#EAF7F2] hover:text-[#2c6f66] bg-transparent transition-all font-extrabold text-xs">
                                <Link href="/contact">
                                    Need Help?
                                </Link>
                            </Button>
                            <Button asChild size="sm" className="rounded-full px-4 py-2 h-9 bg-[#35877D] hover:bg-[#2c6f66] text-white transition-all shadow-sm font-extrabold text-xs flex items-center gap-1">
                                <Link href="/dashboard">
                                    Dashboard <ArrowRight size={12} />
                                </Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button asChild variant="outline" size="sm" className="rounded-full px-4 py-2 h-9 border-[#35877D] text-[#35877D] hover:bg-[#EAF7F2] hover:text-[#2c6f66] bg-transparent transition-all font-extrabold text-xs">
                                <Link href="/book-demo">
                                    Book a Demo
                                </Link>
                            </Button>
                            <Button asChild size="sm" className="rounded-full px-4 py-2 h-9 bg-[#35877D] hover:bg-[#2c6f66] text-white transition-all shadow-sm font-extrabold text-xs flex items-center gap-1">
                                <Link href="/register">
                                    Start Free Trial <ArrowRight size={12} />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm" className="rounded-full px-4 py-2 h-9 border-[#35877D] text-[#35877D] hover:bg-[#EAF7F2] hover:text-[#2c6f66] bg-transparent transition-all font-extrabold text-xs">
                                <Link href="/login">
                                    Log In
                                </Link>
                            </Button>
                        </>
                    )}
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
                    <Link href="/blog" className="text-base font-bold text-gray-700 p-2 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
                    <span className="text-base font-bold text-gray-700 p-2 border-b border-gray-50">Resources</span>

                    <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                        <Link href="/book-demo" className="text-center font-bold text-gray-700 p-2" onClick={() => setMobileMenuOpen(false)}>Demo</Link>
                        {isAuthenticated ? (
                            <Button asChild className="w-full bg-[#35877D] text-white font-extrabold rounded-full py-3 text-sm">
                                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Link href="/login" className="text-center font-bold text-gray-700 p-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                                <Button asChild className="w-full bg-[#35877D] text-white font-extrabold rounded-full py-3 text-sm">
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

