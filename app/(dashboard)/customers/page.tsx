"use client";

import { useListCustomers, useCreateCustomer } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Phone, MessageCircle, Plus, Loader2 } from "lucide-react";
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">Manage your contact database and view interactions.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contacts..."
              className="pl-9 bg-card"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl shadow-sm flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Contact</DialogTitle>
                <DialogDescription>
                  Add a contact manually to your database and optionally send them a first message.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateContact} className="space-y-4 py-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 919876543210"
                    required
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Include country code without + or spaces (e.g. 919876543210 for India).
                  </p>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="firstMessage">First Message (Optional)</Label>
                  <Textarea
                    id="firstMessage"
                    value={firstMessage}
                    onChange={(e) => setFirstMessage(e.target.value)}
                    placeholder="Type a message to start conversation immediately..."
                    className="min-h-[80px]"
                  />
                </div>
                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    disabled={createCustomerMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#35877D] hover:bg-[#2c6f66] text-white flex items-center gap-1.5"
                    disabled={createCustomerMutation.isPending}
                  >
                    {createCustomerMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
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

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Messages</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-8 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : customers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No contacts found.
                  </TableCell>
                </TableRow>
              ) : (
                customers?.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.name || <span className="text-muted-foreground italic">Unknown</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        {customer.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {customer.city || "-"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5 font-medium">
                        <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
                        {customer.messageCount || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/customer/inbox/${customer.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
