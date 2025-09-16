import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiFetch, ApiError } from "@/lib/api";
import { setSession } from "@/lib/auth";
import type { LoginResponse } from "@/types/api";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid request", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const data = await apiFetch<LoginResponse>("login/", {
      method: "POST",
      body: parsed.data,
      noAuth: true,
    });

    if (!data.tokens?.access) {
      return NextResponse.json(
        { message: data.message ?? "Invalid email or password" },
        { status: 401 },
      );
    }

    await setSession({
      token: data.tokens.access,
      userType: data.user_type,
      isPaid: data.user_type === "School",
    });

    return NextResponse.json({
      userType: data.user_type,
      isPaid: data.user_type === "School",
    });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(err.body ?? { message: "Login failed" }, {
        status: err.status,
      });
    }
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
