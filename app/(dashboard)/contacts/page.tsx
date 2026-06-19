import { Users } from "lucide-react";

export default function ContactsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                    <Users size={20} className="text-[#378179]" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Contacts</h1>
                    <p className="text-sm text-slate-500">Manage your contact list</p>
                </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-10 flex flex-col items-center justify-center gap-3 text-center min-h-[300px]">
                <Users size={40} className="text-slate-300" />
                <p className="text-slate-500 text-sm font-medium">No contacts yet</p>
                <p className="text-slate-400 text-xs">Your contacts will appear here once added.</p>
            </div>
        </div>
    );
}
