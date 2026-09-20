"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Zap,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Coins,
    HelpCircle,
    Check,
    MessageSquare,
    Users,
    Layers,
    Clock,
    Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/lib/auth-context";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";

export default function PricingPage() {
    const { isAuthenticated } = useAuth();

    // 4 Official Credit Packs
    const creditPacks = [
        {
            name: "Starter Pack",
            credits: 500,
            price: 99,
            perCredit: "₹0.20",
            desc: "Ideal for trying out WhatsApp automations and simple query resolutions.",
            popular: false,
            features: [
                "500 Outbound Actions",
                "Credits Never Expire",
                "AI Chatbot & Knowledge Base",
                "Shared Team Inbox",
                "Instant Activation"
            ]
        },
        {
            name: "Growth Pack",
            credits: 2000,
            price: 299,
            perCredit: "₹0.15",
            desc: "Most popular for growing brands running campaigns and automated AI support.",
            popular: true,
            features: [
                "2,000 Outbound Actions",
                "Credits Never Expire",
                "Full Meta Cloud API Access",
                "Broadcast Campaign Engine",
                "Knowledge Base Document Search",
                "Priority Support"
            ]
        },
        {
            name: "Pro Pack",
            credits: 10000,
            price: 999,
            perCredit: "₹0.10",
            desc: "Best unit economics for high-volume sales teams and agency broadcasts.",
            popular: false,
            features: [
                "10,000 Outbound Actions",
                "Credits Never Expire",
                "All AI Models (GPT & Claude)",
                "Full CRM & Lead Workflows",
                "Detailed Consumption Reports",
                "Dedicated WhatsApp Webhooks"
            ]
        },
        {
            name: "Enterprise Pack",
            credits: 50000,
            price: 3999,
            perCredit: "₹0.08",
            desc: "Maximum volume discount for enterprise scale, custom contracts & SLAs.",
            popular: false,
            features: [
                "50,000 Outbound Actions",
                "Lowest Cost Per Action",
                "Credits Never Expire",
                "Multi-Agent Team Routing",
                "Dedicated Account Manager",
                "Custom Integration Support"
            ]
        }
    ];

    // Official Credit Usage Rates
    const creditUsageRules = [
        { action: "Incoming Customer Messages", cost: "FREE (0 Credits)", detail: "Customers chatting with you never cost credits" },
        { action: "AI Chatbot Resolution / Reply", cost: "1 Credit", detail: "Autonomous GPT/Claude answer to a customer inquiry" },
        { action: "Knowledge Base Document Search", cost: "2 Credits", detail: "Deep semantic vector retrieval across uploaded PDFs/docs" },
        { action: "Automated Lead Capture", cost: "1 Credit", detail: "Contact extraction, field qualification, and CRM sync" },
        { action: "Media Messages (Image/Video/PDF)", cost: "2 Credits", detail: "Rich media brochures, catalogs, and dynamic files" },
        { action: "Marketing Broadcast Campaign", cost: "1 Credit / Recipient", detail: "Bulk notifications to verified recipient phone numbers" },
        { action: "Custom Workflow Execution", cost: "1 Credit", detail: "No-code workflow branching and automated condition rules" }
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden selection:bg-[#00382B] selection:text-white">
            {/* Header */}
            <LandingHeader />

            <main className="pt-36">
                {/* Hero Title Grid */}
                <section className="relative pb-14 overflow-hidden">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-5xl mx-auto text-center space-y-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35877D]/10 text-[#00382B] text-xs font-bold border border-[#35877D]/20 mb-1">
                            <Coins size={13} className="text-[#35877D] animate-pulse" />
                            100% Pay-As-You-Go — No Monthly Subscription
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                            Pay Only For What You Use. <br className="hidden sm:inline" />
                            <span className="text-[#00382B]">Zero Recurring Subscriptions.</span>
                        </h1>
                        <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                            Sign up free and receive <span className="text-[#00382B] font-bold">50 Free Credits</span> immediately. 
                            Top up credit packs only when you need them. Unused credits never expire.
                        </p>

                        {/* Free Signup Callout */}
                        <div className="pt-2">
                            <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl px-5 py-3 shadow-xs">
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                                    <Sparkles size={16} className="text-emerald-600" />
                                    <span>Free Signup Bonus: 50 Free Credits included with every new account!</span>
                                </div>
                                <Button asChild size="sm" className="bg-[#00382B] hover:bg-[#35877D] text-white text-xs font-bold rounded-xl h-8 px-4 cursor-pointer border-0">
                                    <Link href={isAuthenticated ? "/dashboard" : "/register"}>
                                        Claim 50 Free Credits <ArrowRight size={13} className="ml-1" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Credit Packs Grid */}
                <section className="pb-16">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Credit Top-up Packages
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                                Choose the pack that fits your broadcast and automation volume.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                            {creditPacks.map((pack) => (
                                <Card 
                                    key={pack.name} 
                                    className={`p-7 flex flex-col justify-between rounded-3xl transition-all duration-300 relative bg-white ${
                                        pack.popular 
                                            ? "border-2 border-[#00382B] shadow-xl ring-2 ring-[#00382B]/10 xl:-translate-y-2" 
                                            : "border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300"
                                    }`}
                                >
                                    {pack.popular && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00382B] text-white text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                                            <Zap size={10} className="fill-white" /> Most Popular
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div>
                                            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                                pack.popular ? "bg-[#00382B]/10 text-[#00382B]" : "bg-slate-100 text-slate-700"
                                            }`}>
                                                {pack.name}
                                            </span>
                                            <div className="flex items-baseline gap-1.5 mt-3">
                                                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                                                    {pack.credits.toLocaleString()}
                                                </span>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Credits</span>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                                                {pack.desc}
                                            </p>
                                        </div>

                                        <div className="pt-2 pb-2 border-y border-slate-100 flex items-baseline justify-between">
                                            <div>
                                                <span className="text-2xl font-black text-[#00382B]">₹{pack.price.toLocaleString()}</span>
                                                <span className="text-slate-400 text-xs font-semibold ml-1">one-time</span>
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                                                {pack.perCredit} / credit
                                            </span>
                                        </div>

                                        <ul className="space-y-2 text-xs font-medium text-slate-700 pt-1">
                                            {pack.features.map((f) => (
                                                <li key={f} className="flex items-center gap-2">
                                                    <CheckCircle2 size={14} className="text-emerald-555 shrink-0" />
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Button 
                                        asChild 
                                        className={`w-full mt-6 h-11 rounded-xl text-xs font-bold shadow-xs cursor-pointer border-0 ${
                                            pack.popular 
                                                ? "bg-[#00382B] hover:bg-[#35877D] text-white" 
                                                : "bg-slate-900 hover:bg-slate-800 text-white"
                                        }`}
                                    >
                                        <Link href={isAuthenticated ? "/billing/recharge-credits" : "/register"}>
                                            {isAuthenticated ? `Buy ${pack.name}` : "Sign Up & Purchase"}
                                        </Link>
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Transparent Credit Consumption Table */}
                <section className="py-16 bg-white border-t border-slate-200">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-5xl mx-auto">
                        <div className="text-center mb-10">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#35877D] bg-[#35877D]/10 px-3 py-1 rounded-full border border-[#35877D]/20">
                                Transparent Usage
                            </span>
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                                Credit Usage &amp; Consumption Rules
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                                Every action is billed at fixed, published rates. No hidden subscription tiers.
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm bg-white">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 text-xs font-bold uppercase tracking-wider">
                                        <th className="p-4 sm:px-6 w-[45%]">Action / Event</th>
                                        <th className="p-4 sm:px-6 w-[25%] text-right sm:text-left">Credits Required</th>
                                        <th className="p-4 sm:px-6 w-[30%] hidden sm:table-cell">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                                    {creditUsageRules.map((rule, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="p-4 sm:px-6 font-bold text-slate-900">
                                                {rule.action}
                                            </td>
                                            <td className="p-4 sm:px-6 text-right sm:text-left">
                                                <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                                                    rule.cost.includes("FREE") 
                                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                                        : "bg-slate-100 text-slate-800"
                                                }`}>
                                                    {rule.cost}
                                                </span>
                                            </td>
                                            <td className="p-4 sm:px-6 text-slate-500 font-normal hidden sm:table-cell">
                                                {rule.detail}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                                <Clock size={20} className="text-[#35877D] shrink-0" />
                                <div className="text-xs">
                                    <p className="font-bold text-slate-900">Never Expiring Balance</p>
                                    <p className="text-slate-500">Credits stay in your wallet indefinitely</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                                <Lock size={20} className="text-[#35877D] shrink-0" />
                                <div className="text-xs">
                                    <p className="font-bold text-slate-900">Zero Recurring Lock-in</p>
                                    <p className="text-slate-500">No auto-renewals or unexpected charges</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                                <ShieldCheck size={20} className="text-[#35877D] shrink-0" />
                                <div className="text-xs">
                                    <p className="font-bold text-slate-900">GST Invoice Provided</p>
                                    <p className="text-slate-500">Official tax invoices for all purchases</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 md:py-20 bg-slate-50 border-t border-slate-200">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-4xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Frequently Asked Questions</h2>
                            <p className="text-xs sm:text-sm text-slate-500">Everything you need to know about our Pay-As-You-Go model.</p>
                        </div>

                        <Accordion type="single" collapsible className="w-full bg-white rounded-2xl border border-slate-200 px-6 py-2 shadow-xs">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-left text-sm font-bold text-slate-900 hover:text-[#00382B]">
                                    Are there any monthly subscription fees?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                                    No. Connectly360 is completely pay-as-you-go. You never pay a mandatory monthly fee or recurring subscription. Simply buy credit packs as your business needs them.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-left text-sm font-bold text-slate-900 hover:text-[#00382B]">
                                    Do my purchased credits expire?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                                    No, credits never expire. Even if you don&apos;t use your workspace for months, your wallet balance remains safe and available until consumed.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-left text-sm font-bold text-slate-900 hover:text-[#00382B]">
                                    What happens when my credit balance reaches zero?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                                    When your balance is 0, outbound actions like AI replies and campaigns will pause temporarily. Incoming customer messages will continue to be safely stored in your inbox for free. As soon as you recharge a credit pack, all automated actions resume instantly.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger className="text-left text-sm font-bold text-slate-900 hover:text-[#00382B]">
                                    Are incoming customer messages charged?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                                    No! Incoming WhatsApp messages from your customers are 100% free (0 credits). You only use credits when Connectly360 sends outbound AI replies, executes automations, or dispatches broadcast campaigns.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-5">
                                <AccordionTrigger className="text-left text-sm font-bold text-slate-900 hover:text-[#00382B]">
                                    How many free credits do I get when I register?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                                    Every new account receives 50 Free Welcome Credits upon email verification. No credit card is required to sign up or test your WhatsApp AI integration.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <LandingFooter />
        </div>
    );
}
