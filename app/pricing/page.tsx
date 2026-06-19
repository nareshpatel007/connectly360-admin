"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    MessageSquare,
    TrendingUp,
    Users,
    Zap,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Bot,
    Coins,
    BarChart3,
    Globe,
    Database,
    Phone,
    Shield,
    Check,
    X,
    ChevronDown,
    Building2,
    Truck,
    Layers,
    HelpCircle
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
    const { isAuthenticated } = useAuth();
    const [isAnnual, setIsAnnual] = useState(false);

    // Pricing details (20% discount on annual billing)
    const prices = {
        starter: { monthly: 499, annual: 399 },
        growth: { monthly: 999, annual: 799 },
        business: { monthly: 2499, annual: 1999 }
    };

    // Features Comparison Matrix Data from User specifications
    const comparisonTable = [
        { name: "Monthly Price", starter: "₹499", growth: "₹999", business: "₹2,499" },
        { name: "Monthly Credits", starter: "1,000 Credits", growth: "3,000 Credits", business: "10,000 Credits" },
        { name: "WhatsApp Numbers", starter: "1", growth: "1", business: "3" },
        { name: "Additional WhatsApp Numbers", starter: "Paid Add-on", growth: "Paid Add-on", business: "Up to 10" },
        { name: "Shared Team Inbox", starter: "✓", growth: "✓", business: "✓" },
        { name: "Send & Receive Messages", starter: "✓", growth: "✓", business: "✓" },
        { name: "Contact Management", starter: "✓", growth: "✓", business: "✓" },
        { name: "Lead Management", starter: "✓", growth: "✓", business: "✓" },
        { name: "Customer Timeline", starter: "✓", growth: "✓", business: "✓" },
        { name: "Tags & Segmentation", starter: "✓", growth: "✓", business: "✓" },
        { name: "Basic Automation", starter: "✓", growth: "✓", business: "✓" },
        { name: "Keyword Auto Replies", starter: "✓", growth: "✓", business: "✓" },
        { name: "Welcome Messages", starter: "✓", growth: "✓", business: "✓" },
        { name: "Away Messages", starter: "✓", growth: "✓", business: "✓" },
        { name: "AI Assistant", starter: "✗", growth: "✓", business: "✓" },
        { name: "OpenAI Integration", starter: "✗", growth: "✓", business: "✓" },
        { name: "AI Auto Replies", starter: "✗", growth: "✓", business: "✓" },
        { name: "AI Prompt Configuration", starter: "✗", growth: "✓", business: "✓" },
        { name: "Knowledge Base", starter: "✗", growth: "✓", business: "✓" },
        { name: "PDF Training", starter: "✗", growth: "✓", business: "✓" },
        { name: "DOCX Training", starter: "✗", growth: "✓", business: "✓" },
        { name: "FAQ Training", starter: "✗", growth: "✓", business: "✓" },
        { name: "Advanced Automation", starter: "✗", growth: "✓", business: "✓" },
        { name: "Workflow Builder", starter: "✗", growth: "✓", business: "✓" },
        { name: "Team Members", starter: "1", growth: "3", business: "10" },
        { name: "Role Management", starter: "✗", growth: "✓", business: "✓" },
        { name: "Internal Notes", starter: "✗", growth: "✓", business: "✓" },
        { name: "Team Assignment", starter: "✗", growth: "✓", business: "✓" },
        { name: "WhatsApp Campaigns", starter: "✗", growth: "✗", business: "✓" },
        { name: "Broadcast Messaging", starter: "✗", growth: "✗", business: "✓" },
        { name: "Scheduled Campaigns", starter: "✗", growth: "✗", business: "✓" },
        { name: "Customer Segmentation Campaigns", starter: "✗", growth: "✗", business: "✓" },
        { name: "Campaign Analytics", starter: "✗", growth: "✗", business: "✓" },
        { name: "Analytics Dashboard", starter: "Basic", growth: "Standard", business: "Advanced" },
        { name: "Message Analytics", starter: "✓", growth: "✓", business: "✓" },
        { name: "Lead Analytics", starter: "✗", growth: "✓", business: "✓" },
        { name: "Team Performance Reports", starter: "✗", growth: "✗", business: "✓" },
        { name: "Credit Usage Reports", starter: "✓", growth: "✓", business: "✓" },
        { name: "Webhooks", starter: "✗", growth: "✓", business: "✓" },
        { name: "API Access", starter: "✗", growth: "✗", business: "✓" },
        { name: "Custom Branding", starter: "✗", growth: "✗", business: "✓" },
        { name: "Priority Support", starter: "✗", growth: "✓", business: "✓" },
        { name: "Dedicated Account Manager", starter: "✗", growth: "✗", business: "✓" },
        { name: "Credit Recharge", starter: "✓", growth: "✓", business: "✓" },
        { name: "Email Support", starter: "✓", growth: "✓", business: "✓" },
        { name: "Live Chat Support", starter: "✗", growth: "✓", business: "✓" }
    ];

    // Credit Recharge Packs
    const rechargePacks = [
        { name: "Small Pack", credits: "500 Credits", price: "₹99" },
        { name: "Medium Pack", credits: "2,000 Credits", price: "₹299" },
        { name: "Large Pack", credits: "10,000 Credits", price: "₹999" },
        { name: "Enterprise Pack", credits: "50,000 Credits", price: "Custom Pricing" }
    ];

    // Credit Consumption actions
    const creditUsageRules = [
        { action: "AI Reply", cost: "1 Credit" },
        { action: "Knowledge Base Search", cost: "2 Credits" },
        { action: "Lead Creation", cost: "1 Credit" },
        { action: "Media Message", cost: "2 Credits" },
        { action: "Campaign Message", cost: "1 Credit" },
        { action: "Workflow Execution", cost: "1 Credit" }
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden selection:bg-[#35877D] selection:text-white">
            {/* Header */}
            <LandingHeader />

            <main className="pt-40">
                {/* Hero Title Grid */}
                <section className="relative pb-16 overflow-hidden">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto text-center space-y-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35877D]/10 text-[#35877D] text-xs font-bold border border-[#35877D]/20 mb-1">
                            <Coins size={12} className="animate-pulse" />
                            Flexible Plans & Top-ups
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                            Plans Built for <span className="text-[#35877D]">Every Stage of Growth</span>
                        </h1>
                        <p className="text-base text-gray-550 font-semibold max-w-2xl mx-auto leading-relaxed">
                            Upgrade, downgrade, or top-up credits at any time. Get the best pricing for automated customer engagement and CRM syncing.
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
                                <span className="bg-[#35877D]/10 text-[#35877D] text-[10px] px-2.5 py-0.5 rounded-full font-extrabold border border-slate-200">Save 20%</span>
                            </Label>
                        </div>
                    </div>
                </section>

                {/* Main Cards Row */}
                <section className="pb-16">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                            {/* Starter */}
                            <Card className="p-8 flex flex-col border border-slate-200 bg-white rounded-3xl shadow-sm relative">
                                <div className="mb-5">
                                    <span className="text-[10px] font-bold text-[#35877D] bg-[#35877D]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Starter</span>
                                    <h3 className="text-xl font-extrabold text-slate-900 mt-2 mb-1">Starter</h3>
                                    <p className="text-sm text-gray-500 font-semibold">For Retail Stores &amp; Entrepreneurs</p>
                                </div>
                                <div className="mb-6 flex items-baseline">
                                    <span className="text-4xl font-extrabold text-slate-900">₹{isAnnual ? prices.starter.annual : prices.starter.monthly}</span>
                                    <span className="text-gray-600 text-sm ml-1 font-semibold">/month</span>
                                </div>
                                <ul className="text-sm text-gray-600 font-semibold space-y-2 mb-8 flex-1">
                                    {[
                                        "1,000 Monthly Credits",
                                        "1 WhatsApp Number",
                                        "Basic Automation",
                                        "Shared Team Inbox",
                                        "Contact & Lead Directory",
                                        "Keyword Auto Replies"
                                    ].map((f) => (
                                        <li key={f} className="flex items-start gap-2">
                                            <CheckCircle2 size={14} className="text-[#35877D] shrink-0 mt-0.5" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button asChild variant="outline" className="w-full h-12 border-slate-200 rounded-xl text-sm font-bold hover:bg-gray-50">
                                    <Link href={isAuthenticated ? "/dashboard" : "/register"}>Get Started</Link>
                                </Button>
                            </Card>

                            {/* Growth */}
                            <Card className="p-8 flex flex-col border border-[#35877D]/20 bg-[#35877D]/5 rounded-3xl shadow-sm relative transform xl:-translate-y-2">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#35877D] text-white px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                                    Most Popular
                                </div>
                                <div className="mb-5 mt-2">
                                    <span className="text-[10px] font-bold text-[#35877D] bg-white px-2 py-0.5 rounded-full uppercase tracking-wider">Growth</span>
                                    <h3 className="text-xl font-extrabold text-slate-900 mt-2 mb-1">Growth</h3>
                                    <p className="text-sm text-gray-500 font-semibold">For Manufacturers &amp; Agencies</p>
                                </div>
                                <div className="mb-6 flex items-baseline">
                                    <span className="text-4xl font-extrabold text-[#35877D]">₹{isAnnual ? prices.growth.annual : prices.growth.monthly}</span>
                                    <span className="text-gray-600 text-sm ml-1 font-semibold">/month</span>
                                </div>
                                <ul className="text-sm text-gray-600 font-semibold space-y-2 mb-8 flex-1">
                                    {[
                                        "3,000 Monthly Credits",
                                        "1 WhatsApp Number",
                                        "AI Assistant & OpenAI",
                                        "Knowledge Base Training",
                                        "Workflow Automation Builder",
                                        "Advanced CRM Integration"
                                    ].map((f) => (
                                        <li key={f} className="flex items-start gap-2">
                                            <CheckCircle2 size={14} className="text-[#35877D] shrink-0 mt-0.5" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button asChild className="w-full h-12 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-sm font-bold shadow-md">
                                    <Link href={isAuthenticated ? "/dashboard" : "/register"}>Start Free Trial</Link>
                                </Button>
                            </Card>

                            {/* Business */}
                            <Card className="p-8 flex flex-col border border-slate-200 bg-white rounded-3xl shadow-sm relative">
                                <div className="mb-5">
                                    <span className="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Business</span>
                                    <h3 className="text-xl font-extrabold text-slate-900 mt-2 mb-1">Business</h3>
                                    <p className="text-sm text-gray-500 font-semibold">For Sales &amp; Support Teams</p>
                                </div>
                                <div className="mb-6 flex items-baseline">
                                    <span className="text-4xl font-extrabold text-slate-900">₹{isAnnual ? prices.business.annual : prices.business.monthly}</span>
                                    <span className="text-gray-600 text-sm ml-1 font-semibold">/month</span>
                                </div>
                                <ul className="text-sm text-gray-600 font-semibold space-y-2 mb-8 flex-1">
                                    {[
                                        "10,000 Monthly Credits",
                                        "3 WhatsApp Numbers",
                                        "WhatsApp Broadcast Campaigns",
                                        "10 Team Inbox Seats",
                                        "Campaigns & Analytics",
                                        "API Access & Webhooks"
                                    ].map((f) => (
                                        <li key={f} className="flex items-start gap-2">
                                            <CheckCircle2 size={14} className="text-[#35877D] shrink-0 mt-0.5" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button asChild variant="outline" className="w-full h-12 border-slate-200 rounded-xl text-sm font-bold hover:bg-gray-50">
                                    <Link href={isAuthenticated ? "/dashboard" : "/register"}>Upgrade Plan</Link>
                                </Button>
                            </Card>

                            {/* Enterprise */}
                            <Card className="p-8 flex flex-col border border-slate-200 bg-white rounded-3xl shadow-sm relative">
                                <div className="mb-5">
                                    <span className="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Enterprise</span>
                                    <h3 className="text-xl font-extrabold text-slate-900 mt-2 mb-1">Enterprise</h3>
                                    <p className="text-sm text-gray-500 font-semibold">Custom scale solutions</p>
                                </div>
                                <div className="mb-6 flex items-baseline">
                                    <span className="text-3xl font-extrabold text-slate-900">Contact Sales</span>
                                </div>
                                <ul className="text-sm text-gray-600 font-semibold space-y-2 mb-8 flex-1">
                                    {[
                                        "Unlimited Team Members",
                                        "Unlimited WhatsApp Numbers",
                                        "White Label Solution",
                                        "Dedicated Server Host",
                                        "Dedicated SLA & Account Manager",
                                        "Custom Credit Packages"
                                    ].map((f) => (
                                        <li key={f} className="flex items-start gap-2">
                                            <CheckCircle2 size={14} className="text-[#35877D] shrink-0 mt-0.5" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button asChild variant="outline" className="w-full h-12 border-slate-200 rounded-xl text-sm font-bold hover:bg-gray-50">
                                    <Link href="/contact?plan=enterprise">Talk to Sales</Link>
                                </Button>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Features Comparison Matrix Section */}
                <section className="py-16 bg-white border-t border-slate-200">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Connectly360 Pricing &amp; Feature Comparison</h2>
                            <p className="text-sm text-gray-550 font-semibold mt-1.5">Review plan capabilities and credit allowances side-by-side</p>
                        </div>

                        {/* Comparative Table */}
                        <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-md bg-white">
                            <table className="w-full min-w-[750px] text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 text-sm font-bold">
                                        <th className="p-4.5 w-[40%]">Features</th>
                                        <th className="p-4.5 w-[20%]">Starter</th>
                                        <th className="p-4.5 w-[20%] bg-[#35877D]/5 border-x border-[#35877D]/10 text-[#35877D]">Growth</th>
                                        <th className="p-4.5 w-[20%]">Business</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-semibold text-slate-700">
                                    {comparisonTable.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 text-slate-900 font-bold">{row.name}</td>
                                            <td className="p-4">
                                                {row.starter === "✓" ? <Check size={16} className="text-emerald-500" /> : row.starter === "✗" ? <X size={16} className="text-gray-300" /> : row.starter}
                                            </td>
                                            <td className="p-4 bg-[#35877D]/5 border-x border-[#35877D]/10 font-bold text-[#35877D]">
                                                {row.growth === "✓" ? <Check size={16} className="text-[#35877D]" /> : row.growth === "✗" ? <X size={16} className="text-[#35877D]/40" /> : row.growth}
                                            </td>
                                            <td className="p-4">
                                                {row.business === "✓" ? <Check size={16} className="text-emerald-500" /> : row.business === "✗" ? <X size={16} className="text-gray-300" /> : row.business}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Credit Top-up and Consumption Section */}
                <section className="py-16 bg-slate-50 border-t border-slate-200">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            {/* Recharge Packs */}
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">Credit Recharge Packs</h2>
                                    <p className="text-sm text-gray-500 font-semibold mt-1">Need more volume? Purchase one-time credit top-up packs directly inside the dashboard workspace.</p>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {rechargePacks.map((pack) => (
                                        <Card key={pack.name} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{pack.name}</p>
                                            <p className="text-lg font-black text-slate-900">{pack.credits}</p>
                                            <p className="text-sm font-extrabold text-[#35877D]">{pack.price}</p>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Fair Usage Policy */}
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">Fair Usage Policy &amp; Consumption</h2>
                                    <p className="text-sm text-gray-500 font-semibold mt-1">Details on how automation credits are consumed. Incoming customer messages are free and consume no credits.</p>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 text-xs font-bold uppercase tracking-wider">
                                                <th className="p-4 w-[60%]">Action</th>
                                                <th className="p-4 w-[40%]">Credits Consumed</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-semibold text-slate-700">
                                            {creditUsageRules.map((rule, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/50">
                                                    <td className="p-4 text-slate-900 font-bold">{rule.action}</td>
                                                    <td className="p-4 font-mono text-[#35877D] font-bold">{rule.cost}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 md:py-24 bg-white border-t border-slate-200">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-5xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Frequently Asked Questions</h2>
                        </div>

                        <Accordion type="single" collapsible className="w-full bg-white rounded-2xl border border-slate-200 px-6 py-2 shadow-sm">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                    Can I upgrade or downgrade my plan at any time?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    Yes. You can upgrade, downgrade, or cancel your subscription directly from your Connectly360 dashboard workspace settings. Plan adjustments are prorated instantly.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                    How do credits work and what happens when I run out?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    Each plan includes a monthly quota of credits (1,000 for Starter, 3,000 for Growth, and 10,000 for Business). Credits are consumed based on actions like AI replies, knowledge base searches, and campaign messages. Incoming messages from customers are completely free. If you run out, you can buy top-up packs starting at ₹99.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                    Are there any hidden fees or extra WhatsApp charges?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    There are zero onboarding or setup fees. Official Meta WhatsApp Cloud API costs (outside of the 1,000 free conversation tier Meta provides monthly per business account) are billed directly by Meta. Connectly360 only charges your monthly subscription and any optional credit top-up packs.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                    Do you offer a free trial?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    Yes! We offer a 7-day free trial upon registration. This allows you to explore the AI Assistant, train the bot on your custom knowledge base, and build automated workflows.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-5">
                                <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                    Do my customers need to download a new app?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    No. Your customers chat directly inside their native WhatsApp application. They receive instant, accurate replies from our AI system without having to install any extra portals or sign up for account services.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-6">
                                <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                    Can we transition from the AI bot to a human agent?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    Absolutely. If the AI agent encounters a complex query or if the user requests human assistance, the chat transitions seamlessly to your central inbox, and a notification is instantly triggered for your team on the dashboard.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-7">
                                <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                    Can I connect my existing WhatsApp phone number?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    Yes. You can use your existing WhatsApp number. However, you will need to delete any active WhatsApp App or WhatsApp Business App account associated with that number first so it can register with Meta&apos;s Cloud API.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-8">
                                <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                    Is my business and conversational data secure?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold">
                                    Yes. We encrypt all messages in transit and at rest. Your customer data, contact logs, training files, and business workflows are stored securely in compliant enterprise database hosts.
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
