"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AiOutlineCheckCircle } from "react-icons/ai";
import Modal from "@/app/_components/modal";
import { useToast } from "@/app/_components/toast-provider";
import { clientFetch, clientFetchPage } from "@/lib/client-api";
import type { Fee, Student } from "@/types/api";
import { CONCESSIONS } from "@/lib/constants";
import CenteredText from "@/app/_components/centered-text";
import {numberFormatter} from "@/lib/utils";
import PaginationControls from "@/app/_components/pagination";

const STUDENTS_PAGE_SIZE = 20;

function finalAmount(fee: Fee, concessionId: string) {
  const concession = CONCESSIONS.find((item) => item.id === concessionId) ?? CONCESSIONS[0];
  const amount = Number(fee.amount);
  return (amount - (amount * concession.value) / 100).toFixed(2);
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-600">{label}</p>
      <p className="text-xl font-bold text-blue-700">{value}</p>
    </div>
  );
}

export default function FeeAssignmentModal({ fee, onClose }: { fee: Fee; onClose: () => void }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [concessionByStudent, setConcessionByStudent] = useState<Record<string, string>>({});
  const [bulkConcession, setBulkConcession] = useState("none");
  const [page, setPage] = useState(1);

  const studentsQuery = useQuery({
    queryKey: ["students", fee.classroom_id, page, STUDENTS_PAGE_SIZE],
    queryFn: () => clientFetchPage<Student>(`staff/student/?classroom=${fee.classroom_id}`, { page, pageSize: STUDENTS_PAGE_SIZE }),
  });

  const students = useMemo(() => studentsQuery.data?.results ?? [], [studentsQuery.data]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!students.length) throw new Error("No students in this class");
      const targets = selectedStudents.size
        ? students.filter((student) => selectedStudents.has(String(student.user.id)))
        : students;

      for (const student of targets) {
        const concessionId = concessionByStudent[String(student.user.id)] ?? "none";
        await clientFetch("list/payments/", {
          method: "POST",
          body: {
            student: student.user.id,
            fees: fee.id,
            amount_paid: finalAmount(fee, concessionId),
            payment_mode: "2",
            payment_date: new Date().toISOString().slice(0, 10),
            reference: `${student.first_name} ${student.last_name} - ${fee.fee_type}`,
          },
        });
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["fees"] }),
        queryClient.invalidateQueries({ queryKey: ["payments"] }),
      ]);
      toast.success("Payments recorded successfully");
      onClose();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to assign fee"),
  });

  function toggleStudent(id: string) {
    setSelectedStudents((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function applyBulkConcession() {
    const targets = selectedStudents.size ? selectedStudents : new Set(students.map((student) => String(student.user.id)));
    setConcessionByStudent((current) => {
      const next = { ...current };
      targets.forEach((id) => {
        next[id] = bulkConcession;
      });
      return next;
    });
  }

  const selectedOrAllCount = selectedStudents.size || students.length;
  const totalToCollect = students.reduce((sum, student) => {
    const id = String(student.user.id);
    if (selectedStudents.size && !selectedStudents.has(id)) return sum;
    return sum + Number(finalAmount(fee, concessionByStudent[id] ?? "none"));
  }, 0);

  return (
    <Modal title={`Assign ${fee.fee_type} to Students`} onClose={onClose}>
      <div className="mb-5 rounded-md border-l-4 border-blue-600 bg-blue-50 p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <MiniStat label="Fee Amount" value={`Rs ${numberFormatter(fee.amount)}`} />
          <MiniStat label="Students" value={students.length} />
          <MiniStat label="Selected" value={selectedStudents.size || "All"} />
          <MiniStat label="Due Date" value={fee.due_date ? new Date(fee.due_date).toLocaleDateString() : "N/A"} />
        </div>
      </div>

      <div className="mb-5 rounded-md border bg-gray-50 p-4">
        <h3 className="mb-3 font-semibold">Bulk Concession</h3>
        <div className="flex flex-col gap-3 md:flex-row">
          <select value={bulkConcession} onChange={(event) => setBulkConcession(event.target.value)} className="input">
            {CONCESSIONS.map((concession) => (
              <option key={concession.id} value={concession.id}>{concession.title} ({concession.value}%)</option>
            ))}
          </select>
          <button type="button" onClick={applyBulkConcession} className="rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700">
            Apply to {selectedStudents.size ? "Selected" : "All"}
          </button>
        </div>
      </div>

      {studentsQuery.isPending ? (
        <CenteredText text="Loading students..." />
      ) : students.length === 0 ? (
        <CenteredText text="No students in this class." />
      ) : (
        <div className="max-h-[420px] overflow-auto rounded-md border">
          <table className="w-full min-w-[760px]">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedStudents.size === students.length}
                    onChange={() => setSelectedStudents(selectedStudents.size === students.length ? new Set() : new Set(students.map((student) => String(student.user.id))))}
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Student</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">Roll No.</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Concession</th>
                <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">Final Amount</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const id = String(student.user.id);
                const concessionId = concessionByStudent[id] ?? "none";
                return (
                  <tr key={id} className="border-t">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selectedStudents.has(id)} onChange={() => toggleStudent(id)} />
                    </td>
                    <td className="px-4 py-3 font-semibold">{student.first_name} {student.last_name}</td>
                    <td className="px-4 py-3 text-center">{student.roll_no}</td>
                    <td className="px-4 py-3">
                      <select
                        value={concessionId}
                        onChange={(event) => setConcessionByStudent((current) => ({ ...current, [id]: event.target.value }))}
                        className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                      >
                        {CONCESSIONS.map((concession) => (
                          <option key={concession.id} value={concession.id}>{concession.title}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right font-bold">Rs {finalAmount(fee, concessionId)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4">
        <PaginationControls
          page={page}
          pageSize={STUDENTS_PAGE_SIZE}
          total={studentsQuery.data?.count ?? 0}
          isLoading={studentsQuery.isFetching}
          onPageChange={setPage}
        />
      </div>

      <div className="mt-5 rounded-md border border-green-200 bg-green-50 p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <MiniStat label="Payment Records" value={selectedOrAllCount} />
          <MiniStat label="Total to Record" value={`Rs ${numberFormatter(totalToCollect)}`} />
          <MiniStat label="Average" value={`Rs ${numberFormatter(selectedOrAllCount ? totalToCollect / selectedOrAllCount : 0)}`} />
        </div>
      </div>

      <div className="mt-6 flex justify-end border-t pt-5">
        <button type="button" disabled={mutation.isPending || students.length === 0} onClick={() => mutation.mutate()} className="inline-flex items-center rounded-md bg-green-600 px-5 py-2 font-semibold text-white disabled:opacity-60">
          <AiOutlineCheckCircle className="mr-2" />
          {mutation.isPending ? "Recording..." : "Confirm & Record Payments"}
        </button>
      </div>
    </Modal>
  );
}
