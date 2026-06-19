"use client";

import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { Sparkles, Coins } from "lucide-react";

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#143d27] font-sans overflow-x-hidden selection:bg-[#1B633E] selection:text-white">
            <LandingHeader />

            <main className="pt-32 pb-24">
                <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-5xl mx-auto">

                    {/* Header Banner */}
                    <div className="text-center space-y-4 mb-12">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCF8EC] text-[#1D4ED8] text-xs font-bold border border-[#EAD098] shadow-sm">
                            <Coins size={13} className="text-[#D99B26]" />
                            Fair Billing Policy
                        </span>
                        <h1 className="text-4xl font-extrabold text-[#0B2E1E] leading-tight">
                            Refund Policy
                        </h1>
                        <p className="text-base text-gray-550 font-medium max-w-xl mx-auto leading-relaxed">
                            Last Updated: June 11, 2026. Read about our billing guarantees, free trial scopes, and subscription policies.
                        </p>
                    </div>

                    {/* Content Card */}
                    <div className="bg-white border border-[#D99B26] rounded-3xl p-8 md:p-10 shadow-xl space-y-8">
                        <section className="space-y-3">
                            <h2 className="text-xl font-extrabold text-[#0B2E1E]">1. Free Sandbox Trial Scope</h2>
                            <p className="text-sm text-gray-550 font-medium leading-relaxed">
                                Connectly360 offers a completely free Starter Sandbox Plan and a 7-day free trial upon registration. We do not require credit card details to initiate sandbox accounts, ensuring you have ample opportunity to evaluate our node builders and CRM logs before spending anything.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-extrabold text-[#0B2E1E]">2. Refunds for Paid Subscriptions</h2>
                            <p className="text-sm text-gray-550 font-medium leading-relaxed">
                                Because of server allocations and prompt processing costs, we generally do not offer refunds on active paid subscriptions. However, if you believe you were billed in error due to system issues or duplication, please submit a ticket within 7 days of the transaction, and our billing desk will evaluate it.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-extrabold text-[#0B2E1E]">3. Cancellation & Proration</h2>
                            <p className="text-sm text-gray-550 font-medium leading-relaxed">
                                You can cancel your subscription plan at any time. When you cancel, you will maintain full access to your plan features until the end of your current billing cycle, and no further recurring charges will apply. We do not offer partial refunds for mid-cycle cancellations.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-extrabold text-[#0B2E1E]">4. Meta API Charges</h2>
                            <p className="text-sm text-gray-550 font-medium leading-relaxed">
                                Please note that conversation costs billed by Meta for official Cloud API usage are completely separate from Connectly360 subscription fees. We cannot refund, challenge, or adjust charges issued by Meta.
                            </p>
                        </section>
                    </div>

                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
