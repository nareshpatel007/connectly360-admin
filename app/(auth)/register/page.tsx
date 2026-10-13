"use client";

import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminAuthSplitLayout } from "@/components/auth/AdminAuthSplitLayout";

export default function AdminRegisterPage() {
    return (
        <AdminAuthSplitLayout>
            <Card className="w-full bg-white border border-slate-200/90 shadow-xl shadow-slate-200/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-5 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#35877D]/10 text-[#35877D] border border-[#35877D]/20 shadow-sm">
                    <Shield size={28} />
                </div>

                <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200/60 text-amber-700 text-[10px] font-bold uppercase tracking-wider mb-1">
                        System Policy Notice
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                        Self-Registration Restricted
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
                        Connectly360 platform administrator accounts are provisioned exclusively by Super Administrators and cannot be registered publicly.
                    </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800">Need Administrator Access?</p>
                    <p className="text-[11px] text-slate-500">
                        Contact your platform supervisor or DevOps administrator to issue your internal administrator credentials.
                    </p>
                </div>

                <div className="pt-2">
                    <Button
                        asChild
                        className="w-full h-11 bg-[#35877D] hover:bg-[#2b7068] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm flex items-center justify-center gap-2 cursor-pointer border-0"
                    >
                        <Link href="/login">
                            <span>Return to Admin Sign In</span>
                            <ArrowRight size={15} />
                        </Link>
                    </Button>
                </div>
            </Card>
        </AdminAuthSplitLayout>
    );
}
