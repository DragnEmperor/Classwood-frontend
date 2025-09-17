import { PaginatedResponse } from "@/types/api";

export function normalizeList<T>(value: T[] | PaginatedResponse<T> | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : value.results;
}