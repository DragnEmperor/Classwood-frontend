import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiFetch, ApiError } from "@/lib/api";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid email" }, { status: 400 });
  }

  try {
    const data = await apiFetch<{ message?: string }>("forgot-password/", {
      method: "POST",
      body: parsed.data,
      noAuth: true,
    });
    return NextResponse.json(data ?? { message: "OTP sent" });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(err.body ?? { message: "Request failed" }, {
        status: err.status,
      });
    }
    return NextResponse.json({ message: "Request failed" }, { status: 500 });
  }
}
