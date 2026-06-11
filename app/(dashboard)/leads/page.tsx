"use client";

import { useState } from "react";
import { useListLeads, useUpdateLead, getListLeadsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  converted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  lost: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const STATUSES = ["all", "new", "contacted", "converted", "lost"] as const;

export default function LeadsPage() {
  const [filter, setFilter] = useState<string>("all");
  const queryClient = useQueryClient();
  const { data: leads, isLoading } = useListLeads(
    filter === "all" ? {} : { status: filter }
  );
  const updateLead = useUpdateLead();

  function handleStatusChange(id: number, status: string) {
    updateLead.mutate(
      { id, data: { status: status as "new" | "contacted" | "converted" | "lost" } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListLeadsQueryKey() });
        },
      }
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <p className="text-muted-foreground">Track and manage bulk order inquiries and dealer requests.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lead Pipeline</CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40" data-testid="select-lead-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !leads?.length ? (
            <div className="text-center py-12 text-muted-foreground">
              No leads found{filter !== "all" ? ` with status "${filter}"` : ""}.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id} data-testid={`row-lead-${lead.id}`}>
                    <TableCell className="font-medium">
                      {lead.customerName ?? <span className="text-muted-foreground italic">Unknown</span>}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{lead.phone}</TableCell>
                    <TableCell>{lead.quantity ?? "—"}</TableCell>
                    <TableCell>{lead.location ?? "—"}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[lead.status] ?? ""} variant="outline">
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={lead.status}
                        onValueChange={(val) => handleStatusChange(lead.id, val)}
                      >
                        <SelectTrigger className="h-8 w-32 text-xs" data-testid={`select-lead-status-${lead.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
