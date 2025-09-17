import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { PublicSplitLayout } from "@/app/_components/public-split-layout";
import { RegisterForm } from "./register-form";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    redirect(`/${session.userType.toLowerCase()}/dashboard`);
  }

  return (
    <PublicSplitLayout>
      <div className="flex w-full max-w-2xl flex-1 flex-col justify-center space-y-5 py-10">
        <RegisterForm />
        <div className="flex flex-row items-center justify-center space-x-2">
          <span>Already have an Account</span>
          <Link href="/login" className="font-medium text-[#070eff] underline">
            Sign in now
          </Link>
        </div>
      </div>
    </PublicSplitLayout>
  );
}
