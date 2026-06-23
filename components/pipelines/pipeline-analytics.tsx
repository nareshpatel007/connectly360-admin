"use client";

import type { Lead } from "@/lib/api-client-react";
import { Card } from "@/components/ui/card";
import { Target, CheckCircle2, TrendingUp, Inbox } from "lucide-react";

export function PipelineAnalytics({ leads }: { leads: Lead[] }) {
    const totalCount = leads.length;
    const convertedCount = leads.filter((l) => l.status === "converted").length;
    const activeCount = leads.filter((l) => l.status === "new" || l.status === "contacted").length;
    const lostCount = leads.filter((l) => l.status === "lost").length;

    const conversionRate = totalCount > 0 ? Math.round((convertedCount / totalCount) * 100) : 0;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-white border border-slate-200 shadow-xs flex items-center gap-3.5 rounded-2xl">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                    <Inbox size={20} />
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Leads</p>
                    <h4 className="text-xl font-extrabold text-slate-800 mt-0.5">{totalCount}</h4>
                </div>
            </Card>

            <Card className="p-4 bg-white border border-slate-200 shadow-xs flex items-center gap-3.5 rounded-2xl">
                <div className="h-10 w-10 rounded-xl bg-[#35877D]/10 text-[#35877D] flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Converted</p>
                    <h4 className="text-xl font-extrabold text-slate-800 mt-0.5">{convertedCount}</h4>
                </div>
            </Card>

            <Card className="p-4 bg-white border border-slate-200 shadow-xs flex items-center gap-3.5 rounded-2xl">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Target size={20} />
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Leads</p>
                    <h4 className="text-xl font-extrabold text-slate-800 mt-0.5">{activeCount}</h4>
                </div>
            </Card>

            <Card className="p-4 bg-white border border-slate-200 shadow-xs flex items-center gap-3.5 rounded-2xl">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                    <TrendingUp size={20} />
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Win Rate</p>
                    <h4 className="text-xl font-extrabold text-slate-800 mt-0.5">{conversionRate}%</h4>
                </div>
            </Card>
        </div>
    );
}
