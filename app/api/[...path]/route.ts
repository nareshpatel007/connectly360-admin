import { NextRequest } from "next/server";
import { handleApiProxy } from "@/lib/apiProxy";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    const endpoint = `/${resolvedParams.path.join("/")}`;

    // Forward query params if they exist
    const searchParams = req.nextUrl.searchParams.toString();
    const fullEndpoint = searchParams ? `${endpoint}?${searchParams}` : endpoint;

    return handleApiProxy(req, fullEndpoint, "GET");
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    const endpoint = `/${resolvedParams.path.join("/")}`;
    return handleApiProxy(req, endpoint, "POST");
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    const endpoint = `/${resolvedParams.path.join("/")}`;
    return handleApiProxy(req, endpoint, "PUT");
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    const endpoint = `/${resolvedParams.path.join("/")}`;
    return handleApiProxy(req, endpoint, "PATCH");
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    const endpoint = `/${resolvedParams.path.join("/")}`;
    return handleApiProxy(req, endpoint, "DELETE");
}
