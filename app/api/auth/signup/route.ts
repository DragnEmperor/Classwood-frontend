import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiFetch, ApiError } from "@/lib/api";
import { setSession } from "@/lib/auth";
import type { LoginResponse } from "@/types/api";
import { BOARD_LIST, STATE_LIST } from "@/lib/constants";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  school_name: z.string().min(1),
  school_phone: z.string().regex(/^[0-9]{10,13}$/),
  school_address: z.string().min(1),
  school_city: z.string().min(1),
  school_state: z.enum(STATE_LIST),
  school_zipcode: z.string().regex(/^[0-9]{6,8}$/),
  school_website: z.string().url().optional().or(z.literal("")),
  date_of_establishment: z.string().min(1),
  school_affNo: z.string().min(1),
  school_board: z.enum(BOARD_LIST),
});

function flattenApiError(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  for (const value of Object.values(body as Record<string, unknown>)) {
    if (typeof value === "string") return value;
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
    if (value && typeof value === "object") {
      const nested = flattenApiError(value);
      if (nested) return nested;
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid request", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { email, password, ...rest } = parsed.data;
  const signupBody = {
    user: { email, password },
    ...rest,
    school_website: rest.school_website || undefined,
  };

  try {
    await apiFetch("signup/", { method: "POST", body: signupBody, noAuth: true });
  } catch (err) {
    if (err instanceof ApiError) {
      const message = flattenApiError(err.body) ?? "Registration failed";
      return NextResponse.json({ message }, { status: err.status });
    }
    return NextResponse.json({ message: "Registration failed" }, { status: 500 });
  }

  try {
    const login = await apiFetch<LoginResponse>("login/", {
      method: "POST",
      body: { email, password },
      noAuth: true,
    });

    if (!login.tokens?.access) {
      return NextResponse.json(
        { message: "Account created but auto-login failed. Please sign in." },
        { status: 200 },
      );
    }

    await setSession({
      token: login.tokens.access,
      userType: login.user_type,
      isPaid: login.user_type === "School",
    });

    return NextResponse.json({
      userType: login.user_type,
      isPaid: login.user_type === "School",
    });
  } catch {
    return NextResponse.json(
      { message: "Account created but auto-login failed. Please sign in." },
      { status: 200 },
    );
  }
}
