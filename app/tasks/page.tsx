"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    CheckSquare,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Building2,
    UserCheck,
    Clock,
    CheckCircle2,
    AlertCircle,
    Eye,
    Trash2,
    Calendar,
    MessageSquare,
    GitBranch,
    Edit3
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin-page-header";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";

interface AdminTask {
    id: number;
    tenant_id: number;
    tenant?: { id: number; company_name: string; email?: string };
    title: string;
    description?: string;
    status: string;
    priority: string;
    task_type: string;
    due_at?: string;
    created_at: string;
    assignee?: { id: number; name: string; email: string };
    creator?: { id: number; name: string; email: string };
    contact?: { id: number; name: string; phone: string };
    lead?: { id: number; customer_name: string; phone?: string };
}

interface SummaryMetrics {
    total: number;
    open: number;
    in_progress: number;
    completed: number;
    overdue: number;
}

export default function AdminTasksPage() {
    const { token } = useAuth();
    const [tasks, setTasks] = useState<AdminTask[]>([]);
    const [summary, setSummary] = useState<SummaryMetrics>({
        total: 0,
        open: 0,
        in_progress: 0,
        completed: 0,
        overdue: 0
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTasks, setTotalTasks] = useState(0);

    // Detail Modal
    const [inspectTask, setInspectTask] = useState<AdminTask | null>(null);

    const fetchTasks = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page: String(page),
                per_page: "15",
                ...(search && { search }),
                ...(statusFilter && { status: statusFilter }),
                ...(priorityFilter && { priority: priorityFilter })
            });

            const res = await fetch(`/api/admin/tasks?${query.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });
            const data = await res.json();
            if (data.status) {
                setTasks(data.data || []);
                if (data.pagination) {
                    setTotalPages(data.pagination.last_page || 1);
                    setTotalTasks(data.pagination.total || 0);
                }
            }
        } catch {
            toast.error("Failed to load tasks list");
        } finally {
            setLoading(false);
        }
    }, [token, page, search, statusFilter, priorityFilter]);

    const fetchSummary = useCallback(async () => {
        if (!token) return;
        try {
            const res = await fetch("/api/admin/tasks/summary", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });
            const data = await res.json();
            if (data.status && data.data) {
                setSummary(data.data);
            }
        } catch { }
    }, [token]);

    useEffect(() => {
        fetchTasks();
        fetchSummary();
    }, [fetchTasks, fetchSummary]);

    const handleDeleteTask = async (id: number) => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        try {
            const res = await fetch(`/api/admin/tasks/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Api-Token": token || ""
                }
            });
            const data = await res.json();
            if (data.status) {
                setTasks((prev) => prev.filter((t) => t.id !== id));
                if (inspectTask?.id === id) setInspectTask(null);
                toast.success("Task deleted by administrator");
                fetchSummary();
            } else {
                toast.error(data.message || "Failed to delete task");
            }
        } catch {
            toast.error("Network error deleting task");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <CheckSquare className="text-[#35877D]" size={24} />
                        Workspace Tasks & Follow-ups Monitoring
                    </h1>
                    <p className="text-xs md:text-sm text-slate-500 font-medium">
                        Monitor team action items, SLA adherence, and customer follow-up tasks across all client workspaces.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            fetchTasks();
                            fetchSummary();
                        }}
                        className="rounded-xl border-slate-200 text-slate-700 h-9 px-3 gap-1.5 font-bold text-xs"
                    >
                        <RefreshCw size={13} className={loading ? "animate-spin text-[#35877D]" : ""} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Total Tasks</span>
                    <p className="text-2xl font-black text-slate-900">{summary.total}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Open</span>
                    <p className="text-2xl font-black text-[#35877D]">{summary.open}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold uppercase text-slate-400">In Progress</span>
                    <p className="text-2xl font-black text-amber-600">{summary.in_progress}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Overdue</span>
                    <p className="text-2xl font-black text-rose-600">{summary.overdue}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Completed</span>
                    <p className="text-2xl font-black text-emerald-600">{summary.completed}</p>
                </div>
            </div>

            {/* Filter Toolbar */}
            <Card className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search by title, workspace, or assignee..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="pl-9 h-9 rounded-xl border-slate-200 text-xs font-semibold"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            className="h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#35877D]"
                        >
                            <option value="">All Statuses</option>
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) => {
                                setPriorityFilter(e.target.value);
                                setPage(1);
                            }}
                            className="h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#35877D]"
                        >
                            <option value="">All Priorities</option>
                            <option value="urgent">Urgent</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Tasks Table */}
            <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 text-[11px] font-black uppercase tracking-wider">
                                <th className="py-3 px-4">Task</th>
                                <th className="py-3 px-4">Workspace</th>
                                <th className="py-3 px-4">Assignee</th>
                                <th className="py-3 px-4">Related</th>
                                <th className="py-3 px-4">Priority</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Due Date</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-slate-400">
                                        <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-[#35877D]" />
                                        Loading tasks...
                                    </td>
                                </tr>
                            ) : tasks.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-slate-400">
                                        No tasks found matching current filters.
                                    </td>
                                </tr>
                            ) : (
                                tasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="space-y-0.5 max-w-xs">
                                                <p className="font-bold text-slate-900 truncate">{task.title}</p>
                                                {task.description && (
                                                    <p className="text-[11px] text-slate-400 truncate">{task.description}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="flex items-center gap-1 font-semibold text-slate-800">
                                                <Building2 size={12} className="text-[#35877D]" />
                                                {task.tenant?.company_name || `Tenant #${task.tenant_id}`}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="flex items-center gap-1">
                                                <UserCheck size={12} className="text-slate-400" />
                                                {task.assignee?.name || "Unassigned"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {task.contact ? (
                                                <span className="flex items-center gap-1 text-slate-600 font-semibold truncate max-w-[140px]">
                                                    <MessageSquare size={11} className="text-[#35877D]" />
                                                    {task.contact.name}
                                                </span>
                                            ) : task.lead ? (
                                                <span className="flex items-center gap-1 text-purple-700 font-semibold truncate max-w-[140px]">
                                                    <GitBranch size={11} />
                                                    {task.lead.customer_name}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${task.priority === "urgent" || task.priority === "high"
                                                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                                                    : task.priority === "medium"
                                                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                                                        : "bg-slate-100 text-slate-600"
                                                    }`}
                                            >
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize ${task.status === "completed"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : task.status === "in_progress"
                                                        ? "bg-amber-50 text-amber-700"
                                                        : "bg-teal-50 text-[#35877D]"
                                                    }`}
                                            >
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="flex items-center gap-1 text-slate-500 font-mono text-[11px]">
                                                <Clock size={11} />
                                                {task.due_at ? new Date(task.due_at).toLocaleDateString() : "-"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => setInspectTask(task)}
                                                    className="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                                                    title="Inspect Task"
                                                >
                                                    <Eye size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="h-7 w-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center cursor-pointer"
                                                    title="Delete Task"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>
                        Showing {tasks.length} of {totalTasks} tasks
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="rounded-xl border-slate-200 h-8 text-xs font-bold"
                        >
                            <ChevronLeft size={13} />
                            Previous
                        </Button>
                        <span className="px-2 font-bold text-slate-700">
                            {page} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className="rounded-xl border-slate-200 h-8 text-xs font-bold"
                        >
                            Next
                            <ChevronRight size={13} />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Inspect Detail Modal */}
            <Dialog open={!!inspectTask} onOpenChange={(open) => !open && setInspectTask(null)}>
                <DialogContent className="sm:max-w-lg rounded-2xl p-6 bg-white border border-slate-200">
                    <DialogHeader className="border-b border-slate-100 pb-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-[#35877D] px-2 py-0.5 rounded bg-teal-50 border border-teal-100">
                                {inspectTask?.tenant?.company_name || `Workspace #${inspectTask?.tenant_id}`}
                            </span>
                            <span className="text-[10px] font-black uppercase text-slate-400">
                                #{inspectTask?.id}
                            </span>
                        </div>
                        <DialogTitle className="text-base font-bold text-slate-900 pt-2">
                            {inspectTask?.title}
                        </DialogTitle>
                    </DialogHeader>

                    {inspectTask && (
                        <div className="space-y-3 py-2 text-xs">
                            {inspectTask.description && (
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-slate-700 font-medium leading-relaxed">{inspectTask.description}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100 space-y-0.5">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Assignee</span>
                                    <p className="font-bold text-slate-800">{inspectTask.assignee?.name || "Unassigned"}</p>
                                </div>
                                <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100 space-y-0.5">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Due Date</span>
                                    <p className="font-bold text-slate-800">
                                        {inspectTask.due_at ? new Date(inspectTask.due_at).toLocaleString() : "No deadline"}
                                    </p>
                                </div>
                            </div>

                            {inspectTask.contact && (
                                <div className="p-2.5 bg-teal-50/50 rounded-xl border border-teal-100 space-y-0.5">
                                    <span className="text-[10px] uppercase font-bold text-[#35877D]">Linked Contact</span>
                                    <p className="font-bold text-slate-900">{inspectTask.contact.name}</p>
                                    <p className="text-[11px] text-slate-500 font-mono">{inspectTask.contact.phone}</p>
                                </div>
                            )}

                            {inspectTask.lead && (
                                <div className="p-2.5 bg-purple-50/50 rounded-xl border border-purple-100 space-y-0.5">
                                    <span className="text-[10px] uppercase font-bold text-purple-700">Linked Lead</span>
                                    <p className="font-bold text-slate-900">{inspectTask.lead.customer_name}</p>
                                </div>
                            )}

                            <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                                <span>Created: {new Date(inspectTask.created_at).toLocaleString()}</span>
                                <span>Status: {inspectTask.status}</span>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="pt-2 border-t border-slate-100 flex justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setInspectTask(null)}
                            className="rounded-xl border-slate-200 text-slate-700 font-bold text-xs h-9 px-4"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
