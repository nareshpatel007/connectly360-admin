"use client";

import { useGetCustomer, useGetCustomerConversations } from "@workspace/api-client-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Phone, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const customerId = id ? parseInt(id, 10) : 0;
  
  const { data: customer, isLoading: isLoadingCustomer } = useGetCustomer(customerId, {
    query: { queryKey: ["getCustomer", customerId], enabled: !!customerId }
  });
  
  const { data: conversations, isLoading: isLoadingConversations } = useGetCustomerConversations(customerId, {
    query: { queryKey: ["getCustomerConversations", customerId], enabled: !!customerId }
  });

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div>
        <Link href="/customers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to customers
        </Link>
        
        {isLoadingCustomer ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-48" />
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{customer?.name || customer?.phone}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1.5 text-sm">
                  <Phone className="h-4 w-4" />
                  {customer?.phone}
                </div>
                {customer?.city && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="h-4 w-4" />
                    {customer.city}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm">
                  <Calendar className="h-4 w-4" />
                  Added {customer?.createdAt ? new Date(customer.createdAt).toLocaleDateString() : ''}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardHeader className="py-4 border-b border-border bg-muted/20">
          <CardTitle className="text-base font-medium">Conversation History</CardTitle>
        </CardHeader>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {isLoadingConversations ? (
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <Skeleton className="h-20 w-[60%] rounded-xl" />
                </div>
              ))}
            </div>
          ) : conversations?.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <p>No messages in history</p>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {conversations?.map((conv) => {
                const isInbound = conv.direction === "inbound";
                return (
                  <div key={conv.id} className={`flex flex-col ${isInbound ? 'items-start' : 'items-end'}`}>
                    <div className="flex items-baseline gap-2 mb-1 px-1">
                      {isInbound && <span className="text-xs font-medium">{customer?.name || "Customer"}</span>}
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(conv.createdAt).toLocaleString('en-IN', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                      {!isInbound && <span className="text-xs font-medium">Auto-Reply</span>}
                    </div>
                    
                    <div className={`relative max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap break-words ${
                      isInbound 
                        ? 'bg-card border border-border text-foreground rounded-tl-sm' 
                        : 'bg-primary text-primary-foreground rounded-tr-sm shadow-sm'
                    }`}>
                      {conv.message}
                    </div>
                    
                    {conv.intent && isInbound && (
                      <div className="mt-1.5 ml-1">
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 bg-muted">
                          intent: {conv.intent}
                        </Badge>
                      </div>
                    )}
                  </div>
                );
              }).reverse()}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
