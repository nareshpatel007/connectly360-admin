"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    Phone,
    MapPin,
    CheckCircle2,
    ArrowRight,
    Send,
    ShieldCheck,
    Clock,
    Sparkles,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import Link from "next/link";

// Contact form component that reads search params
function ContactFormContent() {
    const searchParams = useSearchParams();
    const initialPlan = searchParams.get("plan") || "enterprise";

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        plan: initialPlan,
        message: ""
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const plan = searchParams.get("plan");
        if (plan) {
            setForm(prev => ({ ...prev, plan }));
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API request
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <Card className="p-6 md:p-8 bg-white border border-[#D99B26] rounded-3xl shadow-xl relative overflow-hidden">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-radial-gradient from-[#1B633E]/5 to-transparent -z-10 rounded-full blur-xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-radial-gradient from-[#D99B26]/5 to-transparent -z-10 rounded-full blur-xl pointer-events-none"></div>

            <AnimatePresence mode="wait">
                {!submitted ? (
                    <motion.form
                        key="contact-form"
                        onSubmit={handleSubmit}
                        className="space-y-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div>
                            <h3 className="text-xl font-extrabold text-[#0B2E1E] tracking-tight">Send an Inquiry</h3>
                            <p className="text-sm text-gray-500 font-medium mt-1">Submit your details below and our solution architects will draft a customized plan.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs font-bold text-[#0B2E1E]">Full Name</Label>
                                <Input
                                    id="name"
                                    required
                                    placeholder="Jane Doe"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="h-12 rounded-xl border-[#D99B26] bg-[#FAF8F5]/30 focus:border-[#1B633E] text-sm font-semibold text-[#0B2E1E]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold text-[#0B2E1E]">Business Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="jane@company.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="h-12 rounded-xl border-[#D99B26] bg-[#FAF8F5]/30 focus:border-[#1B633E] text-sm font-semibold text-[#0B2E1E]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-xs font-bold text-[#0B2E1E]">WhatsApp Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    required
                                    placeholder="+91 9586557162"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="h-12 rounded-xl border-[#D99B26] bg-[#FAF8F5]/30 focus:border-[#1B633E] text-sm font-semibold text-[#0B2E1E]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company" className="text-xs font-bold text-[#0B2E1E]">Company / Brand Name</Label>
                                <Input
                                    id="company"
                                    required
                                    placeholder="Acme Corporation"
                                    value={form.company}
                                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                                    className="h-12 rounded-xl border-[#D99B26] bg-[#FAF8F5]/30 focus:border-[#1B633E] text-sm font-semibold text-[#0B2E1E]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="plan" className="text-xs font-bold text-[#0B2E1E]">Target Plan Interest</Label>
                            <select
                                id="plan"
                                value={form.plan}
                                onChange={(e) => setForm({ ...form, plan: e.target.value })}
                                className="flex h-12 w-full items-center justify-between rounded-xl border border-[#D99B26] bg-white px-4 py-2.5 text-sm font-semibold shadow-xs text-[#0B2E1E] focus:outline-none focus:ring-2 focus:ring-[#1B633E]/20 focus:border-[#1B633E]"
                            >
                                <option value="starter">Starter Plan (Sandbox Play)</option>
                                <option value="growth">Growth Plan (CRM & AI Bots)</option>
                                <option value="enterprise">Custom Enterprise Plan (SLA & Custom AI)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-xs font-bold text-[#0B2E1E]">Tell us about your requirements</Label>
                            <Textarea
                                id="message"
                                required
                                rows={4}
                                placeholder="E.g., We send 50k messages monthly and need a custom AI chatbot integrated with HubSpot..."
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                className="rounded-xl border-[#D99B26] bg-[#FAF8F5]/30 focus:border-[#1B633E] text-sm font-semibold text-[#0B2E1E] leading-relaxed resize-none"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-13 bg-[#1B633E] hover:bg-[#12452A] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    <span>Processing Proposal...</span>
                                </>
                            ) : (
                                <>
                                    <span>Submit Custom Request</span>
                                    <Send size={14} />
                                </>
                            )}
                        </Button>
                    </motion.form>
                ) : (
                    <motion.div
                        key="contact-success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-10 space-y-6 flex flex-col items-center justify-center"
                    >
                        <div className="h-16 w-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-[#1B633E] shadow-sm animate-bounce">
                            <CheckCircle2 size={36} className="stroke-[2.5]" />
                        </div>
                        <div className="space-y-2 max-w-md">
                            <h3 className="text-2xl font-extrabold text-[#0B2E1E] tracking-tight">Proposal Request Logged!</h3>
                            <p className="text-sm sm:text-base text-gray-600 font-semibold leading-relaxed">
                                Thank you, <span className="text-[#1B633E] font-bold">{form.name}</span>. We've captured your specs for <span className="text-[#D99B26] font-bold">{form.company}</span>.
                            </p>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed mt-2">
                                A dedicated account manager has been assigned and will reach out to you on <span className="font-bold text-[#0B2E1E]">{form.phone}</span> (WhatsApp) within 60 minutes with a draft implementation layout.
                            </p>
                        </div>
                        <Button asChild className="h-11 bg-[#1B633E] hover:bg-[#12452A] text-white rounded-xl text-xs font-bold px-6 shadow-sm">
                            <Link href="/">Return to Homepage</Link>
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#143d27] font-sans overflow-x-hidden selection:bg-[#1B633E] selection:text-white">
            <LandingHeader />

            <main className="pt-32 pb-24">
                <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">

                    {/* Page Hero Grid */}
                    <div className="text-center space-y-4 mb-16">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCF8EC] text-[#1D4ED8] text-xs font-bold border border-[#EAD098] shadow-sm">
                            <Sparkles size={13} className="text-[#D99B26] fill-[#D99B26]/15" />
                            Enterprise Configuration Desk
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B2E1E] leading-tight">
                            Build your custom workflow solution
                        </h1>
                        <p className="text-base text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
                            Need custom database syncing, priority SLAs, or trained LLM models? Share your specifications and we'll engineer the optimal workflow.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                        {/* Left Info Column */}
                        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-extrabold text-[#0B2E1E] tracking-tight">Why Choose Connectly360?</h3>
                                <p className="text-sm text-gray-550 font-medium leading-relaxed">
                                    We work directly with distributors, retailers, and SaaS scale-ups to design high-performance communication systems.
                                </p>
                            </div>

                            <div className="space-y-5">
                                {[
                                    {
                                        icon: <Clock className="text-[#1B633E]" size={18} />,
                                        title: "Guaranteed 1-Hour response SLA",
                                        desc: "Direct private support line on WhatsApp and Slack with priority developer access."
                                    },
                                    {
                                        icon: <ShieldCheck className="text-[#1B633E]" size={18} />,
                                        title: "Meta Embedded Signup",
                                        desc: "Connect your WhatsApp Business Account directly in seconds without sharing any credentials manually."
                                    },
                                    {
                                        icon: <MessageSquare className="text-[#D99B26]" size={18} />,
                                        title: "Document-Trained AI Assistants",
                                        desc: "Upload catalog PDFs, DOCXs, or TXTs. We configure OpenAI models to resolve repetitive questions automatically."
                                    }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="h-10 w-10 bg-white border border-[#D99B26] rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-[#0B2E1E]">{item.title}</h4>
                                            <p className="text-xs text-gray-500 font-semibold leading-relaxed mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Contact office details card */}
                            <div className="p-6 bg-[#FAF8F5]/30 border border-[#D99B26] rounded-2xl space-y-4">
                                <span className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">Connect Direct</span>
                                <div className="space-y-3.5 text-sm font-semibold text-gray-650">
                                    <div className="flex items-center gap-3">
                                        <Mail size={15} className="text-[#1B633E]" />
                                        <span>support@connectly360.com</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone size={15} className="text-[#1B633E]" />
                                        <span>+91 9586557162</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin size={15} className="text-[#1B633E]" />
                                        <span>Ahmedabad, Gujarat</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Form Card Column */}
                        <div className="lg:col-span-7">
                            <Suspense fallback={
                                <Card className="p-8 bg-white border border-[#D99B26] rounded-3xl shadow-xl min-h-[400px] flex items-center justify-center">
                                    <span className="h-8 w-8 border-4 border-[#1B633E] border-t-transparent rounded-full animate-spin"></span>
                                </Card>
                            }>
                                <ContactFormContent />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </main>

            {/* Detailed SaaS Footer */}
            <LandingFooter />
        </div>
    );
}
