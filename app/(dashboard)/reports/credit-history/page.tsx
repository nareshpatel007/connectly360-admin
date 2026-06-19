import { Receipt } from "lucide-react";

export default function CreditHistoryPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                    <Receipt size={20} className="text-[#378179]" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Credit History</h1>
                    <p className="text-sm text-slate-500">View your credit usage and transaction history</p>
                </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-10 flex flex-col items-center justify-center gap-3 text-center min-h-[300px]">
                <Receipt size={40} className="text-slate-300" />
                <p className="text-slate-500 text-sm font-medium">No credit history yet</p>
                <p className="text-slate-400 text-xs">Your credit transactions will appear here.</p>
            </div>
        </div>
    );
}
