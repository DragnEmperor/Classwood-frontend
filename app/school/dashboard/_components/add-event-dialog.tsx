"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { createEvent } from "../actions";

export function AddEventDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const reset = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setError(null);
  };

  const close = () => {
    if (pending) return;
    setOpen(false);
    reset();
  };

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const res = await createEvent({ title, description, date });
      if (!res.ok) {
        setError(res.message);
        return;
      }
      setOpen(false);
      reset();
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex flex-row items-center font-semibold text-indigo-600 hover:text-indigo-700"
      >
        <IoMdAddCircleOutline className="mr-2 h-6 w-6" /> Add New
      </button>

      <Dialog open={open} onClose={close} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-y-0 right-0 flex w-full max-w-md">
          <DialogPanel className="flex h-full w-full flex-col bg-white p-6 shadow-xl">
            <DialogTitle className="text-2xl font-semibold">Add Event</DialogTitle>

            <label className="mt-6 text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={pending}
              className="mt-1 rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            />

            <label className="mt-4 text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={pending}
              className="mt-1 rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            />

            <label className="mt-4 text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={pending}
              rows={6}
              className="mt-1 rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            />

            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

            <div className="mt-auto flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={close}
                disabled={pending}
                className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={pending}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {pending ? "Saving…" : "Save"}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
