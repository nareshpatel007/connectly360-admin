"use client";

import Link from "next/link";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { ArrowRight, Home, Search, MessageSquare } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <LandingHeader />

            {/* Main content — offset for fixed header (banner ~40px + header 80px = 120px) */}
            <main className="flex-1 flex items-center justify-center pt-[120px] pb-20 px-4">
                <div className="max-w-2xl w-full mx-auto text-center">

                    {/* Animated 404 graphic */}
                    <div className="relative flex items-center justify-center mb-10 select-none">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 rounded-full bg-[#35877D]/6 blur-3xl" />
                        </div>
                        <div className="relative">
                            <span
                                className="text-[140px] sm:text-[180px] font-black leading-none tracking-tighter"
                                style={{
                                    background: "linear-gradient(135deg, #35877D 0%, #0B2E1E 60%, #35877D 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                404
                            </span>
                        </div>
                    </div>

                    {/* Message */}
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2E1E] mb-3">
                        Oops! Page not found
                    </h1>
                    <p className="text-gray-500 text-sm sm:text-base font-medium leading-relaxed max-w-md mx-auto mb-10">
                        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
                        Let&apos;s get you back on track.
                    </p>

                    {/* Quick links */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#35877D] hover:bg-[#2c6f66] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 group"
                        >
                            <Home size={15} />
                            Back to Home
                            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#35877D] text-[#35877D] hover:bg-[#EAF7F2] text-sm font-bold transition-all duration-200"
                        >
                            Go to Dashboard
                        </Link>
                    </div>

                    {/* Helpful links */}
                    <div className="border-t border-slate-100 pt-8">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-5">
                            Or explore these pages
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {[
                                { label: "Pricing", href: "/pricing" },
                                { label: "Blog", href: "/blog" },
                                { label: "FAQs", href: "/faq" },
                                { label: "Contact", href: "/contact" },
                                { label: "Book a Demo", href: "/book-demo" },
                                { label: "Privacy Policy", href: "/privacy" },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-[#35877D]/40 hover:bg-[#EAF7F2] text-slate-600 hover:text-[#35877D] text-xs font-semibold transition-all duration-150"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Support hint */}
                    <p className="mt-10 text-xs text-gray-400">
                        Still lost?{" "}
                        <Link href="/contact" className="text-[#35877D] font-semibold hover:underline">
                            Contact our support team
                        </Link>{" "}
                        — we&apos;re happy to help.
                    </p>
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
