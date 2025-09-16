import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
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
    <div className="bg-white">
      <div className="flex min-h-screen">
        <div className="flex w-full flex-row">
          <div className="relative flex flex-1 flex-col items-center justify-center px-4 sm:px-10">
            <div className="flex w-full items-center justify-between py-4 lg:hidden" />
            <div className="flex max-w-2xl flex-1 flex-col justify-center space-y-5">
              <div className="flex flex-col space-y-2 text-start">
                <h2 className="mb-4 text-3xl font-bold md:text-7xl">Welcome Back !!</h2>
                <p className="text-md md:text-xl">
                  We would love to welcome you to a network where school, teachers students
                  are all connect with each other.
                </p>
              </div>
              <LoginForm nextPath={next} />
            </div>
          </div>
          <div className="hidden flex-col justify-between bg-slate-200 lg:flex lg:max-w-sm xl:max-w-lg">
            <Image
              src="/assets/CLASSWOOD Login Cover.png"
              alt="Classwood login"
              width={640}
              height={1024}
              className="h-full w-full object-cover opacity-80"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
