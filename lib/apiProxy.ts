import { NextRequest, NextResponse } from "next/server";

const SITE_URL = process.env.SITE_URL || "http://localhost:3002";
const API_TOKEN = process.env.API_TOKEN || "1sa2a5gfd1f2g12asd4asd1a2sf5sdf";

function getApiUrl(): string {
    const envUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
    if (envUrl && !envUrl.includes(":8000")) {
        return envUrl.replace("http://localhost", "http://127.0.0.1");
    }
    return "http://127.0.0.1/connectly360/connectly360-backend/public/api";
}

export async function handleApiProxy(
    req: NextRequest,
    endpoint: string,
    method: string = "POST"
) {
    try {
        // Validate origin
        const origin = req.headers.get("origin");
        const referer = req.headers.get("referer");

        const allowedOrigins = [
            SITE_URL,
            "http://localhost:3002",
            "http://127.0.0.1:3002",
            "https://connectly360.sandboxtechnology.in"
        ];

        const isValidOrigin = process.env.NODE_ENV === "development" ||
            allowedOrigins.some(allowed => origin === allowed || (referer && referer.startsWith(allowed)));

        if (!isValidOrigin) {
            return NextResponse.json(
                { success: false, message: "Unauthorized token" },
                { status: 403 }
            );
        }

        const clientAuth = req.headers.get("Authorization");

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "Requested-Domain": SITE_URL,
            "X-Api-Token": API_TOKEN,
            "Authorization": clientAuth || `Bearer ${API_TOKEN}`
        };

        const fetchOptions: RequestInit = {
            method,
            headers,
        };

        // Don't pass a body for GET or HEAD requests
        if (method !== "GET" && method !== "HEAD") {
            const body = await req.json().catch(() => null);
            if (body) {
                fetchOptions.body = JSON.stringify(body);
            }
        }

        // Call backend API
        const apiUrl = getApiUrl();
        const targetUrl = `${apiUrl}${endpoint}`;
        const apiRes = await fetch(targetUrl, fetchOptions);

        const text = await apiRes.text();

        return new NextResponse(text, {
            status: apiRes.status,
            headers: {
                "Content-Type":
                    apiRes.headers.get("content-type") || "application/json",
            },
        });
    } catch (error: any) {
        console.error("[apiProxy error]:", error);
        return NextResponse.json(
            {
                success: false,
                message: process.env.NODE_ENV === "development" ? (error?.message || "Internal Server Error") : "Internal Server Error"
            },
            { status: 500 }
        );
    }
}