"use client";

import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { Sparkles, Scale } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#143d27] font-sans overflow-x-hidden selection:bg-[#1B633E] selection:text-white">
            <LandingHeader />

            <main className="pt-32 pb-24">
                <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-5xl mx-auto">
                    
                    {/* Header Banner */}
                    <div className="text-center space-y-4 mb-12">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCF8EC] text-[#1D4ED8] text-xs font-bold border border-[#EAD098] shadow-sm">
                            <Scale size={13} className="text-[#D99B26]" />
                            Legal Agreement Desk
                        </span>
                        <h1 className="text-4xl font-extrabold text-[#0B2E1E] leading-tight">
                            Terms & Conditions
                        </h1>
                        <p className="text-base text-gray-550 font-medium max-w-xl mx-auto leading-relaxed">
                            Last Updated: June 11, 2026. Please read these terms carefully before utilizing our Conversational CRM and automation suite.
                        </p>
                    </div>

                    {/* Content Card */}
                    <div className="bg-white border border-[#D99B26] rounded-3xl p-8 md:p-10 shadow-xl space-y-8">
                        <section className="space-y-3">
                            <h2 className="text-xl font-extrabold text-[#0B2E1E]">1. Acceptance of Terms</h2>
                            <p className="text-sm text-gray-550 font-medium leading-relaxed">
                                By signing up for Connectly360, you agree to comply with these terms, as well as Meta's official WhatsApp Business Terms of Service. If you do not agree, you are prohibited from utilizing our dashboard and workflow tools.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-extrabold text-[#0B2E1E]">2. Acceptable Messaging Policy</h2>
                            <p className="text-sm text-gray-550 font-medium leading-relaxed">
                                You agree not to utilize our official WhatsApp Cloud API integration to distribute unsolicited messages (spam), verify fraud, or distribute materials violating Meta's merchant policies. Connectly360 reserves the right to suspend accounts immediately upon notification of bans or policy violation reports from Meta.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-extrabold text-[#0B2E1E]">3. Subscription Fees & Billing</h2>
                            <p className="text-sm text-gray-550 font-medium leading-relaxed">
                                Certain subscription plans (e.g., Growth) are billed on a recurring monthly or annual basis. You agree to provide accurate payment methods. Subscriptions can be canceled at any time from your settings panel. Meta Cloud API usage costs are billed directly via your Meta Developer Console.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-extrabold text-[#0B2E1E]">4. Limitation of Liability</h2>
                            <p className="text-sm text-gray-550 font-medium leading-relaxed">
                                Connectly360 is not liable for business loss, number bans, or communication interruptions resulting from Meta API outages, provider changes, or network connectivity issues.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-extrabold text-[#0B2E1E]">5. Changes to Agreements</h2>
                            <p className="text-sm text-gray-550 font-medium leading-relaxed">
                                We revise these terms periodically. Continued use of the platform following updates represents complete acceptance of the amended Terms & Conditions.
                            </p>
                        </section>
                    </div>

                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
