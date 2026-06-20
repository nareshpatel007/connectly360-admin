"use client";

import React from "react";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden selection:bg-[#35877D] selection:text-white">
            <LandingHeader />

            <main className="pt-40">
                {/* Hero Title Section */}
                <section className="relative pb-16 overflow-hidden">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto text-center space-y-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35877D]/10 text-[#35877D] text-xs font-bold border border-[#35877D]/20 mb-1">
                            <HelpCircle size={12} className="animate-pulse" />
                            Knowledge Base & FAQ
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-base text-gray-550 font-semibold max-w-2xl mx-auto leading-relaxed">
                            Have questions about our CRM, WhatsApp official integrations, or AI chatbot capabilities? Find the answers below.
                        </p>
                    </div>
                </section>

                {/* FAQ Content Section */}
                <section className="pb-24">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-5xl mx-auto">
                        <Accordion type="single" collapsible className="w-full bg-white rounded-2xl border border-slate-200 px-6 py-2 shadow-sm">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                    Do my customers need to download any new app?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-650 text-sm sm:text-base leading-relaxed font-semibold text-slate-600">
                                    No. Your customers chat directly inside their native WhatsApp application. They receive instant, accurate replies from our AI system without having to install any extra portals or sign up for account services.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                    What is Meta Embedded Signup?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-650 text-sm sm:text-base leading-relaxed font-semibold text-slate-600">
                                    Embedded Signup is a one-click onboarding flow that allows you to connect your WhatsApp Business account directly to Connectly360 in seconds without manually creating developer accounts, copy-pasting API tokens, or sharing credentials.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                    Is this using the official Meta WhatsApp API?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-650 text-sm sm:text-base leading-relaxed font-semibold text-slate-600">
                                    Yes. Connectly360 utilizes the official Meta Cloud API. This guarantees stable message delivery, prevents phone number ban issues, and provides you with the capability to verify your business and get the official WhatsApp green badge.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-4">
                                <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                    How does the AI Assistant use my business files?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-650 text-sm sm:text-base leading-relaxed font-semibold text-slate-600">
                                    You can upload reference documents (such as catalog PDFs, DOCX guides, or TXT FAQs) in the Knowledge Base module. The OpenAI integration allows the AI chatbot to read and analyze these files to auto-reply to customer questions accurately.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-5">
                                <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                    Can we transition from AI bot to a human agent?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-650 text-sm sm:text-base leading-relaxed font-semibold text-slate-600">
                                    Absolutely. If the AI agent encounters a complex query or if the user requests human assistance, the chat transitions seamlessly to your central inbox, and a notification is instantly triggered for your team on the dashboard.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-6">
                                <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                    What payment gateways are supported for subscriptions?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-650 text-sm sm:text-base leading-relaxed font-semibold text-slate-600">
                                    Connectly360 integrates with Razorpay and Stripe to securely handle subscription billing, invoices, and usage tracking, making it easy to manage your payment workflows.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-7">
                                <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                    Is my conversational data secure?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-650 text-sm sm:text-base leading-relaxed font-semibold text-slate-600">
                                    Yes. We encrypt all messages in transit and at rest. Your customer data, contact logs, and business workflows are stored securely in compliant enterprise hosting systems and are never shared or sold.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-8" className="border-none">
                                <AccordionTrigger className="text-left text-base font-bold text-slate-900 hover:text-[#35877D]">
                                    Can I transition between plans at any time?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-650 text-sm sm:text-base leading-relaxed font-semibold text-slate-600">
                                    Yes. You can upgrade, downgrade, or cancel your billing subscription directly inside your Connectly360 dashboard workspace settings. Plan adjustments are instantly prorated.
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
