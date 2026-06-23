"use client";

import { useState, useEffect } from "react";
import type { Lead } from "@/lib/api-client-react";
import { useCreateLead, useUpdateLead, useDeleteLead } from "@/lib/api-client-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface DealFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lead?: Lead | null;
    defaultStatus?: string;
    onSaved: () => void;
}

type CustomAttrRow = {
    key: string;
    value: string;
};

export function DealForm({
    open,
    onOpenChange,
    lead,
    defaultStatus,
    onSaved,
}: DealFormProps) {
    const createLeadMutation = useCreateLead();
    const updateLeadMutation = useUpdateLead();
    const deleteLeadMutation = useDeleteLead();

    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState<"new" | "contacted" | "converted" | "lost">("new");
    const [customAttributes, setCustomAttributes] = useState<CustomAttrRow[]>([]);

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (!open) return;
        setConfirmDelete(false);
        if (lead) {
            setCustomerName(lead.customerName || "");
            setPhone(lead.phone || "");
            setLocation(lead.location || "");
            setStatus((lead.status || "new") as any);
            
            if (lead.custom_attributes) {
                setCustomAttributes(
                    Object.entries(lead.custom_attributes).map(([k, v]) => ({
                        key: k,
                        value: v || "",
                    }))
                );
            } else {
                setCustomAttributes([]);
            }
        } else {
            setCustomerName("");
            setPhone("");
            setLocation("");
            setStatus((defaultStatus || "new") as any);
            setCustomAttributes([]);
        }
    }, [open, lead, defaultStatus]);

    const handleAddAttrRow = () => {
        setCustomAttributes([...customAttributes, { key: "", value: "" }]);
    };

    const handleRemoveAttrRow = (index: number) => {
        setCustomAttributes(customAttributes.filter((_, i) => i !== index));
    };

    const handleAttrChange = (index: number, field: "key" | "value", val: string) => {
        const copy = [...customAttributes];
        copy[index][field] = val;
        setCustomAttributes(copy);
    };

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!phone.trim()) {
            toast.error("Phone number is required");
            return;
        }
        setSaving(true);

        const attrsObj: Record<string, string> = {};
        for (const row of customAttributes) {
            if (row.key.trim()) {
                attrsObj[row.key.trim()] = row.value.trim();
            }
        }

        const payload = {
            customerName: customerName.trim(),
            phone: phone.trim(),
            location: location.trim(),
            status,
            custom_attributes: attrsObj,
        };

        try {
            if (lead) {
                await updateLeadMutation.mutateAsync({ id: lead.id, data: payload });
                toast.success("Lead updated successfully");
            } else {
                await createLeadMutation.mutateAsync({ data: payload });
                toast.success("Lead created successfully");
            }
            onSaved();
            onOpenChange(false);
        } catch (err: any) {
            toast.error(err.message || "Failed to save lead");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!lead) return;
        setDeleting(true);
        try {
            await deleteLeadMutation.mutateAsync({ id: lead.id });
            toast.success("Lead deleted successfully");
            onSaved();
            onOpenChange(false);
        } catch (err: any) {
            toast.error(err.message || "Failed to delete lead");
        } finally {
            setDeleting(false);
            setConfirmDelete(false);
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="bg-white border-l border-slate-200 text-slate-900 sm:max-w-md w-full p-0 flex flex-col h-full"
            >
                <SheetHeader className="border-b border-slate-100 p-5">
                    <SheetTitle className="text-slate-900 font-extrabold text-lg">
                        {lead ? "Edit Lead Details" : "Create New Lead"}
                    </SheetTitle>
                </SheetHeader>

                <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="customerName" className="text-xs font-bold text-slate-700">Lead Name / Customer</Label>
                            <Input
                                id="customerName"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="e.g. John Doe"
                                className="border-slate-200 bg-slate-50 focus-visible:ring-[#35877D] focus-visible:border-[#35877D] text-slate-800 font-semibold"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="phone" className="text-xs font-bold text-slate-700">Phone Number *</Label>
                            <Input
                                id="phone"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="e.g. 919876543210"
                                className="border-slate-200 bg-slate-50 focus-visible:ring-[#35877D] focus-visible:border-[#35877D] text-slate-800 font-semibold"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="location" className="text-xs font-bold text-slate-700">Location</Label>
                            <Input
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. Mumbai"
                                className="border-slate-200 bg-slate-50 focus-visible:ring-[#35877D] focus-visible:border-[#35877D] text-slate-800 font-semibold"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="status" className="text-xs font-bold text-slate-700">Pipeline Status</Label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                                className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#35877D] focus:border-[#35877D]"
                            >
                                <option value="new">New Lead</option>
                                <option value="contacted">Contacted</option>
                                <option value="converted">Converted</option>
                                <option value="lost">Lost</option>
                            </select>
                        </div>

                        {/* Custom Attributes Management */}
                        <div className="space-y-2.5 pt-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-bold text-slate-700">Custom Attributes</Label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleAddAttrRow}
                                    className="h-7 px-2 text-[#35877D] hover:text-[#2c6f66] hover:bg-[#35877D]/5 font-bold gap-1 rounded-lg"
                                >
                                    <Plus size={13} />
                                    Add Attribute
                                </Button>
                            </div>

                            {customAttributes.length === 0 ? (
                                <p className="text-[11px] text-slate-400 font-medium italic">No custom attributes added yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {customAttributes.map((row, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <Input
                                                placeholder="Label / Key"
                                                value={row.key}
                                                onChange={(e) => handleAttrChange(idx, "key", e.target.value)}
                                                className="flex-1 h-9 border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus-visible:ring-[#35877D]"
                                            />
                                            <Input
                                                placeholder="Value"
                                                value={row.value}
                                                onChange={(e) => handleAttrChange(idx, "value", e.target.value)}
                                                className="flex-1 h-9 border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus-visible:ring-[#35877D]"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveAttrRow(idx)}
                                                className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 shrink-0 rounded-lg"
                                            >
                                                <X size={15} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-slate-100 bg-slate-50/80 p-5 space-y-3">
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="flex-1 border-slate-250 bg-white text-slate-700 hover:bg-slate-100 font-bold"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-[#35877D] hover:bg-[#2c6f66] text-white font-bold"
                            >
                                {saving ? "Saving..." : lead ? "Save Changes" : "Create Lead"}
                            </Button>
                        </div>

                        {lead && (
                            confirmDelete ? (
                                <div className="flex items-center justify-between gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs">
                                    <span className="text-red-700 font-semibold">Delete this lead permanently?</span>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setConfirmDelete(false)}
                                            className="text-slate-500 font-bold hover:underline"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            disabled={deleting}
                                            className="text-red-650 font-bold hover:underline"
                                        >
                                            {deleting ? "Deleting..." : "Confirm"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setConfirmDelete(true)}
                                    className="flex w-full items-center justify-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-bold pt-1"
                                >
                                    <Trash2 size={13} />
                                    Delete Lead
                                </button>
                            )
                        )}
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
