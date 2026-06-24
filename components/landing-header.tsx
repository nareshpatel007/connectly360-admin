"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu,
    X,
    ChevronDown,
    ArrowRight,
    QrCode,
    Link2,
    MessageSquarePlus,
    Bot,
    FileText,
    Megaphone,
    GitBranch,
    Sparkles,
    Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

const productItems = [
    {
        icon: QrCode,
        title: "WhatsApp QR code",
        desc: "Generate WhatsApp QR codes",
        href: "#",
        color: "bg-[#EAF7F2] text-[#00382b] group-hover/item:bg-[#00382b] group-hover/item:text-white"
    },
    {
        icon: Link2,
        title: "WhatsApp link generator",
        desc: "Create links to connect with customers",
        href: "#",
        color: "bg-[#EAF7F2] text-[#00382b] group-hover/item:bg-[#00382b] group-hover/item:text-white"
    },
    {
        icon: MessageSquarePlus,
        title: "WhatsApp chat widget",
        desc: "Add chat button to connect with visitors",
        href: "#",
        color: "bg-[#EAF7F2] text-[#00382b] group-hover/item:bg-[#00382b] group-hover/item:text-white"
    },
    {
        icon: Bot,
        title: "WhatsApp Chatbots",
        desc: "Automate conversations at scale",
        href: "#",
        color: "bg-[#EAF7F2] text-[#00382b] group-hover/item:bg-[#00382b] group-hover/item:text-white"
    },
    {
        icon: FileText,
        title: "WhatsApp Flows",
        desc: "Collect user info using forms",
        href: "#",
        color: "bg-[#EAF7F2] text-[#00382b] group-hover/item:bg-[#00382b] group-hover/item:text-white"
    },
    {
        icon: Megaphone,
        title: "WhatsApp Broadcast",
        desc: "Scale one-to-many campaigns",
        href: "#",
        color: "bg-[#EAF7F2] text-[#00382b] group-hover/item:bg-[#00382b] group-hover/item:text-white"
    },
    {
        icon: GitBranch,
        title: "WhatsApp Drip Marketing",
        desc: "Automate sequence messages",
        href: "#",
        color: "bg-[#EAF7F2] text-[#00382b] group-hover/item:bg-[#00382b] group-hover/item:text-white"
    },
    {
        icon: Sparkles,
        title: "WhatsApp AI template generator",
        desc: "Create WhatsApp templates with prompts",
        href: "#",
        color: "bg-[#EAF7F2] text-[#00382b] group-hover/item:bg-[#00382b] group-hover/item:text-white"
    },
    {
        icon: Users,
        title: "WhatsApp Shared Team Inbox",
        desc: "Collaborate seamlessly with team members",
        href: "#",
        color: "bg-[#EAF7F2] text-[#00382b] group-hover/item:bg-[#00382b] group-hover/item:text-white"
    }
];

export function LandingHeader() {
    const { isAuthenticated, user } = useAuth();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

    return (
        <div className="w-full z-50 flex flex-col fixed top-0">
            {/* Top Webinar Banner */}
            <div className="bg-[#00382b] text-white py-2.5 px-4 text-xs font-normal text-center flex items-center justify-center gap-1.5 transition-colors border-b border-emerald-950/20">
                <span>
                    Start Sending Bulk Campaigns Today! 🎉{" "}
                    <Link href="/pricing" className="underline hover:text-[#ebd25b] transition-colors ml-1">
                        Pay ₹999 & Get 500 Messages Free.
                    </Link>
                </span>
            </div>

            {/* Main Header */}
            <header className="bg-white border-b border-gray-100 shadow-xs h-20 flex items-center justify-between px-6 md:px-12 w-full relative">
                {/* Logo Section */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 group">
                        <img src="/images/logo.png" alt="Connectly360 Logo" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
                    </Link>
                </div>

                {/* Center Navigation Links */}
                <nav className="hidden lg:flex items-center gap-7 h-full">
                    {/* Products with Mega Menu */}
                    <div className="group cursor-pointer h-full flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-[#35877D] transition-colors">
                        <span className="py-2">Products</span>
                        <ChevronDown size={14} className="text-gray-400 transition-transform duration-250 group-hover:rotate-180 group-hover:text-[#35877D]" />

                        {/* Dropdown Spacer area to prevent losing hover */}
                        <div className="absolute top-[80px] left-0 w-full h-4 bg-transparent invisible group-hover:visible" />

                        {/* Full Width Mega Menu Panel */}
                        <div className="absolute top-[80px] left-0 w-full bg-white border-b border-slate-100 shadow-2xl py-8 px-6 md:px-12 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-auto transform translate-y-2 group-hover:translate-y-0">
                            <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
                                {/* Left Section: Products Grid */}
                                <div className="col-span-9 grid grid-cols-3 gap-5">
                                    {productItems.map((item, idx) => {
                                        const IconComp = item.icon;
                                        return (
                                            <Link
                                                key={idx}
                                                href={item.href}
                                                className="group/item flex gap-3.5 p-3.5 rounded-2xl hover:bg-slate-50/70 border border-transparent hover:border-slate-100/80 transition-all duration-200"
                                            >
                                                <div className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center transition-colors duration-250 ${item.color}`}>
                                                    <IconComp size={20} className="transition-transform group-hover/item:scale-110" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <h4 className="text-sm font-bold text-slate-800 transition-colors group-hover/item:text-[#35877D]">
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-xs text-slate-450 font-normal leading-normal">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Right Section: Promotion/CTA Card */}
                                <div className="col-span-3 bg-gradient-to-br from-[#35877D]/5 via-[#60B187]/5 to-transparent border border-slate-100 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group/promo">
                                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#35877D]/10 rounded-full blur-xl pointer-events-none transition-transform duration-500 group-hover/promo:scale-125" />
                                    <div className="space-y-3">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#35877D]/10 text-[#35877D] text-[10px] font-bold uppercase tracking-wider">
                                            Meta Partner
                                        </span>
                                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                                            Need a custom chat automation built?
                                        </h3>
                                        <p className="text-[11px] text-gray-500 font-normal leading-relaxed">
                                            Book a free 1-on-1 setup session. We will build a proof-of-concept for your team in under 15 minutes.
                                        </p>
                                    </div>
                                    <Button asChild size="sm" className="w-full mt-4 h-9 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer border-0">
                                        <Link href="/book-demo">
                                            Book Setup Demo <ArrowRight size={12} />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group cursor-pointer py-2 flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-[#35877D] transition-colors">
                        <span>Solutions</span>
                        <ChevronDown size={14} className="text-gray-400 group-hover:text-[#35877D] transition-colors" />
                    </div>
                    <div className="relative group cursor-pointer py-2 flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-[#35877D] transition-colors">
                        <span>Integrations</span>
                        <ChevronDown size={14} className="text-gray-400 group-hover:text-[#35877D] transition-colors" />
                    </div>
                    <Link href="/pricing" className={`text-sm font-bold hover:text-[#35877D] transition-colors ${pathname === "/pricing" ? "text-[#35877D]" : "text-gray-700"}`}>
                        Pricing
                    </Link>
                    <Link href="/contact" className={`text-sm font-bold hover:text-[#35877D] transition-colors ${pathname === "/contact" ? "text-[#35877D]" : "text-gray-700"}`}>
                        Partnerships
                    </Link>
                    <Link href="/blog" className={`text-sm font-bold hover:text-[#35877D] transition-colors ${pathname.startsWith("/blog") ? "text-[#35877D]" : "text-gray-700"}`}>
                        Blog
                    </Link>
                    {/* <div className="relative group cursor-pointer py-2 flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-[#35877D] transition-colors">
                        <span>Resources</span>
                        <ChevronDown size={14} className="text-gray-400 group-hover:text-[#35877D] transition-colors" />
                    </div> */}
                </nav>

                {/* Right Actions Menu */}
                <div className="hidden lg:flex items-center gap-2">
                    {isAuthenticated ? (
                        <>
                            <Button asChild variant="outline" size="sm" className="rounded-full px-4 py-2 h-9 border-[#35877D] text-[#35877D] hover:bg-[#EAF7F2] hover:text-[#2c6f66] bg-transparent transition-all font-extrabold text-xs">
                                <Link href="/contact">
                                    Need Help?
                                </Link>
                            </Button>
                            <Button asChild size="sm" className="rounded-full px-4 py-2 h-9 bg-[#35877D] hover:bg-[#2c6f66] text-white transition-all shadow-sm font-extrabold text-xs flex items-center gap-1">
                                <Link href="/dashboard">
                                    Dashboard <ArrowRight size={12} />
                                </Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button asChild variant="outline" size="sm" className="rounded-full px-4 py-2 h-9 border-[#35877D] text-[#35877D] hover:bg-[#EAF7F2] hover:text-[#2c6f66] bg-transparent transition-all font-extrabold text-xs">
                                <Link href="/book-demo">
                                    Book a Demo
                                </Link>
                            </Button>
                            <Button asChild size="sm" className="rounded-full px-4 py-2 h-9 bg-[#35877D] hover:bg-[#2c6f66] text-white transition-all shadow-sm font-extrabold text-xs flex items-center gap-1">
                                <Link href="/register">
                                    Start Free Trial <ArrowRight size={12} />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm" className="rounded-full px-4 py-2 h-9 border-[#35877D] text-[#35877D] hover:bg-[#EAF7F2] hover:text-[#2c6f66] bg-transparent transition-all font-extrabold text-xs">
                                <Link href="/login">
                                    Log In
                                </Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden text-gray-700 hover:text-[#35877D]"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-32 left-0 w-full bg-white border-b border-gray-100 p-6 flex flex-col gap-4 shadow-lg z-50 max-h-[calc(100vh-8rem)] overflow-y-auto">
                    {/* Expandable Products Item */}
                    <div className="flex flex-col">
                        <button
                            onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                            className="flex items-center justify-between text-base font-bold text-gray-700 p-2 border-b border-gray-50 text-left w-full"
                        >
                            <span>Products</span>
                            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${mobileProductsOpen ? "rotate-180" : ""}`} />
                        </button>
                        {mobileProductsOpen && (
                            <div className="pl-4 pr-2 py-2 flex flex-col gap-3 bg-slate-50/50 rounded-xl mt-2">
                                {productItems.map((item, idx) => {
                                    const IconComp = item.icon;
                                    return (
                                        <Link
                                            key={idx}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100"
                                        >
                                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                                                <IconComp size={16} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                                                <p className="text-[10px] text-slate-400 font-normal leading-normal">{item.desc}</p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <span className="text-base font-bold text-gray-700 p-2 border-b border-gray-50">Solutions</span>
                    <span className="text-base font-bold text-gray-700 p-2 border-b border-gray-50">Integrations</span>
                    <Link href="/pricing" className="text-base font-bold text-gray-700 p-2 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                    <Link href="/contact" className="text-base font-bold text-gray-700 p-2 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>Partnerships</Link>
                    <Link href="/blog" className="text-base font-bold text-gray-700 p-2 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
                    <span className="text-base font-bold text-gray-700 p-2 border-b border-gray-50">Resources</span>

                    <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                        <Link href="/book-demo" className="text-center font-bold text-gray-700 p-2" onClick={() => setMobileMenuOpen(false)}>Demo</Link>
                        {isAuthenticated ? (
                            <Button asChild className="w-full bg-[#35877D] text-white font-extrabold rounded-full py-3 text-sm">
                                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Link href="/login" className="text-center font-bold text-gray-700 p-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                                <Button asChild className="w-full bg-[#35877D] text-white font-extrabold rounded-full py-3 text-sm">
                                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>Start Free Trial</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}


