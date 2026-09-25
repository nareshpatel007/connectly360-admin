"use client";

import Link from "next/link";
import { ArrowRight, LayoutDashboard, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900 selection:bg-[#35877D] selection:text-white">
            <Card className="max-w-md w-full bg-white border border-slate-200 shadow-md rounded-3xl p-8 text-center space-y-6">
                {/* Brand Logo Header */}
                <div className="flex justify-center items-center gap-2">
                    <img
                        src="/images/logo.png"
                        alt="Connectly360 Logo"
                        className="h-9 w-auto object-contain"
                    />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#35877D]/10 text-[#35877D] border border-[#35877D]/20">
                        Admin Console
                    </span>
                </div>

                {/* 404 Visual Indicator */}
                <div className="space-y-2 py-2">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mb-2">
                        <ShieldAlert size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">404 - Page Not Found</h1>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        The admin route or console page you requested does not exist or has been relocated.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                    <Button
                        asChild
                        className="w-full h-11 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer border-0"
                    >
                        <Link href="/dashboard">
                            <LayoutDashboard size={16} />
                            <span>Return to Admin Overview</span>
                            <ArrowRight size={14} />
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        className="w-full h-10 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold"
                    >
                        <Link href="/login">
                            Back to Admin Login
                        </Link>
                    </Button>
                </div>

                <p className="text-[11px] text-slate-400 font-medium">
                    Authorized Connectly360 administrators only.
                </p>
            </Card>
        </div>
    );
}
