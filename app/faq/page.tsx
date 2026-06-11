"use client";

import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Sparkles } from "lucide-react";

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#143d27] font-sans overflow-x-hidden selection:bg-[#1B633E] selection:text-white">
            <LandingHeader />

            <main className="pt-32 pb-24">
                <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-5xl mx-auto">
                    
                    {/* Header Banner */}
                    <div className="text-center space-y-4 mb-12">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCF8EC] text-[#1D4ED8] text-xs font-bold border border-[#EAD098] shadow-sm">
                            <HelpCircle size={13} className="text-[#D99B26]" />
                            Knowledge Base & FAQ
                        </span>
                        <h1 className="text-4xl font-extrabold text-[#0B2E1E] leading-tight">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-base text-gray-550 font-medium max-w-xl mx-auto leading-relaxed">
                            Have questions about our CRM, WhatsApp official integrations, or AI chatbot capabilities? Find the answers below.
                        </p>
                    </div>

                    {/* Accordion Component */}
                    <Accordion type="single" collapsible className="w-full bg-white rounded-3xl border border-[#D99B26] px-6 py-4 shadow-xl">
                        <AccordionItem value="item-1" className="border-b border-[#FAF8F5]">
                            <AccordionTrigger className="text-left text-base font-bold text-[#0B2E1E] hover:text-[#1B633E] py-4">
                                Do my customers need to download any new app?
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-550 text-sm sm:text-base leading-relaxed font-medium pb-4">
                                No. Your customers chat directly inside their native WhatsApp application. They receive instant, accurate replies from our AI system without having to install any extra portals or sign up for account services.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2" className="border-b border-[#FAF8F5]">
                            <AccordionTrigger className="text-left text-base font-bold text-[#0B2E1E] hover:text-[#1B633E] py-4">
                                What is Meta Embedded Signup?
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-550 text-sm sm:text-base leading-relaxed font-medium pb-4">
                                Embedded Signup is a one-click onboarding flow that allows you to connect your WhatsApp Business account directly to Connectly360 in seconds without manually creating developer accounts, copy-pasting API tokens, or sharing credentials.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3" className="border-b border-[#FAF8F5]">
                            <AccordionTrigger className="text-left text-base font-bold text-[#0B2E1E] hover:text-[#1B633E] py-4">
                                Is this using the official Meta WhatsApp API?
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-550 text-sm sm:text-base leading-relaxed font-medium pb-4">
                                Yes. Connectly360 utilizes the official Meta Cloud API. This guarantees stable message delivery, prevents phone number ban issues, and provides you with the capability to verify your business and get the official WhatsApp green badge.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-4" className="border-b border-[#FAF8F5]">
                            <AccordionTrigger className="text-left text-base font-bold text-[#0B2E1E] hover:text-[#1B633E] py-4">
                                How does the AI Assistant use my business files?
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-550 text-sm sm:text-base leading-relaxed font-medium pb-4">
                                You can upload reference documents (such as catalog PDFs, DOCX guides, or TXT FAQs) in the Knowledge Base module. The OpenAI integration allows the AI chatbot to read and analyze these files to auto-reply to customer questions accurately.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-5" className="border-b border-[#FAF8F5]">
                            <AccordionTrigger className="text-left text-base font-bold text-[#0B2E1E] hover:text-[#1B633E] py-4">
                                Can we transition from AI bot to a human agent?
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-550 text-sm sm:text-base leading-relaxed font-medium pb-4">
                                Absolutely. If the AI agent encounters a complex query or if the user requests human assistance, the chat transitions seamlessly to your central inbox, and a notification is instantly triggered for your team on the dashboard.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-6" className="border-b border-[#FAF8F5]">
                            <AccordionTrigger className="text-left text-base font-bold text-[#0B2E1E] hover:text-[#1B633E] py-4">
                                What payment gateways are supported for subscriptions?
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-550 text-sm sm:text-base leading-relaxed font-medium pb-4">
                                Connectly360 integrates with Razorpay and Stripe to securely handle subscription billing, invoices, and usage tracking, making it easy to manage your payment workflows.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-7" className="border-b border-[#FAF8F5]">
                            <AccordionTrigger className="text-left text-base font-bold text-[#0B2E1E] hover:text-[#1B633E] py-4">
                                Is my conversational data secure?
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-550 text-sm sm:text-base leading-relaxed font-medium pb-4">
                                Yes. We encrypt all messages in transit and at rest. Your customer data, contact logs, and business workflows are stored securely in compliant enterprise hosting systems and are never shared or sold.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-8" className="border-none">
                            <AccordionTrigger className="text-left text-base font-bold text-[#0B2E1E] hover:text-[#1B633E] py-4">
                                Can I transition between plans at any time?
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-550 text-sm sm:text-base leading-relaxed font-medium pb-4">
                                Yes. You can upgrade, downgrade, or cancel your billing subscription directly inside your Connectly360 dashboard workspace settings. Plan adjustments are instantly prorated.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
