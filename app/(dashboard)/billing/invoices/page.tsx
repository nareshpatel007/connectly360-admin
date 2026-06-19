import { FileText, Download } from "lucide-react";

const INVOICES = [
    { id: "INV-001", date: "Jun 1, 2026", amount: "$79.00", status: "Paid", plan: "Growth Plan" },
    { id: "INV-002", date: "May 1, 2026", amount: "$79.00", status: "Paid", plan: "Growth Plan" },
    { id: "INV-003", date: "Apr 1, 2026", amount: "$29.00", status: "Paid", plan: "Starter Plan" },
];

export default function InvoicesPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                    <FileText size={20} className="text-[#378179]" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Invoices</h1>
                    <p className="text-sm text-slate-500">Download and manage your billing invoices</p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <span>Invoice</span>
                    <span>Date</span>
                    <span>Description</span>
                    <span>Amount</span>
                    <span>Action</span>
                </div>
                {INVOICES.map((inv) => (
                    <div key={inv.id} className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-slate-100 last:border-0 items-center">
                        <span className="text-sm font-semibold text-slate-800">{inv.id}</span>
                        <span className="text-sm text-slate-600">{inv.date}</span>
                        <span className="text-sm text-slate-600">{inv.plan}</span>
                        <span className="text-sm font-semibold text-slate-900">{inv.amount}</span>
                        <button className="flex items-center gap-1.5 text-xs font-semibold text-[#378179] hover:text-[#079E61] transition-colors">
                            <Download size={13} />
                            Download
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
