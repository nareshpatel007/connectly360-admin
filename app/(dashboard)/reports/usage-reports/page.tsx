import { BarChart3 } from "lucide-react";

export default function UsageReportsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                    <BarChart3 size={20} className="text-[#378179]" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Usage Reports</h1>
                    <p className="text-sm text-slate-500">Track your platform usage and message volumes</p>
                </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-10 flex flex-col items-center justify-center gap-3 text-center min-h-[300px]">
                <BarChart3 size={40} className="text-slate-300" />
                <p className="text-slate-500 text-sm font-medium">No usage data yet</p>
                <p className="text-slate-400 text-xs">Usage statistics will appear here as you use the platform.</p>
            </div>
        </div>
    );
}
