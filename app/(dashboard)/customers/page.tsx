"use client";

import { useListCustomers, useCreateCustomer, Customer } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Search,
    MapPin,
    Phone,
    MessageCircle,
    Plus,
    Loader2,
    PlayCircle,
    SlidersHorizontal,
    Upload,
    Download,
    Trash2,
    Edit2,
    ShieldCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export default function CustomersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { data: customers, isLoading } = useListCustomers({ search: searchTerm });
    const createCustomerMutation = useCreateCustomer();
    const queryClient = useQueryClient();

    // Dialog & Form States
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [firstMessage, setFirstMessage] = useState("");

    // New States for Redesigned UI
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [sortBy, setSortBy] = useState("last_updated");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    // Filter & Sort customers
    const filteredCustomers = (customers?.filter(customer =>
        (customer.name || "WhatsApp User").toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.city || "").toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === "name") {
            return (a.name || "WhatsApp User").localeCompare(b.name || "WhatsApp User");
        } else if (sortBy === "phone") {
            return a.phone.localeCompare(b.phone);
        }
        // Default: Sort by last updated/created (id desc/created_at desc)
        return b.id - a.id;
    })) || [];

    const handleCreateContact = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone.trim()) {
            toast.error("Phone number is required");
            return;
        }

        try {
            await createCustomerMutation.mutateAsync({
                data: {
                    name: name.trim() || "WhatsApp User",
                    phone: phone.trim(),
                    city: city.trim() || undefined,
                    firstMessage: firstMessage.trim() || undefined,
                },
            });

            toast.success("Contact created successfully");
            queryClient.invalidateQueries({ queryKey: ["listCustomers"] });

            // Reset form and close dialog
            setName("");
            setPhone("");
            setCity("");
            setFirstMessage("");
            setIsOpen(false);
        } catch (err: any) {
            toast.error(err.message || "Failed to create contact");
        }
    };

    // Checkbox selection handlers
    const handleSelectAll = (checked: boolean) => {
        if (checked && filteredCustomers) {
            setSelectedIds(filteredCustomers.map(c => c.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(item => item !== id));
        }
    };

    // WhatsApp SVG Icon
    const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
            <path d="M12.004 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.89 5.83L2.06 22l4.31-1.13c1.62.88 3.48 1.39 5.47 1.39 5.52 0 10-4.48 10-10S17.52 2 12.004 2zm5.73 13.91c-.24.68-1.24 1.25-1.91 1.33-.57.07-1.3.1-3.69-.89-3.06-1.27-5.01-4.36-5.16-4.57-.15-.2-.17-.26-.17-.46s.1-.37.2-.56c.1-.19.2-.24.3-.39.1-.15.15-.24.22-.39.07-.15.03-.29-.02-.39s-.49-1.2-.67-1.63c-.17-.43-.35-.37-.48-.38l-.41-.01c-.15 0-.39.06-.59.28-.2.22-.78.76-.78 1.85 0 1.09.8 2.14.91 2.29.11.15 1.57 2.4 3.8 3.36 1.86.8 2.48.64 2.87.6.86-.09 1.91-.78 2.18-1.5.27-.72.27-1.34.19-1.47-.08-.13-.29-.21-.61-.37s-1.89-.93-2.18-1.04-.51-.16-.72.16c-.21.32-.82 1.04-1.01 1.25-.19.21-.38.24-.7.08-.32-.16-1.35-.5-2.58-1.59-.95-.85-1.6-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.19.22-.32.32-.53.1-.21.05-.4-.02-.56s-.67-1.63-.92-2.24c-.24-.6-.49-.52-.67-.53-.18-.01-.39-.01-.6-.01z" />
        </svg>
    );

    // Phone Flag Helper
    const formatPhoneNumber = (phone: string) => {
        const cleaned = phone.replace(/\D/g, "");
        if (cleaned.startsWith("91")) {
            return {
                flag: "🇮🇳",
                display: `(+91) ${cleaned.substring(2)}`
            };
        }
        return {
            flag: "📞",
            display: phone
        };
    };

    // Mock utility handlers
    const handleExport = () => {
        toast.success(`Exported ${filteredCustomers?.length ?? 0} contacts successfully to CSV.`);
    };

    const handleImport = () => {
        toast.info("Import contacts CSV selector opened.");
    };

    const handleBulkDelete = () => {
        if (confirm(`Are you sure you want to delete ${selectedIds.length} selected contacts?`)) {
            toast.success(`Deleted ${selectedIds.length} contacts successfully.`);
            setSelectedIds([]);
        }
    };

    const handleDeleteClick = (id: number) => {
        if (confirm("Are you sure you want to delete this contact?")) {
            toast.success("Contact deleted successfully.");
        }
    };

    const openEditDialog = (customer: Customer) => {
        setSelectedCustomer(customer);
        setName(customer.name || "");
        setPhone(customer.phone);
        setCity(customer.city || "");
        setIsEditOpen(true);
    };

    const handleEditContact = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Contact details updated successfully.");
        setIsEditOpen(false);
        setSelectedCustomer(null);
        setName("");
        setPhone("");
        setCity("");
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
                        Contacts
                        <span className="text-xl font-normal text-slate-500">
                            ({filteredCustomers?.length ?? 0})
                        </span>
                    </h1>
                    <p className="text-slate-600 text-sm mt-1">
                        Contact list stores the list of numbers that you've interacted with. You can even manually export or import contacts.
                    </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#378179] hover:bg-[#2c6761] text-white text-xs h-9 px-4 rounded-xl flex items-center gap-1.5 border-0 font-medium cursor-pointer">
                                <Plus size={14} />
                                Add New
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-2xl overflow-hidden p-0 border border-slate-100 shadow-xl bg-white">
                            <div className="bg-[#378179]/5 border-b border-[#378179]/10 px-6 py-4 flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-full bg-[#378179]/10 flex items-center justify-center">
                                    <Plus size={16} className="text-[#378179]" />
                                </div>
                                <div>
                                    <DialogTitle className="text-base font-bold text-slate-800">Create New Contact</DialogTitle>
                                    <DialogDescription className="text-slate-600 text-xs mt-0.5">
                                        Add a contact manually to your database.
                                    </DialogDescription>
                                </div>
                            </div>
                            <form onSubmit={handleCreateContact} className="p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-xs font-semibold text-slate-700">Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. John Doe"
                                        className="text-xs text-slate-700 h-9"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                                        Phone Number <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="e.g. 919876543210"
                                        className="text-xs text-slate-700 h-9"
                                        required
                                    />
                                    <p className="text-[10px] text-slate-505">
                                        Include country code without + or spaces (e.g. 919876543210).
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="city" className="text-xs font-semibold text-slate-700">City</Label>
                                    <Input
                                        id="city"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="e.g. Mumbai"
                                        className="text-xs text-slate-700 h-9"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="firstMessage" className="text-xs font-semibold text-slate-700">First Message (Optional)</Label>
                                    <Textarea
                                        id="firstMessage"
                                        value={firstMessage}
                                        onChange={(e) => setFirstMessage(e.target.value)}
                                        placeholder="Type a message to start conversation immediately..."
                                        className="min-h-[80px] text-xs text-slate-700 leading-relaxed resize-none"
                                    />
                                </div>
                                <DialogFooter className="pt-2 flex justify-end gap-2.5">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsOpen(false)}
                                        disabled={createCustomerMutation.isPending}
                                        className="text-xs rounded-xl h-9 px-4 font-semibold cursor-pointer"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-[#378179] hover:bg-[#2c6761] text-white text-xs rounded-xl h-9 px-5 font-semibold border-0 cursor-pointer"
                                        disabled={createCustomerMutation.isPending}
                                    >
                                        {createCustomerMutation.isPending ? (
                                            <span className="flex items-center gap-1.5">
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                Creating...
                                            </span>
                                        ) : (
                                            "Create Contact"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Filter and Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <span>Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="h-9 px-2 border border-slate-200 bg-white rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#378179] cursor-pointer"
                        >
                            <option value="last_updated">Last Updated</option>
                            <option value="name">Name</option>
                            <option value="phone">Phone Number</option>
                        </select>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Input
                            type="search"
                            placeholder="Search contacts"
                            className="pr-9 h-9 text-xs text-slate-600 bg-white border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#378179]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    </div>

                    <button
                        onClick={() => toast.info("Filter configurations are active")}
                        className="h-9 w-9 bg-[#378179] hover:bg-[#2c6761] text-white flex items-center justify-center rounded-lg transition-colors border-0 cursor-pointer"
                    >
                        <SlidersHorizontal size={14} />
                    </button>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        className="border-slate-200 text-slate-700 text-xs h-9 px-3 rounded-lg flex items-center gap-1.5 bg-white font-medium hover:bg-slate-50 cursor-pointer"
                    >
                        <Upload size={13} />
                        Export
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleImport}
                        className="border-slate-200 text-slate-700 text-xs h-9 px-3 rounded-lg flex items-center gap-1.5 bg-white font-medium hover:bg-slate-50 cursor-pointer"
                    >
                        <Download size={13} />
                        Import
                    </Button>
                    <button
                        onClick={handleBulkDelete}
                        disabled={selectedIds.length === 0}
                        className={`h-9 w-9 border flex items-center justify-center rounded-lg transition-colors bg-white cursor-pointer ${selectedIds.length > 0
                            ? "border-red-205 text-red-500 hover:bg-red-50/50"
                            : "border-slate-200 text-slate-400 opacity-60 cursor-not-allowed"
                            }`}
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <Card className="border border-[#EAE6DF] bg-white shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                <TableHead className="w-[50px] pl-6 py-3">
                                    <Checkbox
                                        checked={filteredCustomers?.length > 0 && selectedIds.length === filteredCustomers.length}
                                        onCheckedChange={handleSelectAll}
                                        className="h-4 w-4 rounded border-slate-300 text-[#378179] focus:ring-[#378179]"
                                    />
                                </TableHead>
                                <TableHead className="font-semibold text-slate-700 text-xs">Basic info</TableHead>
                                <TableHead className="font-semibold text-slate-700 text-xs">Phone number</TableHead>
                                <TableHead className="font-semibold text-slate-700 text-xs">Source</TableHead>
                                <TableHead className="font-semibold text-slate-700 text-xs">Stage</TableHead>
                                <TableHead className="font-semibold text-slate-700 text-xs">Contact Attributes</TableHead>
                                <TableHead className="w-[100px] text-right font-semibold text-slate-700 text-xs pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="pl-6"><Skeleton className="h-4 w-4 bg-slate-100" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-32 bg-slate-100" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24 bg-slate-100" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-12 bg-slate-100" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-48 bg-slate-100" /></TableCell>
                                        <TableCell className="text-right pr-6"><Skeleton className="h-8 w-16 ml-auto bg-slate-100" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredCustomers?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-slate-500 text-xs pl-6 pr-6">
                                        No contacts found. Click "+ Add New" to manually create a contact.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCustomers?.map((customer) => {
                                    const { flag, display } = formatPhoneNumber(customer.phone);
                                    const isSelected = selectedIds.includes(customer.id);
                                    return (
                                        <TableRow key={customer.id} className="hover:bg-slate-50/40 text-slate-650">
                                            <TableCell className="pl-6 py-3">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={(checked) => handleSelect(customer.id, !!checked)}
                                                    className="h-4 w-4 rounded border-slate-300 text-[#378179] focus:ring-[#378179]"
                                                />
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div className="flex flex-col">
                                                    <Link
                                                        href={`/customers/inbox/${customer.id}`}
                                                        className="text-slate-700 hover:text-blue-800 hover:underline font-semibold text-xs transition-colors"
                                                    >
                                                        {customer.name || "WhatsApp User"}
                                                    </Link>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3 text-slate-700 text-xs font-semibold">
                                                <span className="flex items-center">
                                                    {display}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <span className="text-xs font-semibold border border-slate-200 text-slate-600 px-2 py-0.5 bg-slate-50 rounded-md">
                                                    Connectly360
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <span className="text-xs font-semibold border border-[#378179]/50 text-slate-700 bg-[#378179]/20 px-2 py-0.5 rounded-md">
                                                    New Lead
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                                    <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded font-medium border border-slate-200">
                                                        lead_stage: New Lead
                                                    </span>
                                                    <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded font-medium border border-slate-200 max-w-[120px] truncate">
                                                        contact_owner: {customer.name ? customer.name.split(" ")[0] : "Admin"}
                                                    </span>
                                                    <button
                                                        onClick={() => toast.info(`Attributes for ${customer.name || 'User'}: lead_stage=New Lead, contact_owner=Admin`)}
                                                        className="text-blue-600 hover:text-blue-800 font-semibold hover:underline bg-transparent border-0 cursor-pointer ml-1 text-xs"
                                                    >
                                                        Show all attributes
                                                    </button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3 text-right pr-6">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditDialog(customer)}
                                                        className="h-8 w-8 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                                                    >
                                                        <Edit2 size={13} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteClick(customer.id)}
                                                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                                                    >
                                                        <Trash2 size={13} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                    <span>Rows per page:</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        className="h-8 px-2 border border-slate-200 bg-white rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#378179] cursor-pointer"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>
                <div className="flex items-center gap-4">
                    <span>
                        1-{filteredCustomers?.length || 0} of {filteredCustomers?.length || 0}
                    </span>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            disabled
                            className="h-8 px-3 text-xs font-semibold rounded-lg border-slate-200 bg-white text-slate-400 opacity-60 cursor-not-allowed"
                        >
                            &lt; Previous
                        </Button>
                        <Button
                            variant="outline"
                            disabled
                            className="h-8 px-3 text-xs font-semibold rounded-lg border-slate-200 bg-white text-slate-400 opacity-60 cursor-not-allowed"
                        >
                            Next &gt;
                        </Button>
                    </div>
                </div>
            </div>

            {/* EDIT CONTACT DIALOG */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl overflow-hidden p-0 border border-slate-100 shadow-xl bg-white">
                    <div className="bg-[#378179]/5 border-b border-[#378179]/10 px-6 py-4 flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-[#378179]/10 flex items-center justify-center">
                            <Edit2 size={15} className="text-[#378179]" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold text-slate-800">Edit Contact</DialogTitle>
                            <DialogDescription className="text-slate-600 text-xs mt-0.5">
                                Modify contact parameters and save changes.
                            </DialogDescription>
                        </div>
                    </div>
                    <form onSubmit={handleEditContact} className="p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="editName" className="text-xs font-semibold text-slate-700">Name</Label>
                            <Input
                                id="editName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. John Doe"
                                className="text-xs text-slate-700 h-9"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="editPhone" className="text-xs font-semibold text-slate-700">
                                Phone Number <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="editPhone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="e.g. 919876543210"
                                className="text-xs text-slate-700 h-9"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="editCity" className="text-xs font-semibold text-slate-700">City</Label>
                            <Input
                                id="editCity"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g. Mumbai"
                                className="text-xs text-slate-700 h-9"
                            />
                        </div>
                        <DialogFooter className="pt-2 flex justify-end gap-2.5">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsEditOpen(false);
                                    setSelectedCustomer(null);
                                }}
                                className="text-xs rounded-xl h-9 px-4 font-semibold cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#378179] hover:bg-[#2c6761] text-white text-xs rounded-xl h-9 px-5 font-semibold border-0 cursor-pointer"
                            >
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );
}
