"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api";
import type { ThoughtOfTheDay } from "@/types/api";

export interface SaveThoughtResult {
  ok: boolean;
  message: string;
}

export async function saveThoughtOfTheDay(content: string): Promise<SaveThoughtResult> {
  const trimmed = content.trim();
  if (!trimmed) return { ok: false, message: "Thought cannot be empty" };

  const now = new Date();
  const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

  try {
    await apiFetch<ThoughtOfTheDay>("list/thoughtDay/", {
      method: "POST",
      body: { date, content: trimmed },
    });
    revalidatePath("/school/dashboard");
    return { ok: true, message: "Thought saved" };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, message: `Save failed (${err.status})` };
    }
    return { ok: false, message: "Save failed" };
  }
}
