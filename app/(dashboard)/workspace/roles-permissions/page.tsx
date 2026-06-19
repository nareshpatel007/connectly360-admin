import { Shield, CheckCircle2 } from "lucide-react";
import { UpgradeGuard } from "@/components/upgrade-guard";

const ROLES = [
    {
        name: "Owner",
        desc: "Full access to all features and settings",
        permissions: ["Manage billing", "Manage team", "All agent permissions", "Delete workspace"],
        color: "purple",
    },
    {
        name: "Admin",
        desc: "Manage team and most platform features",
        permissions: ["Invite team members", "Manage integrations", "View reports", "All agent permissions"],
        color: "blue",
    },
    {
        name: "Agent",
        desc: "Handle conversations and use core features",
        permissions: ["View inbox", "Reply to conversations", "Use AI assistant", "View contacts"],
        color: "green",
    },
];

export default function RolesPermissionsPage() {
    return (
        <UpgradeGuard 
            allowedPlans={["growth", "business", "enterprise"]} 
            featureName="Roles & Permissions" 
            description="Delegate workspace administration, configure security levels, and manage role assignments."
        >
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#378179]/10 flex items-center justify-center">
                        <Shield size={20} className="text-[#378179]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Roles & Permissions</h1>
                        <p className="text-sm text-slate-500">Manage role-based access for your team</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {ROLES.map((role) => (
                        <div key={role.name} className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${role.color === "purple" ? "bg-purple-100 text-purple-700" : role.color === "blue" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                                    {role.name}
                                </span>
                            </div>
                            <p className="text-sm text-slate-600">{role.desc}</p>
                            <ul className="space-y-2">
                                {role.permissions.map((p) => (
                                    <li key={p} className="flex items-center gap-2 text-xs text-slate-600">
                                        <CheckCircle2 size={13} className="text-[#378179] shrink-0" />
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </UpgradeGuard>
    );
}
