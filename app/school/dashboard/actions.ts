"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api";
import type { Notice, SchoolEvent, ThoughtOfTheDay } from "@/types/api";

export interface SaveThoughtResult {
  ok: boolean;
  message: string;
}

export interface MutationResult {
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

export async function createNotice(input: {
  title: string;
  description: string;
}): Promise<MutationResult> {
  const title = input.title.trim();
  const description = input.description.trim();
  if (!title) return { ok: false, message: "Title is required" };
  if (!description) return { ok: false, message: "Description is required" };

  try {
    await apiFetch<Notice>("list/notice/", {
      method: "POST",
      body: { title, description },
    });
    revalidatePath("/school/dashboard");
    return { ok: true, message: "Notice posted" };
  } catch (err) {
    if (err instanceof ApiError) return { ok: false, message: `Failed (${err.status})` };
    return { ok: false, message: "Failed to post notice" };
  }
}

export async function createEvent(input: {
  title: string;
  description: string;
  date: string;
}): Promise<MutationResult> {
  const title = input.title.trim();
  const description = input.description.trim();
  const date = input.date.trim();
  if (!title) return { ok: false, message: "Title is required" };
  if (!description) return { ok: false, message: "Description is required" };
  if (!date) return { ok: false, message: "Date is required" };

  try {
    await apiFetch<SchoolEvent>("list/event/", {
      method: "POST",
      body: { title, description, date },
    });
    revalidatePath("/school/dashboard");
    return { ok: true, message: "Event added" };
  } catch (err) {
    if (err instanceof ApiError) return { ok: false, message: `Failed (${err.status})` };
    return { ok: false, message: "Failed to add event" };
  }
}
