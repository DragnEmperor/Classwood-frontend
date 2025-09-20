import { ClientApiError } from "@/lib/client-api";

export interface CsvRowError {
  row?: number | string;
  errors: string[];
}

export interface ParsedCsvError {
  title: string;
  message: string;
  created?: number;
  errors: CsvRowError[];
}

function toMessages(value: unknown): string[] {
  if (value === null || value === undefined) return [];
  if (typeof value === "string") return [value];
  if (typeof value === "number" || typeof value === "boolean") return [String(value)];
  if (Array.isArray(value)) return value.flatMap(toMessages);
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([field, detail]) =>
      toMessages(detail).map((message) => `${field}: ${message}`),
    );
  }
  return [String(value)];
}

function toRowError(value: unknown): CsvRowError {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const row = (value as { row?: number | string }).row;
    const rawErrors = (value as { errors?: unknown; error?: unknown; detail?: unknown }).errors
      ?? (value as { error?: unknown }).error
      ?? (value as { detail?: unknown }).detail;
    return {
      row,
      errors: toMessages(rawErrors).filter(Boolean),
    };
  }

  return { errors: toMessages(value).filter(Boolean) };
}

export function parseCsvImportError(error: unknown, fallbackTitle: string): ParsedCsvError {
  const body = error instanceof ClientApiError ? error.body : error instanceof Error ? undefined : error;
  if (body !== undefined) {
    if (Array.isArray(body)) {
      return {
        title: fallbackTitle,
        message: "Some rows could not be imported.",
        errors: body.map(toRowError).filter((row) => row.errors.length > 0),
      };
    }
    if (body && typeof body === "object") {
      const payload = body as { message?: unknown; detail?: unknown; created?: unknown; errors?: unknown };
      const rowErrors = Array.isArray(payload.errors)
        ? payload.errors.map(toRowError).filter((row) => row.errors.length > 0)
        : [];
      const message = toMessages(payload.message ?? payload.detail)[0] ?? "Some rows could not be imported.";
      const created = typeof payload.created === "number" ? payload.created : undefined;

      return {
        title: fallbackTitle,
        message,
        created,
        errors: rowErrors.length
          ? rowErrors
          : payload.errors !== undefined
            ? [{ errors: toMessages(payload.errors) }]
            : [],
      };
    }
  }

  if (error instanceof Error) {
    return {
      title: fallbackTitle,
      message: error.message,
      errors: [],
    };
  }

  return {
    title: fallbackTitle,
    message: "Unable to import CSV.",
    errors: [],
  };
}
