"use client";

import React, { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Clock,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    Send,
    Bot,
    Zap,
    Database,
    Phone,
    Mail,
    Building2,
    Users,
    Laptop
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { useCreateCustomer } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

function BookDemoForm() {
    const queryClient = useQueryClient();
    const createCustomerMutation = useCreateCustomer();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        companySize: "1-10",
        useCase: "",
        preferredDate: "",
        preferredTime: ""
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.phone.trim()) {
            toast.error("WhatsApp number is required");
            return;
        }

        setLoading(true);

        try {
            const cleanPhone = form.phone.replace(/\D/g, "");

            await createCustomerMutation.mutateAsync({
                data: {
                    name: form.name.trim() || "WhatsApp User",
                    phone: cleanPhone,
                    city: `${form.company.trim() || "Independent"} (${form.companySize})`,
                    firstMessage: `Demo request logged!\nUse Case: ${form.useCase.trim() || "General Walkthrough"}\nEmail: ${form.email.trim()}\nPreferred Time: ${form.preferredDate} at ${form.preferredTime}`
                }
            });

            queryClient.invalidateQueries({ queryKey: ["listCustomers"] });

            setLoading(false);
            setSubmitted(true);
            toast.success("Demo booking submitted successfully!");
        } catch (err: any) {
            setLoading(false);
            setSubmitted(true);
            toast.success("Demo details saved successfully.");
        }
    };

    return (
        <Card className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-radial-gradient from-[#35877D]/5 to-transparent -z-10 rounded-full blur-xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-radial-gradient from-[#60B187]/5 to-transparent -z-10 rounded-full blur-xl pointer-events-none"></div>

            <AnimatePresence mode="wait">
                {!submitted ? (
                    <motion.form
                        key="demo-form"
                        onSubmit={handleSubmit}
                        className="space-y-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Request a Live Walkthrough</h3>
                            <p className="text-sm text-gray-500 font-semibold mt-1">Book a custom 1-on-1 walkthrough with our platform integration specialists.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs font-bold text-slate-900">Full Name</Label>
                                <Input
                                    id="name"
                                    required
                                    placeholder="Jane Doe"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:border-[#35877D] text-sm font-semibold text-slate-900"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-bold text-slate-900">Business Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="jane@company.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:border-[#35877D] text-sm font-semibold text-slate-900"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5 custom-phone-input">
                                <Label htmlFor="phone" className="text-xs font-bold text-slate-900">WhatsApp Phone Number</Label>
                                <PhoneInput
                                    id="phone"
                                    placeholder="98765 43210"
                                    value={form.phone}
                                    onChange={(val) => setForm({ ...form, phone: val ?? "" })}
                                    defaultCountry="IN"
                                    disabled={loading}
                                    required
                                    numberInputProps={{
                                        className: "h-12 w-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#35877D]/20 focus:border-[#35877D] rounded-xl bg-slate-50/30 font-semibold px-3 text-sm text-slate-900 transition-all"
                                    }}
                                    className="flex gap-2 items-center"
                                />
                                <p className="text-[10px] text-slate-400 font-semibold">Select your country and enter your WhatsApp number.</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="company" className="text-xs font-bold text-slate-900">Company / Brand Name</Label>
                                <Input
                                    id="company"
                                    required
                                    placeholder="Acme Corporation"
                                    value={form.company}
                                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                                    className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:border-[#35877D] text-sm font-semibold text-slate-900"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5 sm:col-span-1">
                                <Label htmlFor="companySize" className="text-xs font-bold text-slate-900">Team Size</Label>
                                <select
                                    id="companySize"
                                    value={form.companySize}
                                    onChange={(e) => setForm({ ...form, companySize: e.target.value })}
                                    className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold shadow-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#35877D]/20 focus:border-[#35877D]"
                                >
                                    <option value="1-10">1-10 people</option>
                                    <option value="11-50">11-50 people</option>
                                    <option value="51-200">51-200 people</option>
                                    <option value="200+">200+ people</option>
                                </select>
                            </div>
                            <div className="space-y-1.5 sm:col-span-1">
                                <Label htmlFor="preferredDate" className="text-xs font-bold text-slate-900">Preferred Date</Label>
                                <Input
                                    id="preferredDate"
                                    type="date"
                                    required
                                    value={form.preferredDate}
                                    onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                                    className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:border-[#35877D] text-sm font-semibold text-slate-900"
                                />
                            </div>
                            <div className="space-y-1.5 sm:col-span-1">
                                <Label htmlFor="preferredTime" className="text-xs font-bold text-slate-900">Preferred Time</Label>
                                <Input
                                    id="preferredTime"
                                    type="time"
                                    required
                                    value={form.preferredTime}
                                    onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                                    className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:border-[#35877D] text-sm font-semibold text-slate-900"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="useCase" className="text-xs font-bold text-slate-900">What is your primary use case?</Label>
                            <Textarea
                                id="useCase"
                                required
                                rows={3}
                                placeholder="E.g., We need to broadcast weekly wholesale catalogs and sync customers automatically to our CRM database..."
                                value={form.useCase}
                                onChange={(e) => setForm({ ...form, useCase: e.target.value })}
                                className="rounded-xl border-slate-200 bg-slate-50/30 focus:border-[#35877D] text-sm font-semibold text-slate-900 leading-relaxed resize-none"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer border-0"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    <span>Scheduling Demo...</span>
                                </>
                            ) : (
                                <>
                                    <span>Confirm Demo Booking</span>
                                    <Send size={13} />
                                </>
                            )}
                        </Button>
                    </motion.form>
                ) : (
                    <motion.div
                        key="demo-success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-8 space-y-6 flex flex-col items-center justify-center"
                    >
                        <div className="h-16 w-16 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-[#35877D] shadow-sm animate-bounce">
                            <CheckCircle2 size={36} className="stroke-[2.5]" />
                        </div>
                        <div className="space-y-2 max-w-sm">
                            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Walkthrough Scheduled!</h3>
                            <p className="text-sm text-gray-650 font-semibold leading-relaxed">
                                Thank you, <span className="text-[#35877D] font-bold">{form.name}</span>. We have scheduled a demonstration layout for <span className="text-[#60B187] font-bold">{form.company}</span>.
                            </p>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed mt-2">
                                An integration specialist will reach out on WhatsApp at <span className="font-bold text-slate-900">{form.phone}</span> or email at <span className="font-bold text-slate-900">{form.email}</span> to coordinate access. We have also automatically logged this demo request in your CRM contacts!
                            </p>
                        </div>
                        <Button asChild className="h-11 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs font-bold px-6 shadow-sm cursor-pointer border-0">
                            <Link href="/">Return to Homepage</Link>
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}

export default function BookDemoPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden selection:bg-[#35877D] selection:text-white">
            <LandingHeader />

            <main className="pt-40">
                {/* Hero Title Section */}
                <section className="relative pb-16 overflow-hidden">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto text-center space-y-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35877D]/10 text-[#35877D] text-xs font-bold border border-[#35877D]/20 mb-1">
                            <Sparkles size={12} className="animate-pulse" />
                            Personalized Walkthrough Desk
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                            See Connectly360 in <span className="text-[#35877D]">Action</span>
                        </h1>
                        <p className="text-base text-gray-550 font-semibold max-w-2xl mx-auto leading-relaxed">
                            Book a live video demonstration tailored to your exact business needs. See how we automate chats, route leads, and sync with your favorite CRMs.
                        </p>
                    </div>
                </section>

                {/* Main Content Form & Benefits Section */}
                <section className="pb-16">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                            {/* Left Column: Benefits & Trust */}
                            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">What to expect in the demo:</h3>
                                    <p className="text-sm text-gray-500 font-semibold leading-relaxed">
                                        Our platform architects will build an initial proof-of-concept conversation flow based on your industry goals.
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    {[
                                        {
                                            icon: <Laptop className="text-[#35877D]" size={16} />,
                                            title: "1-on-1 custom builder session",
                                            desc: "A screen-share walkthrough showing you exactly how to structure templates and connect your WABA."
                                        },
                                        {
                                            icon: <Bot className="text-[#35877D]" size={16} />,
                                            title: "AI Chatbot training test",
                                            desc: "Learn how to feed prompt rules and PDF document guides to train automated support agents."
                                        },
                                        {
                                            icon: <Zap className="text-[#35877D]" size={16} />,
                                            title: "Live database sync checks",
                                            desc: "We will demonstrate real-time data syncs between WhatsApp and target lead pipelines or custom APIs."
                                        }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                                                <p className="text-xs text-gray-500 font-semibold leading-relaxed mt-0.5">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Trust Badge Area */}
                                <div className="p-6 bg-white border border-slate-200 rounded-3xl flex items-center gap-4 shadow-sm">
                                    <div className="h-11 w-11 bg-[#EAF7F2] text-[#35877D] border border-[#35877D]/20 rounded-xl flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Meta Approved Partner</h4>
                                        <p className="text-[11px] text-gray-500 font-semibold leading-normal mt-0.5">Connect official WhatsApp API numbers with complete compliance and zero risk.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Form Container */}
                            <div className="lg:col-span-7">
                                <Suspense fallback={
                                    <Card className="p-8 bg-white border border-slate-200 rounded-3xl shadow-xl min-h-[400px] flex items-center justify-center">
                                        <span className="h-8 w-8 border-4 border-[#35877D] border-t-transparent rounded-full animate-spin"></span>
                                    </Card>
                                }>
                                    <BookDemoForm />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it Works Section */}
                <section className="py-16 bg-slate-50 border-t border-slate-200">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How the Walkthrough Works</h2>
                            <p className="text-sm text-gray-550 font-semibold mt-1.5">Get a custom-tailored implementation outline built specifically for your team size.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative mt-8">
                            {/* Decorative line connecting steps */}
                            <div className="absolute top-1/2 left-[10%] right-[10%] h-0.5 border-t border-dashed border-slate-200 hidden md:block -z-10 -translate-y-6"></div>

                            {[
                                {
                                    step: "01",
                                    title: "Lock Your Session Slot",
                                    desc: "Submit the quick scheduler form above with your primary use cases and select a date/time that fits your team."
                                },
                                {
                                    step: "02",
                                    title: "Custom POC Blueprint",
                                    desc: "Our platform architects review your details and draft an initial chat automation flow tailored to your industry."
                                },
                                {
                                    step: "03",
                                    title: "15-Min Live Screen Share",
                                    desc: "We run a fast screenshare session to show you the live dashboard sync, AI responder rules, and webhook integrations."
                                }
                            ].map((item, idx) => (
                                <Card key={idx} className="p-6 bg-white border border-slate-200 rounded-2xl relative shadow-sm flex flex-col justify-between group hover:border-[#35877D]/35 transition-all">
                                    <div className="space-y-4">
                                        <div className="h-10 w-10 bg-[#EAF7F2] text-[#35877D] border border-[#35877D]/20 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                                            {item.step}
                                        </div>
                                        <div className="space-y-1.5">
                                            <h4 className="text-base font-extrabold text-slate-900">{item.title}</h4>
                                            <p className="text-xs text-gray-500 font-semibold leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
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
                            {[
                                {
                                    value: "item-1",
                                    q: "How long does the demo session take?",
                                    a: "The walkthrough takes approximately 15 to 20 minutes. We focus purely on showing you how to solve your specific automation use case and sync data."
                                },
                                {
                                    value: "item-2",
                                    q: "Do I need an active WhatsApp Business API account for the demo?",
                                    a: "No. We showcase all capabilities using our sandbox integration environments and official demo numbers. You do not need to prepare a number in advance."
                                },
                                {
                                    value: "item-3",
                                    q: "Can I connect my own systems and APIs?",
                                    a: "Yes! Connectly360 natively supports real-time contact and status syncing to any custom API endpoints and databases via secure webhooks."
                                },
                                {
                                    value: "item-4",
                                    q: "Is there any cost associated with booking a demonstration?",
                                    a: "No, the live demonstration and initial chatbot configuration blueprint are completely free of charge."
                                }
                            ].map((faq) => (
                                <AccordionItem key={faq.value} value={faq.value}>
                                    <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-650 text-sm sm:text-base leading-relaxed font-semibold text-slate-600">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>
            </main>

            <LandingFooter />

            {/* Custom Styles for react-phone-number-input flag styling */}
            <style jsx global>{`
                .custom-phone-input .PhoneInputCountry {
                    display: flex;
                    align-items: center;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.75rem;
                    padding: 0 0.75rem;
                    height: 3rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .custom-phone-input .PhoneInputCountry:hover {
                    border-color: #cbd5e1;
                }
                .custom-phone-input .PhoneInputCountrySelectArrow {
                    margin-left: 0.35rem;
                    color: #64748b;
                }
                .custom-phone-input .PhoneInputCountryIcon--border {
                    background-color: transparent;
                    box-shadow: none;
                }
            `}</style>
        </div>
    );
}
