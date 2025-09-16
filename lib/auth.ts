import { cookies } from "next/headers";

export type UserType = "School" | "Staff" | "Student";

export interface Session {
  token: string;
  userType: UserType;
  isPaid: boolean;
}

const TOKEN_COOKIE = "access_token";
const STATE_COOKIE = "auth_state";

const secure = process.env.COOKIE_SECURE === "true";

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(TOKEN_COOKIE)?.value;
  const stateRaw = store.get(STATE_COOKIE)?.value;
  if (!token || !stateRaw) return null;

  try {
    const state = JSON.parse(stateRaw) as { userType: UserType; isPaid: boolean };
    return { token, userType: state.userType, isPaid: state.isPaid };
  } catch {
    return null;
  }
}

export async function setSession(session: Session): Promise<void> {
  const store = await cookies();
  const common = {
    path: "/",
    secure,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
  };

  store.set(TOKEN_COOKIE, session.token, { ...common, httpOnly: true });
  store.set(
    STATE_COOKIE,
    JSON.stringify({ userType: session.userType, isPaid: session.isPaid }),
    { ...common, httpOnly: false },
  );
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  store.delete(STATE_COOKIE);
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthenticated — middleware should have redirected.");
  }
  return session;
}
