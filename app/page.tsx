import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold md:text-6xl">Classwood</h1>
        <p className="mt-4 text-lg text-gray-600">
          A network where schools, teachers, and students connect.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-[#4F46E5] px-6 py-3 font-medium text-white"
          >
            Log in
          </Link>
        </div>
        <p className="mt-6 text-sm text-gray-400">
          Landing page polish is scheduled for Phase 3.2.
        </p>
      </div>
    </main>
  );
}
