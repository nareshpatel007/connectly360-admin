"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Search,
    ShieldCheck,
    Plus,
    RefreshCw,
    UserCheck,
    ShieldAlert,
    ChevronLeft,
    ChevronRight,
    Send,
    Edit2,
    Lock,
    Unlock,
    Mail
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin-page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AdministratorRecord {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    user_type: string;
    is_admin: boolean;
    role: string;
    roles: string[];
    permissions_count: number;
    status: string;
    last_login_at?: string;
    created_at: string;
}

export default function AdministratorsPage() {
    const { token, user: currentUser } = useAuth();
    const [admins, setAdmins] = useState<AdministratorRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Pagination
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ total: 0, last_page: 1 });

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<AdministratorRecord | null>(null);
    const [pendingStatusAdmin, setPendingStatusAdmin] = useState<{ admin: AdministratorRecord; nextStatus: string } | null>(null);

    // Form states
    const [addForm, setAddForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        role: "Admin",
        status: "active",
        send_invitation: true,
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchAdministrators = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: "15"
            });
            if (search) params.append("search", search);
            if (roleFilter !== "all") params.append("role", roleFilter);
            if (statusFilter !== "all") params.append("status", statusFilter);

            const res = await fetch(`/api/admin/administrators?${params.toString()}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });

            const data = await res.json();
            if (data.status) {
                setAdmins(data.data.data || []);
                setMeta({
                    total: data.data.total || 0,
                    last_page: data.data.last_page || 1
                });
            } else {
                toast.error(data.message || "Failed to load administrators");
            }
        } catch (err) {
            toast.error("Network error while loading administrators");
        } finally {
            setLoading(false);
        }
    }, [token, page, search, roleFilter, statusFilter]);

    useEffect(() => {
        fetchAdministrators();
    }, [fetchAdministrators]);

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addForm.email) {
            toast.error("Email address is required.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/admin/administrators", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                },
                body: JSON.stringify(addForm)
            });

            const data = await res.json();
            if (data.status) {
                toast.success("Administrator created successfully.");
                setIsAddModalOpen(false);
                setAddForm({ first_name: "", last_name: "", email: "", role: "Admin", status: "active", send_invitation: true });
                fetchAdministrators();
            } else {
                toast.error(data.message || "Failed to create administrator");
            }
        } catch {
            toast.error("Error creating administrator");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingAdmin) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/admin/administrators/${editingAdmin.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                },
                body: JSON.stringify({
                    first_name: editingAdmin.first_name,
                    last_name: editingAdmin.last_name,
                    role: editingAdmin.role,
                })
            });

            const data = await res.json();
            if (data.status) {
                toast.success("Administrator updated successfully.");
                setEditingAdmin(null);
                fetchAdministrators();
            } else {
                toast.error(data.message || "Failed to update administrator");
            }
        } catch {
            toast.error("Error updating administrator");
        } finally {
            setSubmitting(false);
        }
    };

    const confirmToggleStatus = async () => {
        if (!pendingStatusAdmin) return;
        const { admin, nextStatus } = pendingStatusAdmin;

        try {
            const res = await fetch(`/api/admin/administrators/${admin.id}/status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                },
                body: JSON.stringify({ status: nextStatus })
            });

            const data = await res.json();
            if (data.status) {
                toast.success(`Administrator status changed to ${nextStatus}`);
                fetchAdministrators();
                setPendingStatusAdmin(null);
            } else {
                toast.error(data.message || "Failed to update status");
            }
        } catch {
            toast.error("Error updating administrator status");
        }
    };

    const handleResendInvitation = async (admin: AdministratorRecord) => {
        try {
            const res = await fetch(`/api/admin/administrators/${admin.id}/resend-invitation`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });

            const data = await res.json();
            if (data.status) {
                toast.success(data.message || "Invitation email resent successfully.");
            } else {
                toast.error(data.message || "Failed to resend invitation");
            }
        } catch {
            toast.error("Error resending invitation");
        }
    };

    return (
        <div className="space-y-6 font-sans">
            <AdminPageHeader
                title="Administrators"
                description="Manage internal platform administrators, roles, permissions, and security access."
                actions={
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-[#35877D] hover:bg-[#2c6e66] text-white text-xs font-semibold rounded-xl gap-2 h-9"
                    >
                        <Plus size={15} /> Add Administrator
                    </Button>
                }
            />

            {/* Filters Bar */}
            <Card className="p-4 border-slate-200 bg-white rounded-2xl shadow-xs dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                        <Input
                            placeholder="Search administrators by name or email..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="pl-9 h-9 text-xs border-slate-200 rounded-xl"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Select value={roleFilter} onValueChange={(val) => { setRoleFilter(val); setPage(1); }}>
                            <SelectTrigger className="w-[160px] h-9 text-xs rounded-xl border-slate-200">
                                <SelectValue placeholder="All Roles" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="Super Admin">Super Admin</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Support Admin">Support Admin</SelectItem>
                                <SelectItem value="Billing Admin">Billing Admin</SelectItem>
                                <SelectItem value="Marketing Admin">Marketing Admin</SelectItem>
                                <SelectItem value="AI Admin">AI Admin</SelectItem>
                                <SelectItem value="Read Only Admin">Read Only Admin</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
                            <SelectTrigger className="w-[140px] h-9 text-xs rounded-xl border-slate-200">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={fetchAdministrators}
                            className="size-9 rounded-xl border-slate-200"
                        >
                            <RefreshCw size={14} className={loading ? "animate-spin text-[#35877D]" : "text-slate-600"} />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Administrators Table */}
            <Card className="border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider dark:bg-slate-800 dark:border-slate-700">
                            <tr>
                                <th className="px-5 py-3.5">Administrator</th>
                                <th className="px-5 py-3.5">Email</th>
                                <th className="px-5 py-3.5">Role</th>
                                <th className="px-5 py-3.5">Permissions</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5">Last Login</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-5 py-4"><Skeleton className="h-4 w-32" /></td>
                                        <td className="px-5 py-4"><Skeleton className="h-4 w-40" /></td>
                                        <td className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>
                                        <td className="px-5 py-4"><Skeleton className="h-4 w-16" /></td>
                                        <td className="px-5 py-4"><Skeleton className="h-4 w-16" /></td>
                                        <td className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>
                                        <td className="px-5 py-4 text-right"><Skeleton className="h-8 w-20 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : admins.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                                        No internal platform administrators found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                admins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-slate-50/70 transition-colors dark:hover:bg-slate-800/50">
                                        <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-slate-100">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex size-8 items-center justify-center rounded-full bg-[#35877D]/10 text-[#35877D] font-bold text-xs">
                                                    {admin.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <span className="block font-medium">{admin.name}</span>
                                                    {admin.roles.includes("Super Admin") && (
                                                        <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Super Admin</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 font-mono">
                                            {admin.email}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <Badge variant="outline" className="border-teal-200 bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                                                {admin.role}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-500">
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">{admin.permissions_count}</span> permissions
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {admin.status === "active" ? (
                                                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                                                    ● Active
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400">
                                                    ● Suspended
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-500">
                                            {admin.last_login_at ? new Date(admin.last_login_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Never"}
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleResendInvitation(admin)}
                                                    className="size-8 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                                                    title="Resend Invitation Email"
                                                >
                                                    <Mail size={14} />
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setEditingAdmin(admin)}
                                                    className="size-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                                                    title="Edit Administrator Role"
                                                >
                                                    <Edit2 size={14} />
                                                </Button>

                                                {admin.status === "active" ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setPendingStatusAdmin({ admin, nextStatus: "suspended" })}
                                                        className="size-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                                        title="Suspend Administrator"
                                                    >
                                                        <Lock size={14} />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setPendingStatusAdmin({ admin, nextStatus: "active" })}
                                                        className="size-8 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg"
                                                        title="Activate Administrator"
                                                    >
                                                        <Unlock size={14} />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {meta.last_page > 1 && (
                    <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 dark:border-slate-800">
                        <span>Showing page {page} of {meta.last_page} ({meta.total} administrators)</span>
                        <div className="flex items-center gap-2">
                            <Button
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg"
                            >
                                <ChevronLeft size={14} /> Previous
                            </Button>
                            <Button
                                disabled={page >= meta.last_page}
                                onClick={() => setPage(p => p + 1)}
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg"
                            >
                                Next <ChevronRight size={14} />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Add Administrator Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-xl dark:bg-slate-900 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <ShieldCheck className="size-5 text-[#35877D]" /> Add Administrator
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Create a new internal Connectly360 platform administrator and assign operational access.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleAddAdmin} className="space-y-4 mt-3">
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="First Name"
                                placeholder="John"
                                value={addForm.first_name}
                                onChange={(e) => setAddForm({ ...addForm, first_name: e.target.value })}
                            />
                            <Input
                                label="Last Name"
                                placeholder="Doe"
                                value={addForm.last_name}
                                onChange={(e) => setAddForm({ ...addForm, last_name: e.target.value })}
                            />
                        </div>

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="admin@connectly360.com"
                            value={addForm.email}
                            onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                            required
                        />

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Assigned Platform Role
                            </label>
                            <Select
                                value={addForm.role}
                                onValueChange={(val) => setAddForm({ ...addForm, role: val })}
                            >
                                <SelectTrigger className="w-full h-9 text-xs rounded-lg border-slate-200">
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="Super Admin">Super Admin (Full Access)</SelectItem>
                                    <SelectItem value="Admin">Admin (Full Operational Access)</SelectItem>
                                    <SelectItem value="Support Admin">Support Admin (Support & Users)</SelectItem>
                                    <SelectItem value="Billing Admin">Billing Admin (Billing & Credits)</SelectItem>
                                    <SelectItem value="Marketing Admin">Marketing Admin (Campaigns & WABA)</SelectItem>
                                    <SelectItem value="AI Admin">AI Admin (AI & System)</SelectItem>
                                    <SelectItem value="Read Only Admin">Read Only Admin (Audit & View)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" loading={submitting}>
                                Create Administrator
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Administrator Modal */}
            <Dialog open={!!editingAdmin} onOpenChange={(open) => !open && setEditingAdmin(null)}>
                <DialogContent className="max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-xl dark:bg-slate-900 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Edit2 className="size-5 text-[#35877D]" /> Edit Administrator
                        </DialogTitle>
                    </DialogHeader>

                    {editingAdmin && (
                        <form onSubmit={handleEditAdmin} className="space-y-4 mt-3">
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="First Name"
                                    value={editingAdmin.first_name || ""}
                                    onChange={(e) => setEditingAdmin({ ...editingAdmin, first_name: e.target.value })}
                                />
                                <Input
                                    label="Last Name"
                                    value={editingAdmin.last_name || ""}
                                    onChange={(e) => setEditingAdmin({ ...editingAdmin, last_name: e.target.value })}
                                />
                            </div>

                            <Input
                                label="Email Address"
                                value={editingAdmin.email}
                                disabled
                                helperText="Email address cannot be changed."
                            />

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Assigned Platform Role
                                </label>
                                <Select
                                    value={editingAdmin.role}
                                    onValueChange={(val) => setEditingAdmin({ ...editingAdmin, role: val })}
                                >
                                    <SelectTrigger className="w-full h-9 text-xs rounded-lg border-slate-200">
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="Support Admin">Support Admin</SelectItem>
                                        <SelectItem value="Billing Admin">Billing Admin</SelectItem>
                                        <SelectItem value="Marketing Admin">Marketing Admin</SelectItem>
                                        <SelectItem value="AI Admin">AI Admin</SelectItem>
                                        <SelectItem value="Read Only Admin">Read Only Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" size="sm" onClick={() => setEditingAdmin(null)}>
                                    Cancel
                                </Button>
                                <Button type="submit" size="sm" loading={submitting}>
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Confirm Status Toggle */}
            <ConfirmDialog
                open={!!pendingStatusAdmin}
                onOpenChange={(open) => !open && setPendingStatusAdmin(null)}
                title={`Change Administrator Status to ${pendingStatusAdmin?.nextStatus}?`}
                description={`Are you sure you want to change '${pendingStatusAdmin?.admin.name}' status to '${pendingStatusAdmin?.nextStatus}'? ${pendingStatusAdmin?.nextStatus === "suspended" ? "This will immediately revoke their access to the Connectly360 Admin Panel." : ""}`}
                confirmText={`Set Status to ${pendingStatusAdmin?.nextStatus}`}
                variant={pendingStatusAdmin?.nextStatus === "suspended" ? "destructive" : "primary"}
                onConfirm={confirmToggleStatus}
            />
        </div>
    );
}
