import { PaginatedResponse, Classroom } from "@/types/api";
import { DEFAULT_TAB, CLASS_GROUPS } from "./constants";

export function normalizeList<T>(value: T[] | PaginatedResponse<T> | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : value.results;
}

export function matchesClassGroup(name: string, tab: string) {
  if (tab === DEFAULT_TAB) return true;
  const group = CLASS_GROUPS.get(tab);
  if (!group) return true;
  return group.some((item) => name === item || name.startsWith(item));
}

export function numberFormatter(value: string | number | null | undefined) {
  return Number(value ?? 0).toFixed(2);
}

export function classLabel(classroom: Classroom) {
  return `${classroom.class_name} ${classroom.section_name}`.trim();
}