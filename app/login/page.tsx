import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PublicSplitLayout } from "@/app/_components/public-split-layout";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (session) {
    redirect(`/${session.userType.toLowerCase()}/dashboard`);
  }

  const { next } = await searchParams;

  return (
    <PublicSplitLayout>
      <div className="flex max-w-2xl flex-1 flex-col justify-center space-y-5">
        <div className="flex flex-col space-y-2 text-start">
          <h2 className="mb-4 text-3xl font-bold md:text-7xl">Welcome Back !!</h2>
          <p className="text-md md:text-xl">
            We would love to welcome you to a network where school, teachers students are
            all connect with each other.
          </p>
        </div>
        <LoginForm nextPath={next} />
      </div>
    </PublicSplitLayout>
  );
}
