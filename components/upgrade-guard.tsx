"use client";

import React from "react";
import Link from "next/link";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

interface UpgradeGuardProps {
    allowedPlans: string[];
    featureName: string;
    description: string;
    children: React.ReactNode;
}

export function UpgradeGuard({ allowedPlans, featureName, description, children }: UpgradeGuardProps) {
    const { user } = useAuth();
    const currentPlan = (user?.plan || "growth").toLowerCase();

    // Map plans to level integers for comparison
    const planLevels: Record<string, number> = {
        starter: 1,
        growth: 2,
        business: 3,
        enterprise: 4
    };

    const hasAccess = allowedPlans.some(p => p.toLowerCase() === currentPlan) || 
                      (planLevels[currentPlan] >= Math.min(...allowedPlans.map(p => planLevels[p.toLowerCase()] || 99)));

    if (hasAccess) {
        return <>{children}</>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
            <div className="relative mb-6">
                <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 animate-pulse">
                    <Lock size={28} />
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-[#378179] text-white flex items-center justify-center shadow-md">
                    <Sparkles size={12} />
                </div>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                Unlock {featureName}
            </h2>
            <p className="text-sm text-slate-500 max-w-md mb-8 leading-relaxed">
                {description} This feature is not available on your current plan ({user?.plan ? user.plan.toUpperCase() : "STARTER"}).
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="bg-[#378179] hover:bg-[#2c665f] text-white rounded-xl px-6 h-11 text-sm font-bold shadow-md flex items-center gap-2">
                    <Link href="/billing/subscription">
                        Upgrade Your Plan <ArrowRight size={16} />
                    </Link>
                </Button>
                <Button asChild variant="outline" className="border-slate-200 hover:bg-slate-50 rounded-xl px-6 h-11 text-sm font-bold">
                    <Link href="/dashboard">
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
        </div>
    );
}
