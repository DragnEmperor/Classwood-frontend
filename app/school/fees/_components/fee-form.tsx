"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiTrash2 } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import Modal from "@/app/_components/modal";
import Field from "@/app/_components/field";
import { useToast } from "@/app/_components/toast-provider";
import { clientFetch } from "@/lib/client-api";
import type { Classroom, Fee } from "@/types/api";
import { classLabel } from "@/lib/utils";

interface FeeDraft {
  id: string;
  fee_type: string;
  amount: string;
  description: string;
  due_date: string;
}

function newFeeDraft(): FeeDraft {
  return {
    id: crypto.randomUUID(),
    fee_type: "",
    amount: "",
    description: "",
    due_date: "",
  };
}

export default function FeeFormModal({
  fee,
  classrooms,
  onClose,
}: {
  fee: Fee | null;
  classrooms: Classroom[];
  onClose: () => void;
}) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedClass, setSelectedClass] = useState(fee?.classroom_id ?? classrooms[0]?.id ?? "");
  const [feeItems, setFeeItems] = useState<FeeDraft[]>(
    fee
      ? [{
          id: fee.id,
          fee_type: fee.fee_type,
          amount: fee.amount,
          description: fee.description ?? "",
          due_date: fee.due_date ?? "",
        }]
      : [newFeeDraft()],
  );

  const mutation = useMutation({
    mutationFn: async () => {
      if (!selectedClass) throw new Error("Select a class");
      for (const item of feeItems) {
        if (!item.fee_type.trim() || !Number(item.amount)) {
          throw new Error("Fee type and amount are required");
        }
      }

      if (fee) {
        const item = feeItems[0];
        return clientFetch(`list/fees/${fee.id}/`, {
          method: "PATCH",
          body: {
            fee_type: item.fee_type.trim(),
            amount: item.amount,
            description: item.description.trim(),
            due_date: item.due_date || null,
          },
        });
      }

      return clientFetch("list/fees/", {
        method: "POST",
        body: {
          for_class: selectedClass,
          fee_data: feeItems.map((item) => ({
            title: item.fee_type.trim(),
            fees: item.amount,
            description: item.description.trim(),
            due_date: item.due_date || null,
          })),
          student_data: [],
        },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["fees"] });
      toast.success(fee ? "Fee updated successfully" : "Fees created successfully");
      onClose();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to save fees"),
  });

  function updateItem(id: string, field: keyof FeeDraft, value: string) {
    setFeeItems((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
  }

  return (
    <Modal title={fee ? "Edit Fee" : "Create New Fee"} onClose={onClose}>
      <Field label={`Class/Section ${fee ? "" : "*"}`}>
        {fee ? (
          <div className="rounded-md border bg-gray-100 px-3 py-2">{fee.className}</div>
        ) : (
          <select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)} className="input">
            {classrooms.map((classroom) => (
              <option key={classroom.id} value={classroom.id}>{classLabel(classroom)}</option>
            ))}
          </select>
        )}
      </Field>

      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Fee Details</h3>
        {feeItems.map((item) => (
          <div key={item.id} className="rounded-md border p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Fee Type *">
                <input value={item.fee_type} onChange={(event) => updateItem(item.id, "fee_type", event.target.value)} className="input" placeholder="Tuition, Transport, etc." />
              </Field>
              <Field label="Amount (Rs) *">
                <input value={item.amount} onChange={(event) => updateItem(item.id, "amount", event.target.value)} type="number" min={0} step="0.01" className="input" />
              </Field>
              <Field label="Due Date">
                <input value={item.due_date} onChange={(event) => updateItem(item.id, "due_date", event.target.value)} type="date" className="input" />
              </Field>
              <Field label="Description">
                <input value={item.description} onChange={(event) => updateItem(item.id, "description", event.target.value)} className="input" placeholder="Optional" />
              </Field>
            </div>
            {!fee && feeItems.length > 1 ? (
              <button type="button" onClick={() => setFeeItems((current) => current.filter((row) => row.id !== item.id))} className="mt-3 inline-flex items-center text-red-600 hover:text-red-700">
                <FiTrash2 className="mr-2" />
                Remove Fee Item
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {!fee ? (
        <button type="button" onClick={() => setFeeItems((current) => [...current, newFeeDraft()])} className="mt-4 inline-flex items-center rounded-md px-3 py-2 font-semibold text-indigo-700 hover:bg-indigo-50">
          <IoMdAddCircleOutline className="mr-2" />
          Add Another Fee Item
        </button>
      ) : null}

      <div className="mt-6 flex justify-end border-t pt-5">
        <button type="button" disabled={mutation.isPending} onClick={() => mutation.mutate()} className="rounded-md bg-indigo-600 px-5 py-2 font-semibold text-white disabled:opacity-60">
          {mutation.isPending ? "Saving..." : fee ? "Update Fee" : "Create Fee"}
        </button>
      </div>
    </Modal>
  );
}