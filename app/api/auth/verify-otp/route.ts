import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiFetch, ApiError } from "@/lib/api";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  otp: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  try {
    const data = await apiFetch<{ message?: string }>("verify-otp/", {
      method: "POST",
      body: parsed.data,
      noAuth: true,
    });
    return NextResponse.json(data ?? { message: "Password updated" });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(err.body ?? { message: "Verification failed" }, {
        status: err.status,
      });
    }
    return NextResponse.json({ message: "Verification failed" }, { status: 500 });
  }
}
