import { useQuery, useMutation, UseQueryOptions } from "@tanstack/react-query";

// Base API URL
const API_BASE = "/api";

async function apiFetch(url: string, options: RequestInit = {}) {
    const headers = {
        ...options.headers,
    } as Record<string, string>;

    if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    return fetch(url, {
        ...options,
        headers,
    });
}

// -------------------------------------------------------------
// Type Definitions
// -------------------------------------------------------------

export interface AnalyticsSummary {
    totalCustomers: number;
    newCustomersToday: number;
    totalLeads: number;
    newLeadsToday: number;
    totalMessages: number;
    totalInbound: number;
    totalOutbound: number;
}

export interface Conversation {
    id: number;
    customerId: number;
    customerName?: string;
    customerPhone: string;
    message: string;
    direction: "inbound" | "outbound";
    intent?: string;
    createdAt: string;
}

export interface MessageStat {
    period: string;
    count: number;
    inbound: number;
    outbound: number;
}

export interface Lead {
    id: number;
    customerName?: string;
    phone: string;
    quantity?: number;
    location?: string;
    status: "new" | "contacted" | "converted" | "lost";
    createdAt: string;
}

export interface WhatsappStatus {
    status: "connected" | "pending" | "failed" | "disconnected";
    displayName?: string;
    phoneNumber?: string;
    wabaId?: string;
    businessId?: string;
    connectedAt?: string;
}

export interface Customer {
    id: number;
    name?: string;
    phone: string;
    city?: string;
    messageCount: number;
    createdAt: string;
}

export interface Product {
    id: number;
    name: string;
    unit: string;
    price: number;
    active: boolean;
}

export interface Settings {
    companyName: string;
    contactNumber?: string;
    deliveryInformation?: string;
    businessHours?: string;
}

// -------------------------------------------------------------
// Helper Query Keys
// -------------------------------------------------------------

export const getGetWhatsappStatusQueryKey = () => ["getWhatsappStatus"];
export const getListProductsQueryKey = () => ["listProducts"];
export const getGetSettingsQueryKey = () => ["getSettings"];
export const getListLeadsQueryKey = () => ["listLeads"];

// -------------------------------------------------------------
// API Hooks
// -------------------------------------------------------------

// Analytics
export function useGetAnalyticsSummary() {
    return useQuery<AnalyticsSummary>({
        queryKey: ["analyticsSummary"],
        queryFn: async () => {
            const res = await apiFetch(`${API_BASE}/analytics/summary`);
            if (!res.ok) throw new Error("Failed to fetch analytics summary");
            return res.json();
        },
    });
}

export function useGetMessageStats(params: { period: "daily" | "monthly" }, options?: any) {
    return useQuery<MessageStat[]>({
        queryKey: ["messageStats", params.period],
        queryFn: async () => {
            const res = await apiFetch(`${API_BASE}/analytics/messages?period=${params.period}`);
            if (!res.ok) throw new Error("Failed to fetch message stats");
            return res.json();
        },
        ...options?.query,
    });
}

export function useGetTopIntents() {
    return useQuery<{ intent: string; count: number }[]>({
        queryKey: ["topIntents"],
        queryFn: async () => {
            const res = await apiFetch(`${API_BASE}/analytics/intents`);
            if (!res.ok) throw new Error("Failed to fetch top intents");
            return res.json();
        },
    });
}

// Conversations
export function useListConversations(params?: { limit?: number }) {
    return useQuery<Conversation[]>({
        queryKey: ["listConversations", params?.limit],
        queryFn: async () => {
            const url = params?.limit ? `${API_BASE}/conversations?limit=${params.limit}` : `${API_BASE}/conversations`;
            const res = await apiFetch(url);
            if (!res.ok) throw new Error("Failed to fetch conversations");
            return res.json();
        },
    });
}

// Leads
export function useListLeads(params?: { status?: string }) {
    return useQuery<Lead[]>({
        queryKey: [getListLeadsQueryKey(), params?.status],
        queryFn: async () => {
            const url = params?.status ? `${API_BASE}/leads?status=${params.status}` : `${API_BASE}/leads`;
            const res = await apiFetch(url);
            if (!res.ok) throw new Error("Failed to fetch leads");
            return res.json();
        },
    });
}

export function useUpdateLead() {
    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<Lead> }) => {
            const res = await apiFetch(`${API_BASE}/leads/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update lead");
            return res.json();
        },
    });
}

// WhatsApp Integration
export function useGetWhatsappStatus(options?: any) {
    return useQuery<WhatsappStatus>({
        queryKey: getGetWhatsappStatusQueryKey(),
        queryFn: async () => {
            const res = await apiFetch(`${API_BASE}/whatsapp/status`);
            if (!res.ok) throw new Error("Failed to fetch WhatsApp status");
            return res.json();
        },
        ...options?.query,
    });
}

export function useExchangeMetaToken() {
    return useMutation({
        mutationFn: async ({ data }: { data: { code: string } }) => {
            const res = await apiFetch(`${API_BASE}/whatsapp/token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to exchange Meta token");
            return res.json();
        },
    });
}

export function useDisconnectWhatsapp() {
    return useMutation({
        mutationFn: async () => {
            const res = await apiFetch(`${API_BASE}/whatsapp/disconnect`, {
                method: "POST",
            });
            if (!res.ok) throw new Error("Failed to disconnect WhatsApp");
            return res.json();
        },
    });
}

export function useSendMessage() {
    return useMutation({
        mutationFn: async ({ data }: { data: { to: string; body: string } }) => {
            const res = await apiFetch(`${API_BASE}/whatsapp/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to send WhatsApp message");
            }
            return res.json();
        },
    });
}

// Customers
export function useListCustomers(params?: { search?: string }) {
    return useQuery<Customer[]>({
        queryKey: ["listCustomers", params?.search],
        queryFn: async () => {
            const url = params?.search ? `${API_BASE}/customers?search=${encodeURIComponent(params.search)}` : `${API_BASE}/customers`;
            const res = await apiFetch(url);
            if (!res.ok) throw new Error("Failed to fetch customers");
            return res.json();
        },
    });
}

export function useCreateCustomer() {
    return useMutation({
        mutationFn: async ({ data }: { data: { name: string; phone: string; city?: string; firstMessage?: string } }) => {
            const res = await apiFetch(`${API_BASE}/customers`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to create contact");
            }
            return res.json();
        },
    });
}

// Automations
export interface AutomationRule {
    id: number;
    name?: string;
    trigger_type: string;
    action_type: string;
    keyword: string;
    reply: string;
    status: number | boolean;
    executed_count: number;
    created_at: string;
    updated_at: string;
}

export function useListAutomations() {
    return useQuery<AutomationRule[]>({
        queryKey: ["listAutomations"],
        queryFn: async () => {
            const res = await apiFetch(`${API_BASE}/automations`);
            if (!res.ok) throw new Error("Failed to fetch automation rules");
            return res.json();
        },
    });
}

export function useCreateAutomation() {
    return useMutation({
        mutationFn: async ({ data }: { data: { name: string; keyword: string; reply: string; trigger_type?: string; action_type?: string; status?: number | boolean } }) => {
            const res = await apiFetch(`${API_BASE}/automations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to create automation rule");
            }
            return res.json();
        },
    });
}

export function useUpdateAutomation() {
    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<Omit<AutomationRule, "id" | "executed_count" | "created_at" | "updated_at">> }) => {
            const res = await apiFetch(`${API_BASE}/automations/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to update automation rule");
            }
            return res.json();
        },
    });
}

export function useDeleteAutomation() {
    return useMutation({
        mutationFn: async ({ id }: { id: number }) => {
            const res = await apiFetch(`${API_BASE}/automations/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to delete automation rule");
            }
            return res.json();
        },
    });
}

export function useGetCustomer(id: number, options?: any) {
    return useQuery<Customer>({
        queryKey: ["getCustomer", id],
        queryFn: async () => {
            const res = await apiFetch(`${API_BASE}/customers/${id}`);
            if (!res.ok) throw new Error("Failed to fetch customer");
            return res.json();
        },
        ...options?.query,
    });
}

export function useGetCustomerConversations(id: number, options?: any) {
    return useQuery<Conversation[]>({
        queryKey: ["getCustomerConversations", id],
        queryFn: async () => {
            const res = await apiFetch(`${API_BASE}/customers/${id}/conversations`);
            if (!res.ok) throw new Error("Failed to fetch customer conversations");
            return res.json();
        },
        ...options?.query,
    });
}

// Products
export function useListProducts() {
    return useQuery<Product[]>({
        queryKey: getListProductsQueryKey(),
        queryFn: async () => {
            const res = await apiFetch(`${API_BASE}/products`);
            if (!res.ok) throw new Error("Failed to fetch products");
            return res.json();
        },
    });
}

export function useCreateProduct() {
    return useMutation({
        mutationFn: async ({ data }: { data: Omit<Product, "id"> }) => {
            const res = await apiFetch(`${API_BASE}/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to create product");
            return res.json();
        },
    });
}

export function useUpdateProduct() {
    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<Product> }) => {
            const res = await apiFetch(`${API_BASE}/products/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update product");
            return res.json();
        },
    });
}

export function useDeleteProduct() {
    return useMutation({
        mutationFn: async ({ id }: { id: number }) => {
            const res = await apiFetch(`${API_BASE}/products/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete product");
            return res.json();
        },
    });
}

// Settings
export function useGetSettings() {
    return useQuery<Settings>({
        queryKey: getGetSettingsQueryKey(),
        queryFn: async () => {
            const res = await apiFetch(`${API_BASE}/settings`);
            if (!res.ok) throw new Error("Failed to fetch settings");
            return res.json();
        },
    });
}

export function useUpdateSettings() {
    return useMutation({
        mutationFn: async ({ data }: { data: Settings }) => {
            const res = await apiFetch(`${API_BASE}/settings`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update settings");
            return res.json();
        },
    });
}
