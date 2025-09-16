import { NextRequest, NextResponse } from "next/server";

const ROLE_PREFIX: Record<string, "School" | "Staff" | "Student"> = {
  "/school": "School",
  "/staff": "Staff",
  "/student": "Student",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("access_token")?.value;
  const stateRaw = request.cookies.get("auth_state")?.value;

  if (!token || !stateRaw) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const matchedPrefix = Object.keys(ROLE_PREFIX).find((p) => pathname.startsWith(p));
  if (matchedPrefix) {
    let state: { userType?: string } = {};
    try {
      state = JSON.parse(stateRaw);
    } catch {
      // fall through; treated as mismatch below
    }
    const required = ROLE_PREFIX[matchedPrefix];
    if (state.userType !== required) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/school/:path*", "/staff/:path*", "/student/:path*"],
};
