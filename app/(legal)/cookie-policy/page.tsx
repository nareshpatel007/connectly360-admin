"use client";

import React from "react";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { Card } from "@/components/ui/card";
import { Cookie } from "lucide-react";

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden selection:bg-[#35877D] selection:text-white">
            <LandingHeader />

            <main className="pt-40">
                {/* Hero Title Section */}
                <section className="relative pb-16 overflow-hidden">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto text-center space-y-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35877D]/10 text-[#35877D] text-xs font-bold border border-[#35877D]/20 mb-1">
                            <Cookie size={12} className="animate-pulse" />
                            Data Transparency
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                            Cookie Policy
                        </h1>
                        <p className="text-base text-gray-550 font-semibold max-w-2xl mx-auto leading-relaxed">
                            Last Updated: June 11, 2026. This policy explains how and why we utilize cookies to optimize your platform dashboard experience.
                        </p>
                    </div>
                </section>

                {/* Main Content Section */}
                <section className="pb-24">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-5xl mx-auto">
                        <Card className="p-8 md:p-12 bg-white border border-slate-200 rounded-3xl shadow-sm relative overflow-hidden space-y-8">
                            <section className="space-y-3">
                                <h2 className="text-xl font-extrabold text-slate-900">1. What Are Cookies?</h2>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work more efficiently, as well as to provide reporting details to the owners of the site.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h2 className="text-xl font-extrabold text-slate-900">2. How We Use Cookies</h2>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    We utilize cookies for two primary purposes:
                                </p>
                                <ul className="list-disc pl-5 text-gray-650 text-sm sm:text-base leading-relaxed font-semibold space-y-2">
                                    <li><strong>Essential Cookies:</strong> Necessary to keep you logged in to your Connectly360 dashboard and store your active session state securely.</li>
                                    <li><strong>Performance & Analytics:</strong> To monitor website traffic, analyze popular sections, and resolve routing performance bottlenecks. We do not track users across external sites.</li>
                                </ul>
                            </section>

                            <section className="space-y-3">
                                <h2 className="text-xl font-extrabold text-slate-900">3. Managing Cookies</h2>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    Most web browsers allow you to block or delete cookies through browser settings. However, disabling essential cookies will prevent you from logging in and utilizing the CRM dashboard suite.
                                </p>
                            </section>
                        </Card>
                    </div>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
}
