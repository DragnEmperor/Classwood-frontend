"use client";

export class ClientApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message?: string,
  ) {
    super(message ?? `API error ${status}`);
    this.name = "ClientApiError";
  }
}

interface ClientFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export async function clientFetch<T = unknown>(
  path: string,
  options: ClientFetchOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options;
  const isFormData = body instanceof FormData;
  const finalHeaders = new Headers(headers);

  if (body !== undefined && !isFormData && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }

  const normalizedPath = path.replace(/^\/+/, "");
  const url = path.startsWith("/api/") ? path : `/api/backend/${normalizedPath}`;
  const response = await fetch(url, {
    ...rest,
    headers: finalHeaders,
    body:
      body !== undefined
        ? isFormData
          ? body
          : JSON.stringify(body)
        : undefined,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload: unknown = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  if (!response.ok) throw new ClientApiError(response.status, payload);
  return payload as T;
}
