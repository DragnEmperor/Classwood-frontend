"use client";

import { useState, useTransition } from "react";
import { saveThoughtOfTheDay } from "./actions";

export function ThoughtOfTheDay({ initial }: { initial: string }) {
  const [thought, setThought] = useState(initial);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-8 flex w-full flex-col">
      <span className="text-2xl font-semibold">Thought Of the Day</span>
      <textarea
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        placeholder="Enter Thought of the day"
        className="mt-4 w-full rounded-lg border p-2"
      />
      <button
        type="button"
        onClick={() =>
          startTransition(async () => {
            const result = await saveThoughtOfTheDay(thought);
            setStatus(result.message);
          })
        }
        disabled={pending}
        className="mt-2 rounded-md bg-[#372ed1] px-4 py-2 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save and Share"}
      </button>
      {status && <span className="mt-2 text-sm text-gray-600">{status}</span>}
    </div>
  );
}
