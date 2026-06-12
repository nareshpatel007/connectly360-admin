"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    MessageSquare,
    TrendingUp,
    Users,
    Zap,
    CheckCircle2,
    ChevronRight,
    Shield,
    ArrowRight,
    Sparkles,
    Bot,
    Clock,
    Lock,
    HelpCircle,
    Check,
    Coins,
    BarChart3,
    ArrowUpRight,
    Layers,
    Share2,
    Code,
    Smartphone,
    Globe,
    Database,
    Mail,
    Phone,
    MapPin,
    ArrowRightLeft,
    Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/lib/auth-context";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";

export default function PricingPage() {
    const { isAuthenticated, user } = useAuth();
    const [isAnnual, setIsAnnual] = useState(false);

    // Pricing details
    const prices = {
        starter: { monthly: 0, annual: 0 },
        growth: { monthly: 999, annual: 799 },
        business: { monthly: 2499, annual: 1999 }
    };

    // Features Comparison Matrix Data
    const comparisonMatrix = [
        {
            category: "WhatsApp Cloud API Integration",
            features: [
                { name: "Monthly Conversations Limit", starter: "500 conversations", growth: "5,000 conversations", business: "Unlimited conversations", enterprise: "Custom limits" },
                { name: "Connected WhatsApp Numbers", starter: "1 number", growth: "1 number", business: "Multiple numbers", enterprise: "Unlimited numbers" },
                { name: "Meta Embedded Signup", starter: "Yes (Standard)", growth: "Yes (Standard)", business: "Yes (Standard)", enterprise: "White-Label Setup" },
                { name: "Multiple WABA Syncing", starter: "No", growth: "No", business: "Supported", enterprise: "Supported" }
            ]
        },
        {
            category: "AI Assistant & Knowledge Base",
            features: [
                { name: "AI Auto-responder Integration", starter: "Keyword-based replies", growth: "GPT Assistant", business: "GPT Assistant", enterprise: "Custom Models / LLMs" },
                { name: "Knowledge Base Document Uploads", starter: "No", growth: "PDF, DOCX, TXT", business: "PDF, DOCX, TXT", enterprise: "Custom DB Integrations" },
                { name: "AI Response Testing Sandbox", starter: "No", growth: "Yes", business: "Yes", enterprise: "Yes" }
            ]
        },
        {
            category: "Inbox & CRM System",
            features: [
                { name: "Unified Shared Inbox Seats", starter: "1 user", growth: "3 users", business: "Unlimited users", enterprise: "Unlimited users" },
                { name: "Lead Pipeline Stages Management", starter: "3 stages", growth: "Custom stages", business: "Custom stages", enterprise: "Custom stages" },
                { name: "Segmentations & Follow-up Actions", starter: "Basic tag filters", growth: "Yes", business: "Yes", enterprise: "Yes" }
            ]
        },
        {
            category: "Campaigns & Automation Engine",
            features: [
                { name: "WhatsApp Campaign Broadcasts", starter: "No", growth: "No", business: "Yes (Scheduled & Template)", enterprise: "Yes (Scheduled & Template)" },
                { name: "Visual Node Builder Editor", starter: "No", growth: "Yes", business: "Yes", enterprise: "Yes" },
                { name: "Webhook Triggers & API Sync", starter: "No", growth: "Yes", business: "Yes", enterprise: "Yes" }
            ]
        },
        {
            category: "Platform Administration & Support",
            features: [
                { name: "Support Channel Scope", starter: "Documentation", growth: "Email & Web Chat", business: "24/7 Priority Support", enterprise: "Custom Dedicated Slack" },
                { name: "White-Label Domain Support", starter: "No", growth: "No", business: "No", enterprise: "Yes (Full Branding)" },
                { name: "Response SLA Guarantee", starter: "No", growth: "Within 24 hours", business: "Within 1 hour SLA", enterprise: "Within 15 mins SLA" }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden selection:bg-[#35877D] selection:text-white">

            {/* Header */}
            <LandingHeader />

            <main className="pt-32">
                {/* Hero Title Grid */}
                <section className="relative pb-16 overflow-hidden">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto text-center space-y-4">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCF8EC] text-[#1D4ED8] text-xs font-bold border border-[#EAD098] shadow-sm">
                            <Coins size={13} className="text-[#D99B26] fill-[#D99B26]/15" />
                            Compare Pricing & Plans
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B2E1E] leading-tight">
                            Plans matching your business scale
                        </h1>
                        <p className="text-base text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                            Choose between a free sandbox setup, flexible workflow automation, or fully integrated custom solutions. Save 20% by paying annually.
                        </p>

                        {/* Billing Switch */}
                        <div className="flex items-center justify-center gap-4 pt-6">
                            <Label htmlFor="billing-toggle-page" className={`text-sm font-bold ${!isAnnual ? 'text-slate-900' : 'text-gray-400'}`}>Monthly Billing</Label>
                            <Switch
                                id="billing-toggle-page"
                                checked={isAnnual}
                                onCheckedChange={setIsAnnual}
                                className="data-[state=checked]:bg-[#35877D]"
                            />
                            <Label htmlFor="billing-toggle-page" className={`text-sm font-bold flex items-center gap-2 ${isAnnual ? 'text-slate-900' : 'text-gray-400'}`}>
                                Yearly Billing
                                <span className="bg-[#FCF8EC] text-[#35877D] text-[10px] px-2.5 py-0.5 rounded-full font-extrabold border border-slate-200">Save 20%</span>
                            </Label>
                        </div>
                    </div>
                </section>

                {/* Main Cards Row */}
                <section className="pb-24">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">

                            {/* Starter */}
                            <Card className="p-8 flex flex-col border border-slate-200 bg-white rounded-3xl shadow-sm relative">
                                <div className="mb-5">
                                    <h3 className="text-xl font-extrabold text-slate-900 mb-1">Starter</h3>
                                    <p className="text-sm text-gray-500 font-bold">Sandbox Playground</p>
                                </div>
                                <div className="mb-6 flex items-baseline">
                                    <span className="text-4xl font-extrabold text-slate-900">₹0</span>
                                    <span className="text-gray-600 text-sm ml-1 font-semibold">/month</span>
                                </div>
                                <ul className="text-sm text-gray-600 font-semibold space-y-2 mb-8 flex-1">
                                    {[
                                        "1 WhatsApp Number",
                                        "500 Conversations/month",
                                        "Basic Automation Flows",
                                        "CRM Contact Management",
                                        "Sandbox Playground Access",
                                    ].map((f) => (
                                        <li key={f} className="flex items-start gap-2">
                                            <CheckCircle2 size={14} className="text-[#35877D] shrink-0 mt-0.5" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button asChild variant="outline" className="w-full h-12 border-[#EAE6DF] rounded-xl text-sm font-bold hover:bg-gray-50">
                                    <Link href={isAuthenticated ? "/dashboard" : "/register"}>Get Started Free</Link>
                                </Button>
                            </Card>

                            {/* Growth */}
                            <Card className="p-8 flex flex-col border border-slate-200 bg-white rounded-3xl shadow-sm relative">
                                <div className="mb-5">
                                    <h3 className="text-xl font-extrabold text-slate-900 mb-1">Growth</h3>
                                    <p className="text-sm text-gray-500 font-bold">CRM & AI Bot</p>
                                </div>
                                <div className="mb-6 flex items-baseline">
                                    <span className="text-4xl font-extrabold text-slate-900">₹{isAnnual ? prices.growth.annual : prices.growth.monthly}</span>
                                    <span className="text-gray-600 text-sm ml-1 font-semibold">/month</span>
                                </div>
                                <ul className="text-sm text-gray-600 font-semibold space-y-2 mb-8 flex-1">
                                    {[
                                        "1 WhatsApp Number",
                                        "5,000 Conversations/month",
                                        "AI Assistant",
                                        "CRM & Lead Pipelines",
                                        "Knowledge Base",
                                        "14-Day Free Trial",
                                    ].map((f) => (
                                        <li key={f} className="flex items-start gap-2">
                                            <CheckCircle2 size={14} className="text-[#35877D] shrink-0 mt-0.5" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button asChild variant="outline" className="w-full h-12 border-[#EAE6DF] rounded-xl text-sm font-bold hover:bg-gray-50">
                                    <Link href={isAuthenticated ? "/dashboard" : "/register"}>Start 14-day Trial</Link>
                                </Button>
                            </Card>

                            {/* Business */}
                            <Card className="p-8 flex flex-col border-2 border-[#35877D] bg-[#60B187]/10 rounded-3xl shadow-md relative transform xl:-translate-y-2">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#35877D] text-white px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                                    Best Value
                                </div>
                                <div className="mb-5 mt-2">
                                    <h3 className="text-xl font-extrabold text-slate-900 mb-1">Business</h3>
                                    <p className="text-sm text-gray-500 font-bold">Campaigns & Collaboration</p>
                                </div>
                                <div className="mb-6 flex items-baseline">
                                    <span className="text-4xl font-extrabold text-[#35877D]">₹{isAnnual ? prices.business.annual : prices.business.monthly}</span>
                                    <span className="text-gray-600 text-sm ml-1 font-semibold">/month</span>
                                </div>
                                <ul className="text-sm text-gray-600 font-semibold space-y-2 mb-8 flex-1">
                                    {[
                                        "3 WhatsApp Numbers",
                                        "25,000 Conversations/month",
                                        "WhatsApp Broadcast Campaigns",
                                        "Team Collaboration & Inbox",
                                        "Advanced Analytics Dashboard",
                                        "Workflow Automation Builder",
                                    ].map((f) => (
                                        <li key={f} className="flex items-start gap-2">
                                            <CheckCircle2 size={14} className="text-[#35877D] shrink-0 mt-0.5" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button asChild className="w-full h-12 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-sm font-bold shadow-md">
                                    <Link href={isAuthenticated ? "/dashboard" : "/register"}>Upgrade to Business</Link>
                                </Button>
                            </Card>

                            {/* Enterprise */}
                            <Card className="p-8 flex flex-col border border-slate-200 bg-white rounded-3xl shadow-sm relative">
                                <div className="mb-5">
                                    <h3 className="text-xl font-extrabold text-slate-900 mb-1">Enterprise</h3>
                                    <p className="text-sm text-gray-555 font-bold">White-Label & Integrations</p>
                                </div>
                                <div className="mb-6 flex items-baseline">
                                    <span className="text-3xl font-extrabold text-slate-900">Custom Pricing</span>
                                </div>
                                <ul className="text-sm text-gray-600 font-semibold space-y-2 mb-8 flex-1">
                                    {[
                                        "Unlimited WhatsApp Numbers",
                                        "Unlimited Conversations",
                                        "White-Label Platform",
                                        "Custom API Integrations",
                                        "Dedicated Onboarding Manager",
                                        "1-Hour Priority SLA Support",
                                    ].map((f) => (
                                        <li key={f} className="flex items-start gap-2">
                                            <CheckCircle2 size={14} className="text-[#35877D] shrink-0 mt-0.5" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button asChild variant="outline" className="w-full h-12 border-[#EAE6DF] rounded-xl text-sm font-bold hover:bg-gray-50">
                                    <Link href="/contact?plan=enterprise">Inquire Custom Setup</Link>
                                </Button>
                            </Card>

                        </div>
                    </div>
                </section>

                {/* Features Comparison Matrix Section */}
                <section className="py-16 md:py-24 bg-white border-t border-slate-200">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                        <div className="text-center mb-14">
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Detailed Feature Matrix</h2>
                            <p className="text-sm text-gray-500 font-medium mt-1.5">Review plan limits side-by-side to choose the right fit</p>
                        </div>

                        {/* Comparative Table container with horizontal scroll scrollbar for mobile */}
                        <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-md bg-white">
                            <table className="w-full min-w-[750px] text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 text-sm font-bold">
                                        <th className="p-5 w-[28%]">Capability Core Specs</th>
                                        <th className="p-5 w-[18%]">Starter</th>
                                        <th className="p-5 w-[18%]">Growth</th>
                                        <th className="p-5 w-[18%] bg-[#35877D]/5 border-x border-gray-150 text-[#35877D]">Business</th>
                                        <th className="p-5 w-[18%]">Enterprise</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#EAE6DF] text-sm font-semibold text-gray-700">
                                    {comparisonMatrix.map((cat, idx) => (
                                        <React.Fragment key={idx}>
                                            {/* Category Section Header Row */}
                                            <tr className="bg-slate-50/60">
                                                <td colSpan={5} className="p-4 font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                                                    {cat.category}
                                                </td>
                                            </tr>
                                            {cat.features.map((feat, fIdx) => (
                                                <tr key={fIdx} className="hover:bg-slate-50/30 transition-colors">
                                                    <td className="p-4.5 text-slate-900 font-bold text-sm">{feat.name}</td>
                                                    <td className="p-4.5 text-sm">{feat.starter}</td>
                                                    <td className="p-4.5 text-sm">{feat.growth}</td>
                                                    <td className="p-4.5 bg-[#60B187]/5 border-x border-gray-100 font-bold text-[#35877D] text-sm">{feat.business}</td>
                                                    <td className="p-4.5 text-sm">{feat.enterprise}</td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-5xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Frequently Asked Questions</h2>
                        </div>

                        <Accordion type="single" collapsible className="w-full bg-white rounded-2xl border border-slate-200 px-6 py-2 shadow-sm">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                    Can I transition between plans at any time?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    Yes. You can upgrade, downgrade, or cancel your billing subscription directly inside your Connectly360 dashboard workspace settings. Plan adjustments are instantly prorated.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                        What counts as a "monthly message volume"?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                        Each message sent by your AI responder, bulk broadcast campaigns, or manual agent responses counts towards your monthly quota volume. Free incoming chats from customers do not deduct from your limit.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                        Are there any setup fees or hidden API costs?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                        No, there are zero hidden signup or onboarding fees. For Meta's official Cloud API, WhatsApp provides 1,000 free service-initiated conversations each month per business account; any volume beyond that is billed directly by Meta.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                    Do you offer support during integration?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    Yes! All plans include access to our developer documentation and help guides. The Business/Enterprise plan provides dedicated onboarding managers to assist you in designing workflow logic.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
}
