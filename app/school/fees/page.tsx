"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AiOutlineSearch,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { FiEdit2, FiTrash2, FiUsers } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useToast } from "@/app/_components/toast-provider";
import { clientFetch, clientFetchPage } from "@/lib/client-api";
import type {
  Classroom,
  Fee,
  FeeSummary,
  Payment,
  PaymentsResponse,
} from "@/types/api";

import Loading from "@/app/_components/loader";
import CenteredText from "@/app/_components/centered-text";
import FeeFormModal from "./_components/fee-form";
import FeeAssignmentModal from "./_components/assignment";
import {numberFormatter} from "@/lib/utils";
import IconButton from "./_components/icon";
import PaginationControls from "@/app/_components/pagination";

type SortKey = "created_at" | "class" | "type" | "amount_asc" | "amount_desc";
type ViewMode = "table" | "grouped";

function collectionTone(percentage: number) {
  if (percentage === 0) return "bg-red-50 text-red-700";
  if (percentage < 50) return "bg-orange-50 text-orange-700";
  if (percentage < 100) return "bg-yellow-50 text-yellow-700";
  return "bg-green-50 text-green-700";
}

export default function FeesPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("created_at");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [formFee, setFormFee] = useState<Fee | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [assignmentFee, setAssignmentFee] = useState<Fee | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = viewMode === "grouped" ? 12 : 10;

  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortBy, viewMode]);

  const feesQuery = useQuery({
    queryKey: ["fees", page, pageSize],
    queryFn: () => clientFetchPage<Fee>("list/fees/", { page, pageSize }),
  });
  const classroomsQuery = useQuery({
    queryKey: ["classrooms"],
    queryFn: () => clientFetchPage<Classroom>("list/classroom/", { pageSize: 100 }),
  });
  const summaryQuery = useQuery({
    queryKey: ["fees", "summary"],
    queryFn: () => clientFetch<FeeSummary>("list/fees/?summary=true"),
  });
  const paymentsQuery = useQuery({
    queryKey: ["payments", "recent"],
    queryFn: () => clientFetch<PaymentsResponse>("list/payments/?limit=8"),
  });

  const fees = useMemo(() => feesQuery.data?.results ?? [], [feesQuery.data]);
  const classrooms = useMemo(() => classroomsQuery.data?.results ?? [], [classroomsQuery.data]);
  const summary = summaryQuery.data;
  const payments = paymentsQuery.data?.payments ?? [];

  const filteredFees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = fees.filter((fee) =>
      `${fee.className} ${fee.fee_type} ${fee.amount}`.toLowerCase().includes(query),
    );

    return filtered.sort((a, b) => {
      if (sortBy === "amount_asc") return Number(a.amount) - Number(b.amount);
      if (sortBy === "amount_desc") return Number(b.amount) - Number(a.amount);
      if (sortBy === "class") return a.className.localeCompare(b.className);
      if (sortBy === "type") return a.fee_type.localeCompare(b.fee_type);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [fees, searchQuery, sortBy]);

  const groupedFees = useMemo(() => {
    return filteredFees.reduce<Record<string, Fee[]>>((acc, fee) => {
      acc[fee.className] = acc[fee.className] ?? [];
      acc[fee.className].push(fee);
      return acc;
    }, {});
  }, [filteredFees]);

  const deleteFee = useMutation({
    mutationFn: (feeId: string) => clientFetch(`list/fees/${feeId}/`, { method: "DELETE" }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["fees"] }),
        queryClient.invalidateQueries({ queryKey: ["payments"] }),
      ]);
      toast.success("Fee deleted successfully");
    },
    onError: () => toast.error("Failed to delete fee"),
  });

  if (feesQuery.isPending || classroomsQuery.isPending) {
    return <Loading />;
  }

  if (feesQuery.isError || classroomsQuery.isError) {
    return <CenteredText className="text-red-600" text="Unable to load fee data." />;
  }

  return (
    <div className="px-4 py-8 md:px-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
          <p className="mt-1 text-gray-500">Manage fees, concessions, and payment tracking.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFormFee(null);
            setFormOpen(true);
          }}
          className="inline-flex w-fit items-center rounded-md bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          <IoMdAddCircleOutline className="mr-2" size={20} />
          Create Fee
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Total Fees" value={feesQuery.data?.count ?? fees.length} tone="blue" />
        <StatCard label="Total Amount" value={`Rs ${numberFormatter(summary?.total_fees ?? fees.reduce((sum, fee) => sum + Number(fee.amount), 0))}`} tone="green" />
        <StatCard label="Collected" value={`Rs ${numberFormatter(summary?.total_paid ?? 0)}`} tone="indigo" />
        <StatCard label="Pending" value={`Rs ${numberFormatter(summary?.pending ?? 0)}`} tone="orange" />
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 focus:border-indigo-500 focus:outline-none"
                placeholder="Search by class, fee type, or amount"
              />
            </div>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortKey)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-indigo-500 focus:outline-none"
            >
              <option value="created_at">Latest First</option>
              <option value="class">By Class</option>
              <option value="type">By Fee Type</option>
              <option value="amount_asc">Amount: Low to High</option>
              <option value="amount_desc">Amount: High to Low</option>
            </select>

            <div className="flex w-fit rounded-md bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`rounded-md px-4 py-2 font-semibold ${viewMode === "table" ? "bg-white text-indigo-600 shadow" : "text-gray-600"}`}
              >
                Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grouped")}
                className={`rounded-md px-4 py-2 font-semibold ${viewMode === "grouped" ? "bg-white text-indigo-600 shadow" : "text-gray-600"}`}
              >
                By Class
              </button>
            </div>
          </div>

          {filteredFees.length === 0 ? (
            <CenteredText text={searchQuery ? "No fees match your search." : "Create a fee to get started."} />
          ) : viewMode === "table" ? (
            <FeesTable
              fees={filteredFees}
              onEdit={(fee) => {
                setFormFee(fee);
                setFormOpen(true);
              }}
              onDelete={(fee) => {
                if (window.confirm(`Delete ${fee.fee_type}?`)) deleteFee.mutate(fee.id);
              }}
              onAssign={setAssignmentFee}
            />
          ) : (
            <GroupedFees
              groupedFees={groupedFees}
              onEdit={(fee) => {
                setFormFee(fee);
                setFormOpen(true);
              }}
              onDelete={(fee) => {
                if (window.confirm(`Delete ${fee.fee_type}?`)) deleteFee.mutate(fee.id);
              }}
              onAssign={setAssignmentFee}
            />
          )}
          <div className="mt-6">
            <PaginationControls
              page={page}
              pageSize={pageSize}
              total={feesQuery.data?.count ?? 0}
              isLoading={feesQuery.isFetching}
              onPageChange={setPage}
            />
          </div>
        </div>

        <RecentPayments payments={payments} />
      </div>

      {formOpen ? (
        <FeeFormModal
          fee={formFee}
          classrooms={classrooms}
          onClose={() => setFormOpen(false)}
        />
      ) : null}

      {assignmentFee ? (
        <FeeAssignmentModal fee={assignmentFee} onClose={() => setAssignmentFee(null)} />
      ) : null}
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone: "blue" | "green" | "indigo" | "orange";
}) {
  const classes = {
    blue: "border-blue-600 bg-blue-50 text-blue-700",
    green: "border-green-600 bg-green-50 text-green-700",
    indigo: "border-indigo-600 bg-indigo-50 text-indigo-700",
    orange: "border-orange-600 bg-orange-50 text-orange-700",
  };
  return (
    <div className={`rounded-md border-l-4 p-4 ${classes[tone]}`}>
      <p className="text-sm font-semibold text-gray-600">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function FeesTable({
  fees,
  onEdit,
  onDelete,
  onAssign,
}: {
  fees: Fee[];
  onEdit: (fee: Fee) => void;
  onDelete: (fee: Fee) => void;
  onAssign: (fee: Fee) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-md border bg-white shadow-sm">
      <div className="min-w-[900px]">
        <div className="grid grid-cols-[1.1fr_1.2fr_120px_130px_150px_150px] bg-gray-100 px-4 py-3 text-sm font-bold text-gray-700">
          <span>Class</span>
          <span>Fee Type</span>
          <span className="text-right">Amount</span>
          <span className="text-center">Due Date</span>
          <span className="text-center">Collection</span>
          <span className="text-center">Actions</span>
        </div>
        {fees.map((fee) => (
          <div key={fee.id} className="grid grid-cols-[1.1fr_1.2fr_120px_130px_150px_150px] border-t px-4 py-3 text-sm">
            <span className="font-semibold">{fee.className}</span>
            <span>{fee.fee_type}</span>
            <span className="text-right font-semibold">Rs {numberFormatter(fee.amount)}</span>
            <span className="text-center">{fee.due_date ? new Date(fee.due_date).toLocaleDateString() : "-"}</span>
            <span className="text-center">
              <CollectionBadge percentage={fee.collection_status?.collection_percentage ?? 0} />
            </span>
            <span className="flex items-center justify-center gap-2">
              <IconButton label="Edit" onClick={() => onEdit(fee)}><FiEdit2 /></IconButton>
              <IconButton label="Assign payments" onClick={() => onAssign(fee)}><FiUsers /></IconButton>
              <IconButton label="Delete" danger onClick={() => onDelete(fee)}><FiTrash2 /></IconButton>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GroupedFees({
  groupedFees,
  onEdit,
  onDelete,
  onAssign,
}: {
  groupedFees: Record<string, Fee[]>;
  onEdit: (fee: Fee) => void;
  onDelete: (fee: Fee) => void;
  onAssign: (fee: Fee) => void;
}) {
  return (
    <div className="space-y-6">
      {Object.entries(groupedFees).map(([className, fees]) => (
        <section key={className} className="overflow-hidden rounded-md border bg-white shadow-sm">
          <div className="bg-indigo-600 px-6 py-4 text-white">
            <h2 className="text-lg font-bold">{className}</h2>
            <p className="mt-1 text-sm text-indigo-100">{fees.length} fee{fees.length === 1 ? "" : "s"}</p>
          </div>
          <div className="space-y-3 p-5">
            {fees.map((fee) => (
              <div key={fee.id} className="flex flex-col gap-4 rounded-md border bg-gray-50 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{fee.fee_type}</h3>
                  <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>Rs {numberFormatter(fee.amount)}</span>
                    <span>Due: {fee.due_date ? new Date(fee.due_date).toLocaleDateString() : "-"}</span>
                    <CollectionBadge percentage={fee.collection_status?.collection_percentage ?? 0} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <IconButton label="Edit" onClick={() => onEdit(fee)}><FiEdit2 /></IconButton>
                  <IconButton label="Assign payments" onClick={() => onAssign(fee)}><FiUsers /></IconButton>
                  <IconButton label="Delete" danger onClick={() => onDelete(fee)}><FiTrash2 /></IconButton>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function CollectionBadge({ percentage }: { percentage: number }) {
  return (
    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${collectionTone(percentage)}`}>
      {percentage.toFixed(1)}%
    </span>
  );
}

function RecentPayments({ payments }: { payments: Payment[] }) {
  return (
    <aside className="h-fit rounded-md border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 border-b pb-3">
        <AiOutlineUnorderedList className="text-indigo-700" />
        <h2 className="font-semibold">Recent Payments</h2>
      </div>
      {payments.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-500">No payment history found.</div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div key={payment.id} className="rounded-md bg-gray-50 p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-gray-800">{payment.student_name}</span>
                <span className="font-bold text-green-700">Rs {numberFormatter(payment.amount_paid)}</span>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                {payment.fee_type ?? "Fee"} · {payment.payment_date}
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
