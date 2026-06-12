"use client";

import { useListConversations } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, User, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";

export default function ConversationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: conversations, isLoading } = useListConversations();

  const filteredConversations = conversations?.filter(c => 
    c.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.customerPhone?.includes(searchTerm) ||
    c.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
          <p className="text-muted-foreground">All inbound and outbound WhatsApp messages.</p>
        </div>
      </div>

      <div className="relative shrink-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, phone, or message..."
          className="pl-9 bg-card"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col">
        <div className="overflow-auto p-0 flex-1">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : filteredConversations?.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mb-4 text-muted" />
              <p className="text-lg font-medium">No conversations found</p>
              <p className="text-sm">Try adjusting your search</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredConversations?.map((conv) => (
                <div key={conv.id} className="p-4 hover:bg-muted/50 transition-colors flex gap-4">
                  <div className="shrink-0 pt-1">
                    <div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Link href={`/customers/${conv.customerId}`} className="font-medium hover:underline truncate">
                          {conv.customerName || conv.customerPhone}
                        </Link>
                        <Badge variant={conv.direction === "inbound" ? "secondary" : "outline"} className="text-[10px] uppercase h-5">
                          {conv.direction}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {new Date(conv.createdAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">
                      {conv.message}
                    </p>
                    {conv.intent && (
                      <div className="mt-2 flex">
                        <IntentBadge intent={conv.intent} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function IntentBadge({ intent }: { intent: string }) {
  const intentColors: Record<string, string> = {
    price: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    delivery: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    dealer: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    order: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    'ai-fallback': "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
  };
  
  const colorClass = intentColors[intent] || "bg-secondary text-secondary-foreground";
  
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${colorClass}`}>
      {intent}
    </span>
  );
}
