/**
 * Standardized Admin API Client for Connectly360 Admin
 *
 * Centralizes request dispatching through the internal Next.js proxy (/api/admin/...)
 * with canonical admin_auth_token resolution, consistent headers, and typed responses.
 */

export interface ApiResponse<T = unknown> {
    status: boolean;
    message?: string;
    data?: T;
    metrics?: Record<string, unknown>;
    errors?: Record<string, string[]>;
}

export interface PaginatedData<T = unknown> {
    current_page: number;
    data: T[];
    first_page_url?: string;
    from?: number;
    last_page: number;
    last_page_url?: string;
    next_page_url?: string | null;
    path?: string;
    per_page: number;
    prev_page_url?: string | null;
    to?: number;
    total: number;
}

/**
 * Resolves the canonical admin authentication token.
 * Prevents returning strings like "null" or "undefined".
 */
export function getAdminAuthToken(): string {
    if (typeof window === "undefined") {
        return "";
    }
    const token = localStorage.getItem("admin_auth_token") || localStorage.getItem("auth_token") || "";
    if (token === "null" || token === "undefined") {
        return "";
    }
    return token.trim();
}

/**
 * Standardized fetch wrapper that injects canonical admin headers and handles JSON parsing.
 */
export async function adminFetch<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = getAdminAuthToken();
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string> || {}),
    };

    if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        headers["X-Api-Token"] = token;
    }

    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    const res = await fetch(normalizedEndpoint, {
        ...options,
        headers,
    });

    const json = await res.json().catch(() => ({
        status: false,
        message: `HTTP ${res.status}: Failed to parse server response.`,
    }));

    if (!res.ok && json.status === undefined) {
        json.status = false;
        json.message = json.message || `Request failed with status ${res.status}`;
    }

    return json as ApiResponse<T>;
}

/**
 * Convenience HTTP verb helpers
 */
export const adminApi = {
    get: <T = unknown>(url: string, headers?: Record<string, string>) =>
        adminFetch<T>(url, { method: "GET", headers }),

    post: <T = unknown>(url: string, body?: unknown, headers?: Record<string, string>) =>
        adminFetch<T>(url, {
            method: "POST",
            body: body instanceof FormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
            headers,
        }),

    put: <T = unknown>(url: string, body?: unknown, headers?: Record<string, string>) =>
        adminFetch<T>(url, {
            method: "PUT",
            body: body instanceof FormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
            headers,
        }),

    delete: <T = unknown>(url: string, headers?: Record<string, string>) =>
        adminFetch<T>(url, { method: "DELETE", headers }),
};
