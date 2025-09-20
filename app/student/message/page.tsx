"use client";

import { AiOutlineMessage } from "react-icons/ai";

export default function StudentMessagePage() {
  return (
    <div className="px-4 py-8 md:px-10">
      <div className="rounded-md border bg-white p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-md bg-indigo-50 text-indigo-700">
          <AiOutlineMessage className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">Messages</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Coming Soon!
        </p>
      </div>
    </div>
  );
}
