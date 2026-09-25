"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
    UserCheck,
    Plus,
    RefreshCw,
    Edit2,
    Trash2,
    Check,
    X,
    Shield
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin-page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RoleRecord {
    id: number;
    name: string;
    permissions_count: number;
    administrators_count: number;
    permissions: string[];
    created_at: string;
}

interface PermissionGroup {
    module_key: string;
    module_title: string;
    permissions: { id: number; name: string }[];
}

export default function RolesPage() {
    const { token } = useAuth();
    const [roles, setRoles] = useState<RoleRecord[]>([]);
    const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleRecord | null>(null);
    const [deletingRoleId, setDeletingRoleId] = useState<number | null>(null);

    // Form state
    const [roleName, setRoleName] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [rolesRes, permsRes] = await Promise.all([
                fetch("/api/admin/roles", {
                    headers: { "Authorization": `Bearer ${token}`, "X-Api-Token": token || "" }
                }),
                fetch("/api/admin/permissions", {
                    headers: { "Authorization": `Bearer ${token}`, "X-Api-Token": token || "" }
                })
            ]);

            const rolesData = await rolesRes.json();
            const permsData = await permsRes.json();

            if (rolesData.status) {
                setRoles(rolesData.data || []);
            }
            if (permsData.status) {
                setPermissionGroups(permsData.data || []);
            }
        } catch {
            toast.error("Failed to load roles and permissions");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenCreateModal = () => {
        setRoleName("");
        setSelectedPermissions([]);
        setIsCreateModalOpen(true);
    };

    const handleOpenEditModal = (role: RoleRecord) => {
        setEditingRole(role);
        setRoleName(role.name);
        setSelectedPermissions(role.permissions || []);
    };

    const togglePermission = (permName: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(permName) ? prev.filter((p) => p !== permName) : [...prev, permName]
        );
    };

    const toggleGroupPermissions = (group: PermissionGroup) => {
        const groupPermNames = group.permissions.map((p) => p.name);
        const allSelected = groupPermNames.every((p) => selectedPermissions.includes(p));

        if (allSelected) {
            setSelectedPermissions((prev) => prev.filter((p) => !groupPermNames.includes(p)));
        } else {
            setSelectedPermissions((prev) => Array.from(new Set([...prev, ...groupPermNames])));
        }
    };

    const handleCreateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roleName.trim()) {
            toast.error("Role name is required.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/admin/roles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                },
                body: JSON.stringify({
                    name: roleName.trim(),
                    permissions: selectedPermissions,
                })
            });

            const data = await res.json();
            if (data.status) {
                toast.success("Role created successfully.");
                setIsCreateModalOpen(false);
                fetchData();
            } else {
                toast.error(data.message || "Failed to create role");
            }
        } catch {
            toast.error("Error creating role");
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRole) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/admin/roles/${editingRole.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                },
                body: JSON.stringify({
                    permissions: selectedPermissions,
                })
            });

            const data = await res.json();
            if (data.status) {
                toast.success("Role permissions updated successfully.");
                setEditingRole(null);
                fetchData();
            } else {
                toast.error(data.message || "Failed to update role");
            }
        } catch {
            toast.error("Error updating role");
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDeleteRole = async () => {
        if (!deletingRoleId) return;
        try {
            const res = await fetch(`/api/admin/roles/${deletingRoleId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });

            const data = await res.json();
            if (data.status) {
                toast.success("Role deleted successfully.");
                fetchData();
                setDeletingRoleId(null);
            } else {
                toast.error(data.message || "Failed to delete role");
            }
        } catch {
            toast.error("Error deleting role");
        }
    };

    return (
        <div className="space-y-6 font-sans">
            <AdminPageHeader
                title="Roles & Permissions"
                description="Define database-driven platform roles and configure fine-grained module access rights."
                actions={
                    <Button
                        onClick={handleOpenCreateModal}
                        className="bg-[#35877D] hover:bg-[#2c6e66] text-white text-xs font-semibold rounded-xl gap-2 h-9"
                    >
                        <Plus size={15} /> Create Role
                    </Button>
                }
            />

            {/* Roles Table */}
            <Card className="border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between dark:border-slate-800">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Platform Roles ({roles.length})
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchData}
                        className="size-8 rounded-lg border-slate-200"
                    >
                        <RefreshCw size={13} className={loading ? "animate-spin text-[#35877D]" : "text-slate-600"} />
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider dark:bg-slate-800 dark:border-slate-700">
                            <tr>
                                <th className="px-5 py-3.5">Role Name</th>
                                <th className="px-5 py-3.5">Assigned Admins</th>
                                <th className="px-5 py-3.5">Permissions</th>
                                <th className="px-5 py-3.5">Permission Preview</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-5 py-4"><Skeleton className="h-4 w-32" /></td>
                                        <td className="px-5 py-4"><Skeleton className="h-4 w-16" /></td>
                                        <td className="px-5 py-4"><Skeleton className="h-4 w-16" /></td>
                                        <td className="px-5 py-4"><Skeleton className="h-4 w-48" /></td>
                                        <td className="px-5 py-4 text-right"><Skeleton className="h-8 w-16 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : roles.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                                        No platform roles found.
                                    </td>
                                </tr>
                            ) : (
                                roles.map((role) => (
                                    <tr key={role.id} className="hover:bg-slate-50/70 transition-colors dark:hover:bg-slate-800/50">
                                        <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-slate-100">
                                            <div className="flex items-center gap-2">
                                                <Shield className="size-4 text-[#35877D]" />
                                                <span>{role.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-600">
                                            <Badge variant="secondary" className="font-semibold text-xs">
                                                {role.administrators_count} admins
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-600">
                                            <span className="font-bold text-[#35877D]">{role.permissions_count}</span> permissions
                                        </td>
                                        <td className="px-5 py-3.5 max-w-xs">
                                            <div className="flex flex-wrap gap-1">
                                                {role.permissions?.slice(0, 3).map((p) => (
                                                    <span key={p} className="text-[10px] bg-slate-100 text-slate-700 font-mono px-1.5 py-0.5 rounded dark:bg-slate-800 dark:text-slate-300">
                                                        {p}
                                                    </span>
                                                ))}
                                                {role.permissions?.length > 3 && (
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        +{role.permissions.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleOpenEditModal(role)}
                                                    className="size-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                                                    title="Edit Role Permissions"
                                                >
                                                    <Edit2 size={14} />
                                                </Button>
                                                {!["Super Admin", "Admin", "Owner", "Member"].includes(role.name) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setDeletingRoleId(role.id)}
                                                        className="size-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                                        title="Delete Custom Role"
                                                    >
                                                        <Trash2 size={14} />
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
            </Card>

            {/* Create / Edit Role Modal */}
            <Dialog open={isCreateModalOpen || !!editingRole} onOpenChange={(open) => { if (!open) { setIsCreateModalOpen(false); setEditingRole(null); } }}>
                <DialogContent className="max-w-2xl rounded-2xl bg-white border border-slate-200 p-6 shadow-xl dark:bg-slate-900 dark:border-slate-800 max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Shield className="size-5 text-[#35877D]" />
                            {editingRole ? `Configure Permissions for '${editingRole.name}'` : "Create New Platform Role"}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Select granular module permissions assigned to administrators with this role.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={editingRole ? handleUpdateRole : handleCreateRole} className="flex flex-col flex-1 overflow-hidden space-y-4 mt-2">
                        {!editingRole && (
                            <Input
                                label="Role Name"
                                placeholder="e.g. Technical Support Admin"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                required
                            />
                        )}

                        <div className="flex items-center justify-between py-1 border-b border-slate-100 text-xs">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                Selected Permissions ({selectedPermissions.length})
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-[#35877D]"
                                    onClick={() => setSelectedPermissions(permissionGroups.flatMap(g => g.permissions.map(p => p.name)))}
                                >
                                    Select All
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-slate-500"
                                    onClick={() => setSelectedPermissions([])}
                                >
                                    Clear All
                                </Button>
                            </div>
                        </div>

                        {/* Permission Groups */}
                        <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[360px]">
                            {permissionGroups.map((group) => {
                                const groupPermNames = group.permissions.map((p) => p.name);
                                const allSelected = groupPermNames.every((p) => selectedPermissions.includes(p));

                                return (
                                    <Card key={group.module_key} className="p-3.5 border-slate-200 bg-slate-50/50 rounded-xl dark:bg-slate-800/40 dark:border-slate-800">
                                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60 dark:border-slate-700">
                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                                                {group.module_title}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-[11px] text-slate-500 hover:text-slate-800"
                                                onClick={() => toggleGroupPermissions(group)}
                                            >
                                                {allSelected ? "Deselect Group" : "Select Group"}
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            {group.permissions.map((perm) => {
                                                const isChecked = selectedPermissions.includes(perm.name);
                                                return (
                                                    <label
                                                        key={perm.id}
                                                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-colors"
                                                    >
                                                        <Checkbox
                                                            checked={isChecked}
                                                            onCheckedChange={() => togglePermission(perm.name)}
                                                        />
                                                        <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate">
                                                            {perm.name}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>

                        <DialogFooter className="pt-3 border-t border-slate-100 dark:border-slate-800">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => { setIsCreateModalOpen(false); setEditingRole(null); }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" loading={submitting}>
                                {editingRole ? "Save Permissions" : "Create Role"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Confirm Role Deletion */}
            <ConfirmDialog
                open={!!deletingRoleId}
                onOpenChange={(open) => !open && setDeletingRoleId(null)}
                title="Delete Custom Role?"
                description="Are you sure you want to delete this custom role? This action cannot be undone."
                confirmText="Delete Role"
                variant="destructive"
                onConfirm={confirmDeleteRole}
            />
        </div>
    );
}
