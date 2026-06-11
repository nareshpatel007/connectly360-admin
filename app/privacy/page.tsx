"use client";

import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { Sparkles, Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#143d27] font-sans overflow-x-hidden selection:bg-[#1B633E] selection:text-white">
            <LandingHeader />

            <main className="pt-32 pb-24">
                <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-5xl mx-auto">
                    
                    {/* Header Banner */}
                    <div className="text-center space-y-4 mb-12">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCF8EC] text-[#1D4ED8] text-xs font-bold border border-[#EAD098] shadow-sm">
                            <Shield size={13} className="text-[#D99B26]" />
                            Trust & Security Center
                        </span>
                        <h1 className="text-4xl font-extrabold text-[#0B2E1E] leading-tight">
                            Privacy Policy
                        </h1>
                        <p className="text-base text-gray-550 font-medium max-w-xl mx-auto leading-relaxed">
                            Last Updated: June 11, 2026. We are committed to protecting your personal data and your customers' conversational privacy.
                        </p>
                    </div>

                    {/* Content Card */}
                    <div className="bg-white border border-[#D99B26] rounded-3xl p-8 md:p-10 shadow-xl space-y-8">
                        <section className="space-y-3">
                            <h2 className="text-xl font-extrabold text-[#0B2E1E]">1. Information We Collect</h2>
                            <p className="text-sm text-gray-550 font-medium leading-relaxed">
                                We collect information you provide directly to us when creating a Connectly360 account, configuring WhatsApp webhook integrations, or setting up conversational workflows. This includes your name, business email, phone number, and billing information.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-extrabold text-[#0B2E1E]">2. Conversational & Chat Data</h2>
                            <p className="text-sm text-gray-550 font-medium leading-relaxed">
                                To provide our conversational CRM and automated routing services, we process incoming and outbound messages transmitted via the official Meta WhatsApp Cloud API. We do not sell, rent, or lease your conversation logs to third parties. This data is strictly used to run your customized workflows and train your dedicated chatbot models.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-extrabold text-[#0B2E1E]">3. Data Encryption & Storage</h2>
                            <p className="text-sm text-gray-550 font-medium leading-relaxed">
                                All messages processed by Connectly360 are encrypted in transit using industry-standard TLS protocols and encrypted at rest on secure cloud servers. Access to databases containing client configurations is restricted strictly to authorized personnel.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-extrabold text-[#0B2E1E]">4. Third-Party Integrations</h2>
                            <p className="text-sm text-gray-550 font-medium leading-relaxed">
                                If you configure external webhooks or integrate your CRM pipeline with platforms like HubSpot, Shopify, or Salesforce, we transmit data on your behalf according to the trigger logic you establish. Please review the privacy policies of those third-party providers.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-extrabold text-[#0B2E1E]">5. Contact Us</h2>
                            <p className="text-sm text-gray-550 font-medium leading-relaxed">
                                For inquiries about data deletion requests, GDPR compliance, or our security frameworks, please email our privacy desk at <span className="text-[#1B633E] font-bold">support@connectly360.com</span>.
                            </p>
                        </section>
                    </div>

                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
