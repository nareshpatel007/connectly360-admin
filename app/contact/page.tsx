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
    MessageSquare,
    MessageCircle,
    Building2,
    Globe,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
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
        <Card className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm relative overflow-hidden">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-radial-gradient from-[#35877D]/5 to-transparent -z-10 rounded-full blur-xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-radial-gradient from-[#60B187]/5 to-transparent -z-10 rounded-full blur-xl pointer-events-none"></div>

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
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Send an Inquiry</h3>
                            <p className="text-sm text-gray-500 font-semibold mt-1">Submit your details below and our solution architects will draft a customized plan.</p>
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

                        <div className="space-y-1.5">
                            <Label htmlFor="plan" className="text-xs font-bold text-slate-900">Target Plan Interest</Label>
                            <select
                                id="plan"
                                value={form.plan}
                                onChange={(e) => setForm({ ...form, plan: e.target.value })}
                                className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold shadow-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#35877D]/20 focus:border-[#35877D]"
                            >
                                <option value="starter">Starter Plan (Sandbox Play)</option>
                                <option value="growth">Growth Plan (CRM & AI Bots)</option>
                                <option value="enterprise">Custom Enterprise Plan (SLA & Custom AI)</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="message" className="text-xs font-bold text-slate-900">Tell us about your requirements</Label>
                            <Textarea
                                id="message"
                                required
                                rows={4}
                                placeholder="E.g., We send 50k messages monthly and need a custom AI chatbot integration..."
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
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
                        <div className="h-16 w-16 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-[#35877D] shadow-sm animate-bounce">
                            <CheckCircle2 size={36} className="stroke-[2.5]" />
                        </div>
                        <div className="space-y-2 max-w-md">
                            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Proposal Request Logged!</h3>
                            <p className="text-sm sm:text-base text-gray-650 font-semibold leading-relaxed">
                                Thank you, <span className="text-[#35877D] font-bold">{form.name}</span>. We've captured your specs for <span className="text-[#60B187] font-bold">{form.company}</span>.
                            </p>
                            <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-2">
                                A dedicated account manager has been assigned and will reach out to you on WhatsApp at <span className="font-bold text-slate-900">{form.phone}</span> or email to discuss implementation.
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

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden selection:bg-[#35877D] selection:text-white">
            <LandingHeader />

            <main className="pt-40">
                {/* Page Hero Title */}
                <section className="relative pb-16 overflow-hidden">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto text-center space-y-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35877D]/10 text-[#35877D] text-xs font-bold border border-[#35877D]/20 mb-1">
                            <Sparkles size={12} className="animate-pulse" />
                            Enterprise Configuration Desk
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                            Build Your Custom <span className="text-[#35877D]">Workflow Solution</span>
                        </h1>
                        <p className="text-base text-gray-550 font-semibold max-w-2xl mx-auto leading-relaxed">
                            Need custom database integrations, priority SLA support, or trained LLM agents? Share your specifications and we'll draft the optimal layout.
                        </p>
                    </div>
                </section>

                {/* Form & Trust Markers Column Section */}
                <section className="pb-16">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                            {/* Left Column: Why Connectly360 */}
                            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Why Partner with Us?</h3>
                                    <p className="text-sm text-gray-500 font-semibold leading-relaxed">
                                        We construct compliant conversation funnels and custom database webhooks tailored strictly to your commercial business workflows.
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    {[
                                        {
                                            icon: <Clock className="text-[#35877D]" size={16} />,
                                            title: "Guaranteed 1-Hour SLA response",
                                            desc: "Direct support channels on WhatsApp and secure developer boards with priority response schedules."
                                        },
                                        {
                                            icon: <ShieldCheck className="text-[#35877D]" size={16} />,
                                            title: "Meta official compliance",
                                            desc: "Connect your official Cloud API registers directly inside our console with meta safety standards."
                                        },
                                        {
                                            icon: <MessageSquare className="text-[#35877D]" size={16} />,
                                            title: "Trained Knowledge Base agents",
                                            desc: "Upload shipping sheets or catalog files to deploy auto-reply agents answering repetitive questions 24/7."
                                        }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                                                <p className="text-xs text-gray-550 font-semibold leading-relaxed mt-0.5">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Instant Contact Details */}
                                <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
                                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Connect Direct</h4>
                                    <div className="space-y-3.5 text-sm font-semibold text-gray-650">
                                        <div className="flex items-center gap-3">
                                            <Mail size={15} className="text-[#35877D]" />
                                            <span>support@connectly360.com</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone size={15} className="text-[#35877D]" />
                                            <span>+91 9586557162</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin size={15} className="text-[#35877D]" />
                                            <span>Ahmedabad, Gujarat</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Form wrapper */}
                            <div className="lg:col-span-7">
                                <Suspense fallback={
                                    <Card className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm min-h-[400px] flex items-center justify-center">
                                        <span className="h-8 w-8 border-4 border-[#35877D] border-t-transparent rounded-full animate-spin"></span>
                                    </Card>
                                }>
                                    <ContactFormContent />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What Happens Next Timeline Flowchart */}
                <section className="py-16 bg-slate-50 border-t border-slate-200">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">What Happens Next?</h2>
                            <p className="text-sm text-gray-550 font-semibold mt-1.5">Your implementation timeline from request submission to deployment kickoff.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative mt-8">
                            <div className="absolute top-1/2 left-[10%] right-[10%] h-0.5 border-t border-dashed border-slate-200 hidden md:block -z-10 -translate-y-6"></div>

                            {[
                                {
                                    step: "1",
                                    title: "Automatic CRM Log",
                                    desc: "Our systems log your contact profile and requirements instantly into our active dashboard pipelines."
                                },
                                {
                                    step: "2",
                                    title: "Architect Proposal",
                                    desc: "A dedicated solutions manager reviews your use case and drafts a custom system flow proposal in under 60 minutes."
                                },
                                {
                                    step: "3",
                                    title: "Sandbox Kickoff",
                                    desc: "We coordinate a fast screenshare session to verify your official WhatsApp WABA credentials and launch templates."
                                }
                            ].map((item, idx) => (
                                <Card key={idx} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between group hover:border-[#35877D]/35 transition-all">
                                    <div className="space-y-4">
                                        <span className="inline-flex h-10 w-10 bg-[#EAF7F2] text-[#35877D] border border-[#35877D]/20 rounded-xl items-center justify-center font-bold text-sm shrink-0">
                                            {item.step}
                                        </span>
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

                {/* Instant Support / Chat CTA widgets */}
                <section className="py-16 bg-white border-t border-slate-200">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#EAF7F2] border border-[#35877D]/20 p-8 sm:p-12 rounded-3xl relative overflow-hidden">
                            <div className="space-y-4 z-10">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35877D]/10 text-[#35877D] text-xs font-bold border border-[#35877D]/20">
                                    <Zap size={12} className="text-[#35877D]" />
                                    Instant Live Chat Support
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Need immediate response?</h3>
                                <p className="text-sm text-gray-600 font-semibold leading-relaxed max-w-md">
                                    Connect directly with our tech team on WhatsApp. Skip forms entirely to ask setup questions, resolve credits top-ups, or discuss pricing structures.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-4 z-10 justify-end">
                                <Button asChild className="w-full sm:w-auto h-12 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer border-0">
                                    <a href="https://wa.me/919586557162" target="_blank" rel="noopener noreferrer">
                                        <MessageCircle size={16} />
                                        <span>Chat on WhatsApp</span>
                                    </a>
                                </Button>
                                <Button asChild variant="outline" className="w-full sm:w-auto h-12 border-slate-300 rounded-xl text-sm font-bold hover:bg-slate-50 cursor-pointer">
                                    <Link href="/faq">Visit Help Desk FAQs</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Office locations Grid Coordinate Section */}
                <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-extrabold text-slate-900">Our Office Coordinates</h2>
                            <p className="text-sm text-gray-550 font-semibold mt-1.5">Where we architect Platform Systems and run lead scaling pipelines.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    location: "Ahmedabad, India",
                                    type: "Platform Engineering HQ",
                                    desc: "Development center managing workflow orchestrators, lead logger queues, and cloud backend configurations.",
                                    address: "Sarkhej - Gandhinagar Hwy, Ahmedabad, Gujarat 380054"
                                },
                                {
                                    location: "Bangalore, India",
                                    type: "Sales & Integrations Desk",
                                    desc: "Solutions architect office supporting customer onboarding flows and system integrations walkthroughs.",
                                    address: "Outer Ring Rd, Marathahalli, Bengaluru, Karnataka 560103"
                                },
                                {
                                    location: "Singapore",
                                    type: "Regional Server Desk",
                                    desc: "APAC server monitoring desk coordinating localization compliance, latency checks, and database hosts.",
                                    address: "Marina Boulevard, Singapore 018981"
                                }
                            ].map((office, idx) => (
                                <Card key={idx} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between group hover:border-[#35877D]/35 transition-all">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Globe size={18} className="text-[#35877D]" />
                                            <h4 className="text-base font-extrabold text-slate-900">{office.location}</h4>
                                        </div>
                                        <span className="inline-block text-[9px] font-bold text-[#35877D] bg-[#EAF7F2] border border-[#35877D]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            {office.type}
                                        </span>
                                        <p className="text-xs text-gray-500 font-semibold leading-relaxed">{office.desc}</p>
                                    </div>
                                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-start gap-1.5 text-[10px] font-semibold text-slate-400">
                                        <MapPin size={11} className="shrink-0 mt-0.5" />
                                        <span>{office.address}</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
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
