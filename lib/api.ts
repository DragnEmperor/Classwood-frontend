import { cookies } from "next/headers";
import type { PaginatedResponse } from "@/types/api";

const API_URL = process.env.API_URL ?? "http://127.0.0.1:8000/api/";

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message?: string,
  ) {
    super(message ?? `API error ${status}`);
    this.name = "ApiError";
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Skip attaching the Bearer token (e.g. for login). */
  noAuth?: boolean;
}

interface PageFetchOptions {
  page?: number;
  pageSize?: number;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { body, noAuth, headers, ...rest } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const finalHeaders = new Headers(headers);
  if (body !== undefined && !isFormData && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }

  if (!noAuth) {
    const store = await cookies();
    const token = store.get("access_token")?.value;
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  const res = await fetch(url, {
    ...rest,
    headers: finalHeaders,
    body:
      body !== undefined
        ? isFormData
          ? body
          : JSON.stringify(body)
        : undefined,
    cache: rest.cache ?? "no-store",
  });

  const contentType = res.headers.get("content-type") ?? "";
  const payload: unknown = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) throw new ApiError(res.status, payload);
  return payload as T;
}

function withPageParams(path: string, { page, pageSize }: PageFetchOptions) {
  const [base, search = ""] = path.split("?");
  const params = new URLSearchParams(search);

  if (page !== undefined) params.set("page", String(page));
  if (pageSize !== undefined) params.set("page_size", String(pageSize));

  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export async function apiFetchPage<T>(
  path: string,
  options: PageFetchOptions = {},
): Promise<PaginatedResponse<T>> {
  return apiFetch<PaginatedResponse<T>>(withPageParams(path, options));
}

export const apiBaseUrl = API_URL;
