"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function LandingFooter() {
    return (
        <footer className="bg-white border-t border-slate-200 py-16">
            <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
                    {/* Column 1: Brand details */}
                    <div className="col-span-2 space-y-4">
                        <div className="flex items-center gap-2">
                            <img src="/images/logo.png" alt="Connectly360 Logo" className="h-12 w-auto object-contain" />
                        </div>
                        <p className="text-sm text-gray-455 font-medium leading-relaxed max-w-sm">
                            The ultimate unified platform for Conversational CRM, official Meta WhatsApp API integrations, smart AI chatbots, and visual workflow logic tools. Built to convert and manage leads 24/7.
                        </p>

                        {/* Contact Details */}
                        <div className="space-y-2.5 pt-2 text-sm font-medium text-gray-455">
                            <div className="flex items-center gap-2">
                                <Mail size={13} className="text-[#35877D]/60" />
                                <span>support@connectly360.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={13} className="text-[#35877D]/60" />
                                <span>+91 9586557162</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={13} className="text-[#35877D]/60" />
                                <span>Ahmedabad, Gujarat</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Platform Links */}
                    <div className="space-y-4">
                        <h4 className="font-extrabold text-sm text-[#0B2E1E] uppercase tracking-wider">Platform Suite</h4>
                        <ul className="space-y-3 text-sm font-medium text-gray-455">
                            <li><Link href="/#products" className="hover:text-[#35877D] transition-colors">Conversational CRM</Link></li>
                            <li><Link href="/#products" className="hover:text-[#35877D] transition-colors">WhatsApp API</Link></li>
                            <li><Link href="/#products" className="hover:text-[#35877D] transition-colors">AI Chatbot Agent</Link></li>
                            <li><Link href="/#workflow" className="hover:text-[#35877D] transition-colors">Workflow Builder</Link></li>
                            <li><Link href="/#roi" className="hover:text-[#35877D] transition-colors">ROI Calculator</Link></li>
                            <li><Link href="/pricing" className="hover:text-[#35877D] transition-colors">Pricing Plans</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Solutions */}
                    <div className="space-y-4">
                        <h4 className="font-extrabold text-sm text-[#0B2E1E] uppercase tracking-wider">Solutions</h4>
                        <ul className="space-y-3 text-sm font-medium text-gray-455">
                            <li><Link href="/#playground" className="hover:text-[#35877D] transition-colors">E-Commerce Orders</Link></li>
                            <li><Link href="/#playground" className="hover:text-[#35877D] transition-colors">Real Estate Leads</Link></li>
                            <li><Link href="/#playground" className="hover:text-[#35877D] transition-colors">B2B Wholesale</Link></li>
                            <li><a href="#" className="hover:text-[#35877D] transition-colors">Lead Qualification</a></li>
                            <li><a href="#" className="hover:text-[#35877D] transition-colors">Support Automation</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Resources */}
                    <div className="space-y-4">
                        <h4 className="font-extrabold text-sm text-[#0B2E1E] uppercase tracking-wider">Resources</h4>
                        <ul className="space-y-3 text-sm font-medium text-gray-455">
                            <li><Link href="/blog" className="hover:text-[#35877D] transition-colors">Blog</Link></li>
                            <li><Link href="/privacy" className="hover:text-[#35877D] transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-[#35877D] transition-colors">Terms of Service</Link></li>
                            <li><Link href="/cookie-policy" className="hover:text-[#35877D] transition-colors">Cookie Policy</Link></li>
                            <li><Link href="/refund-policy" className="hover:text-[#35877D] transition-colors">Refund Policy</Link></li>
                            <li><Link href="/faq" className="hover:text-[#35877D] transition-colors">FAQs</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-455 font-medium">
                        © {new Date().getFullYear()} Connectly360. All rights reserved.
                    </p>
                    <p className="text-sm text-gray-455 font-medium">
                        Empower your business with smart Conversational CRM & official WhatsApp API workflows.
                    </p>
                </div>
            </div>
        </footer>
    );
}
