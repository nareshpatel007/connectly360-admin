"use client";

import React from "react";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { Card } from "@/components/ui/card";
import { Scale } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden selection:bg-[#35877D] selection:text-white">
            <LandingHeader />

            <main className="pt-40">
                {/* Hero Title Section */}
                <section className="relative pb-16 overflow-hidden">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto text-center space-y-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35877D]/10 text-[#35877D] text-xs font-bold border border-[#35877D]/20 mb-1">
                            <Scale size={12} className="animate-pulse" />
                            Legal Agreement Desk
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                            Terms & Conditions
                        </h1>
                        <p className="text-base text-gray-550 font-semibold max-w-2xl mx-auto leading-relaxed">
                            Last Updated: June 11, 2026. Please read these terms carefully before utilizing our Conversational CRM and automation suite.
                        </p>
                    </div>
                </section>

                {/* Main Content Section */}
                <section className="pb-24">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-5xl mx-auto">
                        <Card className="p-8 md:p-12 bg-white border border-slate-200 rounded-3xl shadow-sm relative overflow-hidden space-y-8">
                            <section className="space-y-3">
                                <h2 className="text-xl font-extrabold text-slate-900">1. Acceptance of Terms</h2>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    By signing up for Connectly360, you agree to comply with these terms, as well as Meta's official WhatsApp Business Terms of Service. If you do not agree, you are prohibited from utilizing our dashboard and workflow tools.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h2 className="text-xl font-extrabold text-slate-900">2. Acceptable Messaging Policy</h2>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    You agree not to utilize our official WhatsApp Cloud API integration to distribute unsolicited messages (spam), verify fraud, or distribute materials violating Meta's merchant policies. Connectly360 reserves the right to suspend accounts immediately upon notification of bans or policy violation reports from Meta.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h2 className="text-xl font-extrabold text-slate-900">3. Subscription Fees & Billing</h2>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    Certain subscription plans (e.g., Growth) are billed on a recurring monthly or annual basis. You agree to provide accurate payment methods. Subscriptions can be canceled at any time from your settings panel. Meta Cloud API usage costs are billed directly via your Meta Developer Console.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h2 className="text-xl font-extrabold text-slate-900">4. Limitation of Liability</h2>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    Connectly360 is not liable for business loss, number bans, or communication interruptions resulting from Meta API outages, provider changes, or network connectivity issues.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h2 className="text-xl font-extrabold text-slate-900">5. Changes to Agreements</h2>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    We revise these terms periodically. Continued use of the platform following updates represents complete acceptance of the amended Terms & Conditions.
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
