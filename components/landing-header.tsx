"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export function LandingHeader() {
    const { isAuthenticated, user } = useAuth();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // If on homepage, use internal anchors (#id). Otherwise, prefix with root (/#id).
    const isHome = pathname === "/";
    const prefix = isHome ? "" : "/";

    return (
        <header className="fixed top-0 w-full z-50 bg-[#FAF8F5]/85 backdrop-blur-md border-b border-[#D99B26]">
            <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/images/logo.png" alt="Connectly360 Logo" className="h-11 w-auto object-contain" />
                    </Link>
                </div>

                <nav className="hidden lg:flex items-center gap-8">
                    <Link href={`${prefix}#products`} className="text-sm font-semibold text-[#143d27]/80 hover:text-[#1B633E] transition-colors">Suite</Link>
                    <Link href={`${prefix}#playground`} className="text-sm font-semibold text-[#143d27]/80 hover:text-[#1B633E] transition-colors">Playground</Link>
                    <Link href={`${prefix}#workflow`} className="text-sm font-semibold text-[#143d27]/80 hover:text-[#1B633E] transition-colors">Builder</Link>
                    <Link href={`${prefix}#roi`} className="text-sm font-semibold text-[#143d27]/80 hover:text-[#1B633E] transition-colors">ROI</Link>
                    <Link href="/pricing" className={`text-sm font-semibold hover:text-[#1B633E] transition-colors ${pathname === "/pricing" ? "text-[#1B633E]" : "text-[#143d27]/80"}`}>Pricing</Link>
                    <Link href="/contact" className={`text-sm font-semibold hover:text-[#1B633E] transition-colors ${pathname === "/contact" ? "text-[#1B633E]" : "text-[#143d27]/80"}`}>Contact</Link>
                    <div className="h-4 w-px bg-[#EAE6DF]"></div>

                    {isAuthenticated ? (
                        <>
                            <span className="text-xs text-gray-500 font-semibold">Hello, {user?.name || "Admin"}</span>
                            <Button asChild className="rounded-xl px-5 bg-[#1B633E] hover:bg-[#12452A] text-white transition-all shadow-sm font-bold">
                                <Link href="/dashboard">Go to Dashboard</Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-semibold text-[#143d27] hover:text-[#1B633E] transition-colors">
                                Log in
                            </Link>
                            <Button asChild className="rounded-xl px-5 bg-[#1B633E] hover:bg-[#12452A] text-white transition-all shadow-sm font-bold">
                                <Link href="/register">Get Started Free</Link>
                            </Button>
                        </>
                    )}
                </nav>

                <button
                    className="lg:hidden text-[#143d27]"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-20 left-0 w-full bg-[#FAF8F5] border-b border-[#D99B26] p-5 flex flex-col gap-4 shadow-lg">
                    <Link href={`${prefix}#products`} className="text-base font-semibold p-2" onClick={() => setMobileMenuOpen(false)}>Suite</Link>
                    <Link href={`${prefix}#playground`} className="text-base font-semibold p-2" onClick={() => setMobileMenuOpen(false)}>Playground</Link>
                    <Link href={`${prefix}#workflow`} className="text-base font-semibold p-2" onClick={() => setMobileMenuOpen(false)}>Builder</Link>
                    <Link href={`${prefix}#roi`} className="text-base font-semibold p-2" onClick={() => setMobileMenuOpen(false)}>ROI</Link>
                    <Link href="/pricing" className="text-base font-semibold p-2" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                    <Link href="/contact" className="text-base font-semibold p-2" onClick={() => setMobileMenuOpen(false)}>Contact</Link>

                    {isAuthenticated ? (
                        <Button asChild className="w-full mt-2 bg-[#1B633E] text-white font-bold">
                            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Go to Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Link href="/login" className="text-base font-semibold p-2 border-t border-[#D99B26] mt-2 pt-4 text-center" onClick={() => setMobileMenuOpen(false)}>
                                Log in
                            </Link>
                            <Button asChild className="w-full mt-2 bg-[#1B633E] text-white font-bold">
                                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>Get Started Free</Link>
                            </Button>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
