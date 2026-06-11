"use client";

import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { Sparkles, Cookie } from "lucide-react";

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#143d27] font-sans overflow-x-hidden selection:bg-[#1B633E] selection:text-white">
            <LandingHeader />

            <main className="pt-32 pb-24">
                <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-5xl mx-auto">
                    
                    {/* Header Banner */}
                    <div className="text-center space-y-4 mb-12">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCF8EC] text-[#1D4ED8] text-xs font-bold border border-[#EAD098] shadow-sm">
                            <Cookie size={13} className="text-[#D99B26]" />
                            Data Transparency
                        </span>
                        <h1 className="text-4xl font-extrabold text-[#0B2E1E] leading-tight">
                            Cookie Policy
                        </h1>
                        <p className="text-base text-gray-550 font-medium max-w-xl mx-auto leading-relaxed">
                            Last Updated: June 11, 2026. This policy explains how and why we utilize cookies to optimize your platform dashboard experience.
                        </p>
                    </div>

                    {/* Content Card */}
                    <div className="bg-white border border-[#D99B26] rounded-3xl p-8 md:p-10 shadow-xl space-y-8">
                        <section className="space-y-3">
                            <h2 className="text-xl font-extrabold text-[#0B2E1E]">1. What Are Cookies?</h2>
                            <p className="text-sm text-gray-550 font-medium leading-relaxed">
                                Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work more efficiently, as well as to provide reporting details to the owners of the site.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-extrabold text-[#0B2E1E]">2. How We Use Cookies</h2>
                            <p className="text-sm text-gray-550 font-medium leading-relaxed">
                                We utilize cookies for two primary purposes:
                            </p>
                            <ul className="list-disc pl-5 text-sm text-gray-550 font-medium space-y-2 leading-relaxed">
                                <li><strong>Essential Cookies:</strong> Necessary to keep you logged in to your Connectly360 dashboard and store your active session state securely.</li>
                                <li><strong>Performance & Analytics:</strong> To monitor website traffic, analyze popular sections, and resolve routing performance bottlenecks. We do not track users across external sites.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-extrabold text-[#0B2E1E]">3. Managing Cookies</h2>
                            <p className="text-sm text-gray-550 font-medium leading-relaxed">
                                Most web browsers allow you to block or delete cookies through browser settings. However, disabling essential cookies will prevent you from logging in and utilizing the CRM dashboard suite.
                            </p>
                        </section>
                    </div>

                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
