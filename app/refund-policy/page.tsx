"use client";

import React from "react";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { Card } from "@/components/ui/card";
import { Coins } from "lucide-react";

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden selection:bg-[#35877D] selection:text-white">
            <LandingHeader />

            <main className="pt-40">
                {/* Hero Title Section */}
                <section className="relative pb-16 overflow-hidden">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto text-center space-y-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35877D]/10 text-[#35877D] text-xs font-bold border border-[#35877D]/20 mb-1">
                            <Coins size={12} className="animate-pulse" />
                            Fair Billing Policy
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                            Refund Policy
                        </h1>
                        <p className="text-base text-gray-550 font-semibold max-w-2xl mx-auto leading-relaxed">
                            Last Updated: June 11, 2026. Read about our billing guarantees, free trial scopes, and subscription policies.
                        </p>
                    </div>
                </section>

                {/* Main Content Section */}
                <section className="pb-24">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-5xl mx-auto">
                        <Card className="p-8 md:p-12 bg-white border border-slate-200 rounded-3xl shadow-sm relative overflow-hidden space-y-8">
                            <section className="space-y-3">
                                <h2 className="text-xl font-extrabold text-slate-900">1. Free Sandbox Trial Scope</h2>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    Connectly360 offers a completely free Starter Sandbox Plan and a 7-day free trial upon registration. We do not require credit card details to initiate sandbox accounts, ensuring you have ample opportunity to evaluate our node builders and CRM logs before spending anything.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h2 className="text-xl font-extrabold text-slate-900">2. Refunds for Paid Subscriptions</h2>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    Because of server allocations and prompt processing costs, we generally do not offer refunds on active paid subscriptions. However, if you believe you were billed in error due to system issues or duplication, please submit a ticket within 7 days of the transaction, and our billing desk will evaluate it.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h2 className="text-xl font-extrabold text-slate-900">3. Cancellation & Proration</h2>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    You can cancel your subscription plan at any time. When you cancel, you will maintain full access to your plan features until the end of your current billing cycle, and no further recurring charges will apply. We do not offer partial refunds for mid-cycle cancellations.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h2 className="text-xl font-extrabold text-slate-900">4. Meta API Charges</h2>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    Please note that conversation costs billed by Meta for official Cloud API usage are completely separate from Connectly360 subscription fees. We cannot refund, challenge, or adjust charges issued by Meta.
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
