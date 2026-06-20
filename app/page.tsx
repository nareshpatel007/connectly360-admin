"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
    ShoppingBag,
    Building2,
    Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/lib/auth-context";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

export default function LandingPage() {
    const { isAuthenticated, user } = useAuth();
    const [isAnnual, setIsAnnual] = useState(false);

    // Hero Simulator Loop State
    const [heroStep, setHeroStep] = useState(0);
    const heroMessages = [
        { sender: "client", text: "Hi! Can you check shipping status for order #2045?" },
        { sender: "bot", text: "Checking order #2045... 📦 Yes, it has shipped via BlueDart (Tracking: BD94028). Delivery expected tomorrow by 5 PM!" },
        { sender: "client", text: "Perfect. Do you also sync this info to our CRM?" },
        { sender: "bot", text: "Absolutely! Connectly360 auto-syncs customer profiles, interest history, and order statuses to your CRM database in real-time. 🔄" },
        { sender: "client", text: "Awesome! Thanks for the instant support." },
        { sender: "bot", text: "You're welcome! Our AI agents handle inquiries 24/7 to keep your customer pipelines moving. 🚀" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setHeroStep((prev) => (prev + 1) % (heroMessages.length + 2));
        }, 3200);
        return () => clearInterval(interval);
    }, []);

    // Sandbox Industry Play State
    const [activeIndustry, setActiveIndustry] = useState("ecommerce");
    const industryData = {
        ecommerce: {
            title: "E-Commerce & Retail Stores",
            badge: "Online & Retail Shop",
            initChat: [
                { sender: "client", text: "What is the price of your organic shampoo? Do you deliver to Bangalore?" },
                { sender: "bot", text: "Yes, we deliver pan-India! Our Organic Shampoo is ₹499. You can order directly. Do you want to check your order status?" },
                { sender: "client", text: "Yes, check order status for #2085." },
                { sender: "bot", text: "Checking order #2085... 📦 It has shipped via BlueDart (Tracking: BD94028). Delivery expected tomorrow by 5 PM! 🚀" }
            ],
            crmFields: {
                leadSource: "WhatsApp Organic",
                interest: "Shampoo & Delivery Info",
                capturedData: "Order ID #2085 | Bangalore",
                status: "Resolved",
                statusColor: "bg-green-100 text-green-800"
            }
        },
        realestate: {
            title: "Real Estate & Solar Agencies",
            badge: "Property & Services",
            initChat: [
                { sender: "client", text: "I'm looking for 3BHK flat options in Ahmedabad or pricing for 5kW Solar." },
                { sender: "bot", text: "Great choice! We have 3 premium 3BHK flats starting at ₹2.5 Cr, or 5kW Solar setups starting at ₹1.8 Lakhs. Which one would you like details on?" },
                { sender: "client", text: "3BHK apartments. Send pricing brochure." },
                { sender: "bot", text: "Perfect! Sending Ahmedabad property brochure brochure.pdf 🏢. Let me schedule a site visit with our project coordinator." }
            ],
            crmFields: {
                leadSource: "Property Portal Ad",
                interest: "3BHK Apartment Site Visit",
                capturedData: "Ahmedabad | Budget: ₹2.5 Cr",
                status: "Qualified",
                statusColor: "bg-blue-100 text-blue-800"
            }
        },
        wholesale: {
            title: "Manufacturers & B2B Oil Mills",
            badge: "B2B Mills & Production",
            initChat: [
                { sender: "client", text: "Hi, need today's bulk wholesale rate card for Mustard Oil tins." },
                { sender: "bot", text: "Today's Mustard Oil rate is ₹1,650/ tin. Bulk discounts apply for orders >100 tins. Please enter your GSTIN." },
                { sender: "client", text: "07AAAAA1111A1Z1. Send catalog and dealer form." },
                { sender: "bot", text: "GSTIN verified (Acme Mills). Sending bulk quotation PDF... 📄. I've also logged your dealer inquiry." }
            ],
            crmFields: {
                leadSource: "Wholesale Directory",
                interest: "Mustard Oil (>100 qty)",
                capturedData: "GSTIN: 07AAAAA1111A1Z1 | Acme Mills",
                status: "Proposal",
                statusColor: "bg-[#EAF7F2] text-[#35877D]"
            }
        }
    };

    // ROI Calculator State
    const [monthlyChats, setMonthlyChats] = useState(2500);
    const [hourlyWage, setHourlyWage] = useState(250);

    // Calculations
    const rawHours = (monthlyChats * 8) / 60;
    const hoursSaved = Math.round(rawHours * 0.85);
    const moneySaved = Math.round(hoursSaved * hourlyWage);
    const growthPlanPrice = isAnnual ? 799 : 999;
    const roiMultiplier = Math.max(1, Math.round(moneySaved / growthPlanPrice));

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden selection:bg-[#35877D] selection:text-white">

            {/* Header */}
            <LandingHeader />

            <main className="pt-12">

                {/* Hero Section */}
                <section className="relative py-16 md:py-24 bg-gradient-to-b from-slate-50 via-slate-50/50 to-white overflow-hidden">
                    <div className="absolute top-10 right-0 w-[550px] h-[550px] bg-radial-gradient from-[#35877D]/6 via-[#35877D]/1 to-transparent -z-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-0 w-[350px] h-[350px] bg-radial-gradient from-[#D99B26]/6 via-[#D99B26]/1 to-transparent -z-10 rounded-full blur-2xl"></div>

                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                            {/* Hero Left Content */}
                            <motion.div
                                className="lg:col-span-6"
                                initial="hidden"
                                animate="show"
                                variants={staggerContainer}
                            >
                                <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF7F2] text-[#35877D] text-xs font-bold mb-6 border border-[#35877D]/20 shadow-sm">
                                    <Sparkles size={13} className="text-[#35877D] fill-[#35877D]/15 animate-pulse" />
                                    Official Meta Verified Partner
                                </motion.div>

                                <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
                                    Turn WhatsApp Chats Into <span className="text-[#35877D]">Qualified CRM Leads Automatically.</span>
                                </motion.h1>

                                <motion.p variants={fadeUp} className="text-base sm:text-lg text-gray-500 mb-8 max-w-xl leading-relaxed font-medium">
                                    Connectly360 is an AI-powered WhatsApp CRM and customer engagement platform that helps businesses automate conversations, capture leads, manage customers, and grow sales from a single dashboard.
                                </motion.p>

                                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-8">
                                    {isAuthenticated ? (
                                        <Button asChild size="lg" className="h-13 px-8 text-sm font-semibold rounded-xl bg-[#35877D] hover:bg-[#2c6f66] text-white shadow-md hover:shadow-lg transition-all font-bold">
                                            <Link href="/dashboard">
                                                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    ) : (
                                        <>
                                            <Button asChild size="lg" className="h-13 px-8 text-sm font-semibold rounded-xl bg-[#35877D] hover:bg-[#2c6f66] text-white shadow-md hover:shadow-lg transition-all font-bold">
                                                <Link href="/register">
                                                    Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="lg" asChild className="h-13 px-8 text-sm font-semibold rounded-xl border-slate-200 bg-white text-slate-800 hover:bg-gray-50 font-bold">
                                                <a href="#playground">Try Live Playground</a>
                                            </Button>
                                        </>
                                    )}
                                </motion.div>

                                {/* Repetitive Questions Automated */}
                                <motion.div variants={fadeUp} className="mb-8 p-4 bg-[#35877D]/5 border border-[#35877D]/10 rounded-2xl">
                                    <p className="text-[10px] font-extrabold text-[#35877D] uppercase tracking-wider mb-2.5">Auto-Answer Repetitive Customer Queries:</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {[
                                            "What is the price?",
                                            "Do you deliver?",
                                            "Send catalog",
                                            "Dealer inquiry",
                                            "Order status",
                                            "Product information"
                                        ].map((q, idx) => (
                                            <div key={idx} className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                                                <CheckCircle2 size={13} className="text-[#35877D] shrink-0" />
                                                <span>{q}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Hero Right Content: Synced Side-by-Side Live Simulator */}
                            <motion.div
                                className="lg:col-span-6 w-full flex flex-col sm:flex-row gap-5 items-stretch justify-center relative"
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                            >
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-0.5 border-t-2 border-dashed border-[#35877D]/50 hidden sm:block z-0 pointer-events-none"></div>

                                {/* Screen A: WhatsApp Client Phone Simulator */}
                                <div className="w-full max-w-[270px] bg-white rounded-[32px] p-2 shadow-xl border-4 border-gray-900 overflow-hidden flex-1 shrink-0 aspect-[9/18.5] flex flex-col z-10 mx-auto">
                                    <div className="w-24 h-4 bg-gray-900 rounded-b-xl mx-auto shrink-0 mb-1"></div>

                                    <div className="flex-1 bg-[#efeae2] rounded-[24px] overflow-hidden flex flex-col pt-2 relative">
                                        <div className="bg-[#075e54] text-white p-2.5 pt-4 flex items-center gap-2 shrink-0 shadow-sm">
                                            <div className="h-6 w-6 rounded-full bg-[#128c7e] flex items-center justify-center text-[10px] font-bold">
                                                C3
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-extrabold leading-tight">Connectly360 AI Agent</p>
                                                <p className="text-[7.5px] text-green-300 font-semibold flex items-center gap-0.5">
                                                    <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse"></span> Auto-responding
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex-1 p-2 flex flex-col justify-end gap-2 text-[9.5px] leading-relaxed pb-4 overflow-y-auto">
                                            <AnimatePresence initial={false}>
                                                {heroMessages.slice(0, heroStep).map((msg, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className={`flex max-w-[85%] ${msg.sender === "client" ? "self-end" : "self-start"}`}
                                                    >
                                                        <div className={`p-2 rounded-xl shadow-xs font-semibold ${msg.sender === "client"
                                                            ? "bg-[#dcf8c6] text-gray-800 rounded-tr-none"
                                                            : "bg-white text-gray-800 rounded-tl-none border border-gray-150"
                                                            }`}>
                                                            {msg.text}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>

                                            {heroStep > 0 && heroStep <= heroMessages.length && heroStep % 2 !== 0 && (
                                                <div className="self-start bg-white p-2 rounded-xl shadow-xs border border-gray-150 flex items-center gap-1 shrink-0">
                                                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
                                                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Mock Input Bar */}
                                        <div className="bg-[#f0f0f0] p-1.5 flex items-center gap-1.5 border-t border-gray-200 shrink-0">
                                            <div className="flex-1 bg-white rounded-full h-6 px-2 text-[8px] flex items-center text-gray-400 font-semibold select-none">
                                                Message...
                                            </div>
                                            <div className="w-6 h-6 rounded-full bg-[#128c7e] flex items-center justify-center text-white text-[8px] select-none">
                                                ➤
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Screen B: Connectly360 CRM Dashboard Simulator */}
                                <div className="w-full max-w-[270px] bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200 flex-1 shrink-0 flex flex-col justify-between z-10 relative mx-auto">
                                    <div className="space-y-3.5">
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#35877D]"></div>
                                                <span className="text-[10px] font-bold text-slate-900">Connectly360 CRM</span>
                                            </div>
                                            <span className="text-[8px] bg-emerald-50 text-[#35877D] border border-emerald-200 px-1.5 py-0.5 rounded-full font-bold">
                                                Live Sync
                                            </span>
                                        </div>

                                        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[8px] font-extrabold tracking-wider text-gray-400 uppercase">Total CRM Leads</span>
                                                <TrendingUp size={11} className="text-[#35877D]" />
                                            </div>
                                            <p className="text-xl font-extrabold text-slate-900 mt-1">
                                                {heroStep >= 4 ? 1426 : 1425}
                                            </p>
                                            <p className="text-[8px] text-[#35877D] font-bold mt-0.5">
                                                {heroStep >= 4 ? "+1 qualified just now" : "+24 qualified today"}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <span className="text-[8px] font-extrabold tracking-wider text-gray-400 uppercase block">Active Leads Pipelines Log</span>
                                            <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-[9px] font-semibold flex items-center justify-between shadow-xs">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <div className="h-5 w-5 rounded-full bg-[#EAF7F2] text-[#35877D] border border-[#35877D]/20 flex items-center justify-center shrink-0">
                                                        L
                                                    </div>
                                                    <span className="truncate text-gray-700 font-extrabold">
                                                        {heroStep >= 4 ? "customer@order-query.com" : "visitor@acme.org"}
                                                    </span>
                                                </div>
                                                <span className={`text-[7px] font-extrabold px-1.5 py-0.5 rounded-full uppercase shrink-0 ${heroStep >= 4
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : heroStep >= 2
                                                        ? "bg-green-100 text-green-800 animate-pulse"
                                                        : "bg-gray-100 text-gray-600"
                                                    }`}>
                                                    {heroStep >= 4 ? "Qualified" : heroStep >= 2 ? "Resolved" : "Syncing"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 bg-[#0d3530] text-white p-2.5 rounded-xl shadow-lg border border-[#0d3530]/80 flex items-center gap-2">
                                        <div className="h-5 w-5 rounded-full bg-emerald-800 flex items-center justify-center">
                                            <Bot size={11} className="text-[#35877D]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[8px] font-bold text-[#35877D] uppercase leading-tight">Live CRM Capture</p>
                                            <p className="text-[9px] text-gray-300 truncate">
                                                {heroStep >= 4
                                                    ? "CRM Integration | Customer Sync Configured"
                                                    : heroStep >= 2
                                                        ? "Order Status | Order ID #2045"
                                                        : "Active Session | Awaiting inquiry"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </section>

                {/* Who We Serve Section */}
                <section className="py-16 md:py-20 bg-[#0d3530] relative overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#35877D]/30 blur-3xl -z-0 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-[#35877D]/10 blur-2xl -z-0 pointer-events-none" />

                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto relative z-10">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#35877D]/15 text-[#35877D] text-xs font-bold border border-[#35877D]/30 mb-4">
                                <Sparkles size={12} className="fill-[#35877D]/30" />
                                Industries We Power
                            </span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                                Built for Every Business That Talks to Customers
                            </h2>
                            <p className="text-base text-gray-400 font-medium leading-relaxed mt-3 max-w-2xl mx-auto">
                                From oil mills to e-commerce, Connectly360 adapts to the unique communication needs of your industry — right out of the box.
                            </p>
                        </div>

                        {/* Industry Cards Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {[
                                { label: "Manufacturers", icon: <Truck size={22} />, color: "from-emerald-800/60 to-emerald-900/80", ring: "ring-emerald-700/40" },
                                { label: "Oil Mills", icon: <Database size={22} />, color: "from-amber-800/60 to-amber-900/80", ring: "ring-amber-700/40" },
                                { label: "Travel Agencies", icon: <Globe size={22} />, color: "from-sky-800/60 to-sky-900/80", ring: "ring-sky-700/40" },
                                { label: "Real Estate", icon: <Building2 size={22} />, color: "from-violet-800/60 to-violet-900/80", ring: "ring-violet-700/40" },
                                { label: "Schools & Colleges", icon: <Layers size={22} />, color: "from-rose-800/60 to-rose-900/80", ring: "ring-rose-700/40" },
                                { label: "Hospitals & Clinics", icon: <Shield size={22} />, color: "from-teal-800/60 to-teal-900/80", ring: "ring-teal-700/40" },
                                { label: "Retail Stores", icon: <ShoppingBag size={22} />, color: "from-orange-800/60 to-orange-900/80", ring: "ring-orange-700/40" },
                                { label: "Solar Companies", icon: <Zap size={22} />, color: "from-yellow-800/60 to-yellow-900/80", ring: "ring-yellow-700/40" },
                                { label: "Service Businesses", icon: <Share2 size={22} />, color: "from-cyan-800/60 to-cyan-900/80", ring: "ring-cyan-700/40" },
                                { label: "E-commerce", icon: <BarChart3 size={22} />, color: "from-indigo-800/60 to-indigo-900/80", ring: "ring-indigo-700/40" },
                            ].map(({ label, icon, color, ring }) => (
                                <div
                                    key={label}
                                    className={`group relative bg-gradient-to-br ${color} rounded-2xl p-5 ring-1 ${ring} hover:scale-[1.04] hover:ring-2 transition-all duration-300 cursor-default flex flex-col items-center text-center gap-3 shadow-lg`}
                                >
                                    {/* Glow dot */}
                                    <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#35877D]/70 transition-colors duration-300" />
                                    {/* Icon */}
                                    <div className="h-11 w-11 rounded-xl bg-white/10 flex items-center justify-center text-white/90 group-hover:bg-white/20 transition-all duration-300 shadow-inner">
                                        {icon}
                                    </div>
                                    {/* Label */}
                                    <span className="text-xs font-extrabold text-white/90 leading-tight tracking-wide">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Bottom CTA strip */}
                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-5 border-t border-white/10 pt-8">
                            <p className="text-sm text-gray-400 font-medium">
                                Don&apos;t see your industry? Connectly360 works for <span className="text-white font-bold">any business</span> that communicates on WhatsApp.
                            </p>
                            <Link href="/contact" className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#35877D] hover:bg-[#2c6f66] text-white text-sm font-bold transition-all shadow-md">
                                Talk to Us <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Core Products Section - The 4 pillars */}
                <section id="products" className="py-16 md:py-24 bg-white border-y border-slate-200">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <span className="text-[10px] font-extrabold bg-[#EAF7F2] text-[#785110] border border-[#35877D]/20 px-3 py-1 rounded-full uppercase tracking-wider">
                                All-In-One Unified Suite
                            </span>
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-4">
                                Four Powerful Products. One Dashboard.
                            </h2>
                            <p className="text-base text-gray-500 font-medium leading-relaxed mt-3">
                                Stop duct-taping separate chatbot builders, broadcasting tools, and customer databases. Connectly360 natively integrates your entire sales and support pipeline.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Product 1: CRM */}
                            <Card className="p-6 border border-slate-200 hover:border-[#35877D]/30 bg-slate-50/10 hover:bg-white transition-all shadow-sm rounded-2xl flex flex-col justify-between group">
                                <div className="space-y-4">
                                    <div className="h-10 w-10 bg-emerald-50 text-[#35877D] border border-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Database size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#35877D] transition-colors">CRM & Lead Pipelines</h3>
                                        <p className="text-sm text-gray-600 font-semibold leading-relaxed mt-2">
                                            Track client directories, manage follow-ups, and organize deals. Route leads through structured pipeline stages: New, Contacted, Qualified, Proposal, Won, Lost.
                                        </p>
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 pt-4 mt-6 flex items-center gap-1 text-[11px] font-bold text-[#35877D]">
                                    <span>Manage Contacts & Pipelines</span>
                                    <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </Card>

                            {/* Product 2: WhatsApp Integration */}
                            <Card className="p-6 border border-slate-200 hover:border-[#35877D]/30 bg-slate-50/10 hover:bg-white transition-all shadow-sm rounded-2xl flex flex-col justify-between group">
                                <div className="space-y-4">
                                    <div className="h-10 w-10 bg-emerald-50 text-[#35877D] border border-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Smartphone size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#35877D] transition-colors">Meta Embedded Signup</h3>
                                        <p className="text-sm text-gray-600 font-semibold leading-relaxed mt-2">
                                            Onboard your WABA with a single click. Connect official numbers without manual tokens. Fully supports Meta Cloud API, multiple accounts, and verification.
                                        </p>
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 pt-4 mt-6 flex items-center gap-1 text-[11px] font-bold text-[#35877D]">
                                    <span>One-Click Meta Signup</span>
                                    <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </Card>

                            {/* Product 3: AI Chatbot */}
                            <Card className="p-6 border border-slate-200 hover:border-[#35877D]/30 bg-slate-50/10 hover:bg-white transition-all shadow-sm rounded-2xl flex flex-col justify-between group">
                                <div className="space-y-4">
                                    <div className="h-10 w-10 bg-[#EAF7F2] text-[#35877D] border border-[#35877D]/20 rounded-xl flex items-center justify-center shrink-0">
                                        <Bot size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#35877D] transition-colors">AI Assistant</h3>
                                        <p className="text-sm text-gray-600 font-semibold leading-relaxed mt-2">
                                            Auto-reply to FAQs using GPT models. Train the assistant by uploading PDFs, DOCXs, or TXTs. Features prompt logic and multi-language support.
                                        </p>
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 pt-4 mt-6 flex items-center gap-1 text-[11px] font-bold text-[#35877D]">
                                    <span>Train Custom Knowledge</span>
                                    <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </Card>

                            {/* Product 4: Workflows */}
                            <Card className="p-6 border border-slate-200 hover:border-[#35877D]/30 bg-slate-50/10 hover:bg-white transition-all shadow-sm rounded-2xl flex flex-col justify-between group">
                                <div className="space-y-4">
                                    <div className="h-10 w-10 bg-emerald-50 text-[#35877D] border border-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Zap size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#35877D] transition-colors">Automation Engine</h3>
                                        <p className="text-sm text-gray-600 font-semibold leading-relaxed mt-2">
                                            Build keyword-based replies (e.g. price, catalog). Automate team assignments, follow-ups, and business hours with a no-code visual workflow editor.
                                        </p>
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 pt-4 mt-6 flex items-center gap-1 text-[11px] font-bold text-[#35877D]">
                                    <span>Configure Automation</span>
                                    <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Sandbox Playground Interactive Section */}
                <section id="playground" className="py-16 md:py-24 bg-slate-50">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                        <div className="text-center max-w-2xl mx-auto mb-14">
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Interactive Industry Playground</h2>
                            <p className="text-base text-slate-500 font-medium leading-relaxed mt-2.5">
                                Select a pre-configured workflow tab below to see how our AI chat flows interact with customers and instantly sync formatted data directly to your CRM.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                            {/* Tab Selectors: Swipable on mobile/tablet, vertical on desktop */}
                            <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 lg:px-1 lg:py-1 scrollbar-none snap-x shrink-0 lg:h-full">
                                {Object.keys(industryData).map((key) => {
                                    const item = industryData[key as keyof typeof industryData];
                                    const isActive = activeIndustry === key;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setActiveIndustry(key)}
                                            className={`p-4 text-left rounded-2xl border transition-all duration-300 min-w-[260px] sm:min-w-[300px] lg:min-w-0 lg:flex-1 snap-center shrink-0 flex items-start gap-3.5 ${isActive
                                                ? "bg-white border-[#35877D] shadow-md ring-1 ring-[#35877D]/10 lg:scale-[1.01]"
                                                : "bg-white/40 border-slate-200 hover:bg-white/70 hover:border-[#35877D]/20"
                                                }`}
                                        >
                                            {/* Icon Indicator Box */}
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${isActive
                                                ? "bg-[#35877D] text-white border-transparent"
                                                : "bg-white border-slate-200 text-[#35877D]"
                                                }`}>
                                                {key === "ecommerce" && <ShoppingBag size={18} />}
                                                {key === "realestate" && <Building2 size={18} />}
                                                {key === "wholesale" && <Truck size={18} />}
                                            </div>

                                            {/* Text Content */}
                                            <div className="space-y-1 flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[9px] font-extrabold bg-[#EAF7F2] text-[#785110] border border-[#35877D]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                        {item.badge}
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-extrabold text-slate-900 mt-1.5">{item.title}</h3>
                                                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                                                    {key === "ecommerce" && "Auto-resolves pricing, shipping queries, and tracks live order status."}
                                                    {key === "realestate" && "Qualifies properties, solar requirements, budgets, and schedules site visits."}
                                                    {key === "wholesale" && "Handles bulk rates, catalog PDF requests, dealer inquiries, and GSTIN checks."}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Live Sandbox Widget */}
                            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-slate-200 rounded-3xl p-5 shadow-lg relative min-h-[380px]">
                                {/* Chat Box Display */}
                                <div className="bg-[#efeae2] rounded-2xl p-3 flex flex-col justify-between overflow-hidden">
                                    <div className="bg-[#075e54] text-white p-2 rounded-xl flex items-center gap-1.5 shrink-0 shadow-xs mb-3">
                                        <Smartphone size={12} />
                                        <span className="text-[9px] font-extrabold truncate">Customer Chat Simulator</span>
                                    </div>

                                    <div className="flex-1 space-y-3 overflow-y-auto text-xs leading-relaxed pr-1 flex flex-col justify-end">
                                        {industryData[activeIndustry as keyof typeof industryData].initChat.map((msg, index) => (
                                            <div key={index} className={`flex max-w-[85%] ${msg.sender === "client" ? "self-end" : "self-start"}`}>
                                                <div className={`p-2 rounded-xl shadow-xs font-semibold ${msg.sender === "client"
                                                    ? "bg-[#dcf8c6] text-gray-800 rounded-tr-none"
                                                    : "bg-white text-gray-800 rounded-tl-none border"
                                                    }`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-[#f0f0f0] p-1.5 rounded-xl text-[10px] text-gray-500 mt-3 border text-center font-bold">
                                        End of Simulated Dialogue Flow
                                    </div>
                                </div>

                                {/* Sync CRM Fields Display */}
                                <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-5">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-extrabold tracking-wider text-gray-400 uppercase">Captured Lead Fields</span>
                                            <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
                                        </div>

                                        <div className="space-y-2.5">
                                            <div>
                                                <span className="text-[9px] font-bold text-gray-500 uppercase">Lead Source</span>
                                                <p className="text-sm font-extrabold text-slate-900">
                                                    {industryData[activeIndustry as keyof typeof industryData].crmFields.leadSource}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-[9px] font-bold text-gray-500 uppercase">Interest Scope</span>
                                                <p className="text-sm font-extrabold text-slate-900">
                                                    {industryData[activeIndustry as keyof typeof industryData].crmFields.interest}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-[9px] font-bold text-gray-500 uppercase">Extracted Metadata</span>
                                                <p className="text-sm font-extrabold text-[#35877D]">
                                                    {industryData[activeIndustry as keyof typeof industryData].crmFields.capturedData}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[9px] font-bold text-gray-500 uppercase">Status</span>
                                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${industryData[activeIndustry as keyof typeof industryData].crmFields.statusColor
                                                }`}>
                                                {industryData[activeIndustry as keyof typeof industryData].crmFields.status}
                                            </span>
                                        </div>
                                        <Button asChild size="sm" className="h-8.5 text-xs font-bold bg-[#35877D] text-white rounded-lg">
                                            <Link href={isAuthenticated ? "/dashboard" : "/register"}>View in CRM</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Workflow Builder Visual Canvas Section */}
                <section id="workflow" className="py-12 md:py-16 bg-white">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                        <div className="text-center max-w-2xl mx-auto mb-10">
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Visual Workflow Builder</h2>
                            <p className="text-base text-slate-500 font-medium leading-relaxed mt-2.5">
                                Design reply logic paths using intuitive linked nodes. Easily transition chats between AI agents, manual support seats, and API triggers.
                            </p>
                        </div>

                        {/* Interactive flow mockup (horizontal scroll scrollbar for mobile) */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm relative overflow-x-auto scrollbar-thin">
                            {/* Dot grid decoration */}
                            <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

                            <div className="relative flex flex-row justify-between items-center gap-4 z-10 py-3 min-w-[700px] lg:min-w-0">
                                {/* Node 1: Trigger */}
                                <div className="w-full max-w-[300px] bg-white border border-slate-200 hover:border-[#35877D]/50 rounded-xl p-3.5 shadow-xs transition-all shrink-0">
                                    <div className="flex items-center gap-1.5 text-[#35877D] font-bold text-[10.5px] uppercase tracking-wider">
                                        <Zap size={11} className="shrink-0" />
                                        <span>Trigger</span>
                                    </div>
                                    <p className="text-xs font-extrabold text-slate-900 mt-1.5">Incoming WhatsApp Msg</p>
                                    <div className="border border-dashed border-slate-200 rounded-lg p-1.5 bg-slate-50 text-xs font-semibold text-gray-555 mt-1.5 leading-normal">
                                        Checks if msg matches: <span className="font-bold text-slate-900">"price", "quote"</span>
                                    </div>
                                </div>

                                {/* Flow Connection Line */}
                                <div className="flex items-center justify-center shrink-0 mx-1">
                                    <ArrowRight className="text-[#35877D]" size={22} />
                                </div>

                                {/* Node 2: Logic Splitter */}
                                <div className="w-full max-w-[300px] bg-white border border-slate-200 hover:border-slate-200/50 rounded-xl p-3.5 shadow-xs transition-all shrink-0">
                                    <div className="flex items-center gap-1.5 text-[#35877D] font-bold text-[10.5px] uppercase tracking-wider">
                                        <Layers size={11} className="shrink-0" />
                                        <span>Logic Flow</span>
                                    </div>
                                    <p className="text-xs font-extrabold text-slate-900 mt-1.5">Working Hours Filter</p>
                                    <div className="border border-dashed border-slate-200 rounded-lg p-1.5 bg-slate-50 text-xs font-semibold text-gray-555 mt-1.5 leading-normal">
                                        Branch route based on client time: <span className="font-bold text-slate-900">Mon-Fri (9AM - 6PM)</span>
                                    </div>
                                </div>

                                {/* Flow Connection Line */}
                                <div className="flex items-center justify-center shrink-0 mx-1">
                                    <ArrowRight className="text-[#35877D]" size={22} />
                                </div>

                                {/* Node 3: AI Qualification Action */}
                                <div className="w-full max-w-[300px] bg-[#0d3530] text-white border border-[#0B2E1E] rounded-xl p-3.5 shadow-xs hover:shadow-sm transition-all shrink-0">
                                    <div className="flex items-center gap-1.5 text-[#35877D] font-bold text-[10.5px] uppercase tracking-wider">
                                        <Bot size={11} className="shrink-0" />
                                        <span>AI Action</span>
                                    </div>
                                    <p className="text-xs font-extrabold text-white mt-1.5">Qualify Lead & Email</p>
                                    <div className="border border-dashed border-emerald-800 rounded-lg p-1.5 bg-[#0d3530] text-xs font-semibold text-emerald-100 mt-1.5 leading-normal">
                                        AI auto-replies, requests email, and syncs to CRM pipeline tag.
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between items-center z-10 relative">
                                <span className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1">
                                    <Code size={11} /> Drag & Drop builder canvas mockup
                                </span>
                                <Button asChild size="sm" className="bg-[#35877D] hover:bg-[#2c6f66] text-white text-xs font-bold rounded-xl h-8 px-3">
                                    <Link href={isAuthenticated ? "/dashboard" : "/register"}>Open Workflow Builder</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sliding ROI Calculator Section */}
                <section id="roi" className="py-16 md:py-24 bg-slate-50">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Support ROI Calculator</h2>
                            <p className="text-base text-slate-500 font-medium leading-relaxed mt-2.5">
                                See how much time and money Connectly360 saves your business by automating 85% of standard WhatsApp inquiries. Slide the values below to evaluate your monthly ROI.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                            {/* Sliders Container */}
                            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col justify-center space-y-8">
                                {/* Monthly Inquiries Slider */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="chats-range" className="text-sm font-extrabold text-slate-900">
                                            Monthly Incoming Chats
                                        </Label>
                                        <span className="text-sm font-extrabold text-[#35877D] bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl shadow-xs">
                                            {monthlyChats.toLocaleString()} chats
                                        </span>
                                    </div>
                                    <input
                                        id="chats-range"
                                        type="range"
                                        min="200"
                                        max="30000"
                                        step="100"
                                        value={monthlyChats}
                                        onChange={(e) => setMonthlyChats(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#35877D]"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 font-bold">
                                        <span>200</span>
                                        <span>15,000</span>
                                        <span>30,000</span>
                                    </div>
                                </div>

                                {/* Hourly Cost Slider */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="wage-range" className="text-sm font-extrabold text-slate-900">
                                            Support Agent Wage (per Hour)
                                        </Label>
                                        <span className="text-sm font-extrabold text-[#35877D] bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl shadow-xs">
                                            ₹{hourlyWage} / hr
                                        </span>
                                    </div>
                                    <input
                                        id="wage-range"
                                        type="range"
                                        min="100"
                                        max="1000"
                                        step="20"
                                        value={hourlyWage}
                                        onChange={(e) => setHourlyWage(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#35877D]"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 font-bold">
                                        <span>₹100/hr</span>
                                        <span>₹500/hr</span>
                                        <span>₹1,000/hr</span>
                                    </div>
                                </div>
                            </div>

                            {/* ROI Outputs Card */}
                            <div className="lg:col-span-5 bg-[#0d3530] text-white rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
                                <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-emerald-800/10 rounded-full blur-xl pointer-events-none"></div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-[#60B187] font-bold text-xs uppercase tracking-wide">
                                        <Coins size={14} />
                                        <span>Estimated Savings</span>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-xs text-gray-400 font-extrabold uppercase block leading-none">Hours Saved per Month</span>
                                            <p className="text-4xl font-extrabold text-white tracking-tight mt-1">{hoursSaved} <span className="text-sm text-gray-400 font-bold">hrs</span></p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-400 font-extrabold uppercase block leading-none">Monthly Money Saved</span>
                                            <p className="text-4xl font-extrabold text-[#60B187] tracking-tight mt-1">₹{moneySaved.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-[#0d3530]/80 pt-5 mt-6 space-y-4">
                                    <div className="flex justify-between text-sm font-semibold text-gray-300">
                                        <span>Connectly360 Cost:</span>
                                        <span>₹{growthPlanPrice}/mo</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-[#0a2723] border border-[#35877D]/30 px-3.5 py-2.5 rounded-xl">
                                        <span className="text-xs font-bold text-[#60B187] uppercase">Monthly ROI Yield</span>
                                        <span className="text-sm font-extrabold text-white">{roiMultiplier}x return</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-16 md:py-24 bg-white">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                        {/* Section Header */}
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-4">
                                Simple, Transparent Pricing
                            </h2>
                            <p className="text-base text-gray-500 font-medium leading-relaxed mt-3">
                                Choose the plan that fits your growth. Save 20% by paying annually.
                            </p>

                            {/* Annual / Monthly Toggle */}
                            <div className="flex items-center justify-center gap-3 mt-6">
                                <Label htmlFor="home-billing-toggle" className="text-sm font-bold text-gray-600">Monthly</Label>
                                <Switch
                                    id="home-billing-toggle"
                                    checked={isAnnual}
                                    onCheckedChange={setIsAnnual}
                                />
                                <Label htmlFor="home-billing-toggle" className="text-sm font-bold text-gray-600">
                                    Annual <span className="ml-1.5 text-[10px] font-extrabold text-white bg-[#35877D] px-2 py-0.5 rounded-full">Save 20%</span>
                                </Label>
                            </div>
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">

                            {/* Starter */}
                            <Card className="p-8 flex flex-col border border-slate-200 bg-white rounded-3xl shadow-sm relative">
                                <div className="mb-5">
                                    <span className="text-[10px] font-bold text-[#35877D] bg-[#35877D]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">For Small Businesses</span>
                                    <h3 className="text-xl font-extrabold text-slate-900 mt-2 mb-1">Starter</h3>
                                    <p className="text-sm text-gray-500 font-bold">Essential WhatsApp automation</p>
                                </div>
                                <div className="mb-6 flex items-baseline">
                                    <span className="text-4xl font-extrabold text-slate-900">₹{isAnnual ? 399 : 499}</span>
                                    <span className="text-gray-600 text-sm ml-1 font-semibold">/month</span>
                                </div>
                                <ul className="text-sm text-gray-600 font-semibold space-y-2 mb-8 flex-1">
                                    {[
                                        "1,000 Monthly Credits",
                                        "1 WhatsApp Number",
                                        "Basic Automation Flows",
                                        "Shared Team Inbox",
                                        "Contact & Lead Management",
                                        "Welcome & Away Messages",
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
                            <Card className="p-8 flex flex-col border border-[#35877D]/20 bg-[#35877D]/5 rounded-3xl shadow-sm relative transform xl:-translate-y-1">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#35877D] text-white px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                                    Most Popular
                                </div>
                                <div className="mb-5 mt-2">
                                    <span className="text-[10px] font-bold text-[#35877D] bg-white px-2 py-0.5 rounded-full uppercase tracking-wider">Most Popular</span>
                                    <h3 className="text-xl font-extrabold text-slate-900 mt-2 mb-1">Growth</h3>
                                    <p className="text-sm text-gray-500 font-bold">AI Bot & CRM workflows</p>
                                </div>
                                <div className="mb-6 flex items-baseline">
                                    <span className="text-4xl font-extrabold text-[#35877D]">₹{isAnnual ? 799 : 999}</span>
                                    <span className="text-gray-600 text-sm ml-1 font-semibold">/month</span>
                                </div>
                                <ul className="text-sm text-gray-600 font-semibold space-y-2 mb-8 flex-1">
                                    {[
                                        "3,000 Monthly Credits",
                                        "1 WhatsApp Number",
                                        "GPT AI Assistant",
                                        "Knowledge Base Training",
                                        "Workflow Automation Builder",
                                        "Advanced Lead Pipelines",
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
                                    <span className="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">For Teams</span>
                                    <h3 className="text-xl font-extrabold text-slate-900 mt-2 mb-1">Business</h3>
                                    <p className="text-sm text-gray-500 font-bold">Campaigns & advanced analytics</p>
                                </div>
                                <div className="mb-6 flex items-baseline">
                                    <span className="text-4xl font-extrabold text-slate-900">₹{isAnnual ? 1999 : 2499}</span>
                                    <span className="text-gray-600 text-sm ml-1 font-semibold">/month</span>
                                </div>
                                <ul className="text-sm text-gray-600 font-semibold space-y-2 mb-8 flex-1">
                                    {[
                                        "10,000 Monthly Credits",
                                        "3 WhatsApp Numbers",
                                        "WhatsApp Broadcast Campaigns",
                                        "10 Team Inbox Seats",
                                        "Analytics & Performance Reports",
                                        "API Access & Webhooks",
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
                                    <p className="text-sm text-gray-500 font-bold">White-label & custom scales</p>
                                </div>
                                <div className="mb-6 flex items-baseline">
                                    <span className="text-3xl font-extrabold text-slate-900">Contact Sales</span>
                                </div>
                                <ul className="text-sm text-gray-600 font-semibold space-y-2 mb-8 flex-1">
                                    {[
                                        "Unlimited WhatsApp Numbers",
                                        "White-Label Reseller Solution",
                                        "Dedicated Server Hosting",
                                        "Custom Credit Packages",
                                        "SLA & Dedicated Account Manager",
                                        "Custom Integrations",
                                    ].map((f) => (
                                        <li key={f} className="flex items-start gap-2">
                                            <CheckCircle2 size={14} className="text-[#35877D] shrink-0 mt-0.5" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button asChild variant="outline" className="w-full h-12 border-slate-200 rounded-xl text-sm font-bold hover:bg-gray-50">
                                    <Link href="/contact?plan=enterprise">Contact Us</Link>
                                </Button>
                            </Card>

                        </div>

                        {/* Link to full pricing page */}
                        <div className="text-center mt-10">
                            <Link href="/pricing" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#35877D] hover:underline">
                                View full feature comparison <ArrowRight size={14} />
                            </Link>
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

                {/* CTA Section */}
                <section className="py-24 bg-[#0d3530] text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-radial-gradient from-[#D99B26] via-transparent to-transparent"></div>
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 relative z-10 text-center max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Supercharge your customer conversations today</h2>
                        <p className="text-base sm:text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Join hundreds of businesses automating replies, capturing leads, and scaling support with Connectly360.
                        </p>

                        {isAuthenticated ? (
                            <Button asChild size="lg" className="h-13 px-10 text-sm font-semibold rounded-xl bg-[#35877D] hover:bg-[#2c6f66] text-white shadow-lg">
                                <Link href="/dashboard">Go to Dashboard</Link>
                            </Button>
                        ) : (
                            <Button asChild size="lg" className="h-13 px-10 text-sm font-semibold rounded-xl bg-[#35877D] hover:bg-[#2c6f66] text-white shadow-lg font-bold">
                                <Link href="/register">Start Your Free Trial</Link>
                            </Button>
                        )}

                        <p className="mt-5 text-xs text-gray-400 font-semibold">No credit card required. 7-day free trial after registration on the Growth plan.</p>
                    </div>
                </section>
            </main>

            {/* Detailed SaaS Footer */}
            <LandingFooter />
        </div>
    );
}