import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { PublicSplitLayout } from "@/app/_components/public-split-layout";
import { ForgotPasswordForm } from "./forgot-password-form";

export const dynamic = "force-dynamic";

export default async function ForgotPasswordPage() {
  const session = await getSession();
  if (session) {
    redirect(`/${session.userType.toLowerCase()}/dashboard`);
  }

  return (
    <PublicSplitLayout>
      <div className="flex max-w-2xl flex-1 flex-col justify-center space-y-5">
        <ForgotPasswordForm />
        <div className="flex flex-row items-center justify-center space-x-2">
          <span>Remembered it?</span>
          <Link href="/login" className="font-medium text-[#070eff] underline">
            Back to login
          </Link>
        </div>
      </div>
    </PublicSplitLayout>
  );
}
