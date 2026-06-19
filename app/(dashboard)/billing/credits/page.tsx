import { Wallet } from "lucide-react";

export default function CreditsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                    <Wallet size={20} className="text-[#378179]" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Credits</h1>
                    <p className="text-sm text-slate-500">View your available credits and usage</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Available Credits", value: "1,250", desc: "Credits remaining this month" },
                    { label: "Used Credits", value: "750", desc: "Credits consumed this month" },
                    { label: "Total Credits", value: "2,000", desc: "Total credits allocated" },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                        <p className="text-3xl font-extrabold text-slate-900 mt-2">{stat.value}</p>
                        <p className="text-xs text-slate-400 mt-1">{stat.desc}</p>
                    </div>
                ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-10 flex flex-col items-center justify-center gap-3 text-center min-h-[200px]">
                <Wallet size={40} className="text-slate-300" />
                <p className="text-slate-500 text-sm font-medium">No credit transactions yet</p>
                <p className="text-slate-400 text-xs">Your credit usage history will appear here.</p>
            </div>
        </div>
    );
}
