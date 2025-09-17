import { NextRequest, NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/lib/api";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyBackend(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const backendPath = `${path.join("/")}/${request.nextUrl.search}`;
  const method = request.method;

  let body: unknown;
  if (method !== "GET" && method !== "HEAD") {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      body = await request.json().catch(() => undefined);
    } else if (contentType.includes("multipart/form-data")) {
      body = await request.formData().catch(() => undefined);
    }
  }

  try {
    const data = await apiFetch(backendPath, { method, body });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(err.body ?? { message: "Request failed" }, {
        status: err.status,
      });
    }
    return NextResponse.json({ message: "Request failed" }, { status: 500 });
  }
}

export const GET = proxyBackend;
export const POST = proxyBackend;
export const PUT = proxyBackend;
export const PATCH = proxyBackend;
export const DELETE = proxyBackend;
