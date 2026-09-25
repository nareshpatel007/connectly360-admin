"use client";

import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminRegisterPage() {
    return (
        <div className="w-full max-w-md space-y-6 z-10">
            {/* Header / Branding */}
            <div className="text-center space-y-3">
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
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Admin Account Access
                    </h1>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                        Restricted System Area
                    </p>
                </div>
            </div>

            {/* Info Card */}
            <Card className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-md space-y-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#35877D]/10 text-[#35877D] border border-[#35877D]/20">
                    <Shield size={24} />
                </div>
                
                <div className="space-y-2">
                    <h2 className="text-lg font-bold text-slate-900">Admin Registration Disabled</h2>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Platform administrator accounts are managed by system owners and cannot be registered publicly. Please sign in with your issued admin credentials.
                    </p>
                </div>

                <Button
                    asChild
                    className="w-full h-11 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer border-0"
                >
                    <Link href="/login">
                        <span>Sign in to Admin Console</span>
                        <ArrowRight size={15} />
                    </Link>
                </Button>
            </Card>

            <p className="text-center text-[11px] text-slate-400 font-medium">
                Authorized Connectly360 administrators only.
            </p>
        </div>
    );
}
