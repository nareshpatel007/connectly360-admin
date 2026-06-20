"use client";

import React from "react";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden selection:bg-[#35877D] selection:text-white">
            <LandingHeader />

            <main className="pt-40">
                {/* Hero Title Section */}
                <section className="relative pb-16 overflow-hidden">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto text-center space-y-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35877D]/10 text-[#35877D] text-xs font-bold border border-[#35877D]/20 mb-1">
                            <Shield size={12} className="animate-pulse" />
                            Trust & Security Center
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                            Privacy Policy
                        </h1>
                        <p className="text-base text-gray-550 font-semibold max-w-2xl mx-auto leading-relaxed">
                            Last Updated: June 11, 2026. We are committed to protecting your personal data and your customers' conversational privacy.
                        </p>
                    </div>
                </section>

                {/* Main Content Section */}
                <section className="pb-24">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-5xl mx-auto">
                        <Card className="p-8 md:p-12 bg-white border border-slate-200 rounded-3xl shadow-sm relative overflow-hidden space-y-8">
                            <section className="space-y-3">
                                <h2 className="text-xl font-extrabold text-slate-900">1. Information We Collect</h2>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    We collect information you provide directly to us when creating a Connectly360 account, configuring WhatsApp webhook integrations, or setting up conversational workflows. This includes your name, business email, phone number, and billing information.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h2 className="text-xl font-extrabold text-slate-900">2. Conversational & Chat Data</h2>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    To provide our conversational CRM and automated routing services, we process incoming and outbound messages transmitted via the official Meta WhatsApp Cloud API. We do not sell, rent, or lease your conversation logs to third parties. This data is strictly used to run your customized workflows and train your dedicated chatbot models.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h2 className="text-xl font-extrabold text-slate-900">3. Data Encryption & Storage</h2>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    All messages processed by Connectly360 are encrypted in transit using industry-standard TLS protocols and encrypted at rest on secure cloud servers. Access to databases containing client configurations is restricted strictly to authorized personnel.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h2 className="text-xl font-extrabold text-slate-900">4. Third-Party Integrations</h2>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    If you configure external webhooks or integrate your CRM pipeline with e-commerce platforms like Shopify, we transmit data on your behalf according to the trigger logic you establish. Please review the privacy policies of those third-party providers.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h2 className="text-xl font-extrabold text-slate-900">5. Contact Us</h2>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    For inquiries about data deletion requests, GDPR compliance, or our security frameworks, please email our privacy desk at <span className="text-[#35877D] font-bold">support@connectly360.com</span>.
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
