import { UserPlus, Mail, MoreHorizontal } from "lucide-react";

const MEMBERS = [
    { name: "Naresh Patel", email: "naresh@connectly360.com", role: "Owner", joined: "Jan 2026", avatar: "N" },
    { name: "Priya Shah", email: "priya@connectly360.com", role: "Admin", joined: "Feb 2026", avatar: "P" },
    { name: "Ravi Kumar", email: "ravi@connectly360.com", role: "Agent", joined: "Mar 2026", avatar: "R" },
];

export default function TeamMembersPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                        <UserPlus size={20} className="text-[#378179]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Team Members</h1>
                        <p className="text-sm text-slate-500">Manage your workspace team</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#378179] hover:bg-[#079E61] text-white text-sm font-semibold rounded-xl transition-colors">
                    <UserPlus size={15} />
                    Invite Member
                </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <div className="grid grid-cols-4 gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <span>Member</span>
                    <span>Role</span>
                    <span>Joined</span>
                    <span></span>
                </div>
                {MEMBERS.map((m) => (
                    <div key={m.email} className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-slate-100 last:border-0 items-center">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-[#378179] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                {m.avatar}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{m.name}</p>
                                <p className="text-xs text-slate-500">{m.email}</p>
                            </div>
                        </div>
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold w-fit ${m.role === "Owner" ? "bg-purple-100 text-purple-700" : m.role === "Admin" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                            {m.role}
                        </span>
                        <span className="text-sm text-slate-600">{m.joined}</span>
                        <button className="ml-auto text-slate-400 hover:text-slate-700 transition-colors">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
