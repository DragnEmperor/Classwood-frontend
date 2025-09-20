"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineCreditCard } from "react-icons/ai";
import { clientFetch } from "@/lib/client-api";
import CenteredText from "@/app/_components/centered-text";
import Loading from "@/app/_components/loader";
import type { Payment, StudentFeeItem, StudentFeesResponse } from "@/types/api";

function money(value?: string | number) {
  return `Rs ${Number(value ?? 0).toLocaleString("en-IN")}`;
}

function paidForFee(fee: StudentFeeItem, payments: Payment[]) {
  return payments
    .filter((payment) => String(payment.fee_id) === String(fee.id))
    .reduce((sum, payment) => sum + Number(payment.amount_paid), 0);
}

export default function StudentFeesPage() {
  const feesQuery = useQuery({
    queryKey: ["student", "fees"],
    queryFn: () => clientFetch<StudentFeesResponse>("student/fees"),
  });

  const data = feesQuery.data;
  const paymentRows = useMemo(() => data?.payments ?? [], [data?.payments]);

  if (feesQuery.isPending) return <Loading />;
  if (feesQuery.isError || !data) return <CenteredText className="text-red-600" text="Unable to load fees." />;

  return (
    <div className="px-4 py-8 md:px-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Fee Payment</h1>
          <p className="mt-1 text-sm text-gray-500">Fee structure, paid amount, and pending balance.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total Fees" value={money(data.total_amount)} />
        <SummaryCard label="Amount Paid" value={money(data.total_paid)} />
        <SummaryCard label="Balance Due" value={money(data.balance_due)} tone="red" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.8fr]">
        <section className="rounded-md border bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Fee Structure</h2>
              <p className="mt-1 text-sm text-gray-500">Payable after concessions: {money(data.amount_to_pay)}</p>
            </div>
            <AiOutlineCreditCard className="h-7 w-7 text-indigo-700" />
          </div>

          {data.fees.length === 0 ? (
            <CenteredText text="No fee structure found." />
          ) : (
            <div className="mt-5 overflow-x-auto rounded-md border">
              <div className="min-w-[780px]">
                <div className="grid grid-cols-[1fr_140px_140px_140px_140px] bg-slate-50 px-4 py-3 text-sm font-semibold text-gray-600">
                  <span>Fee</span>
                  <span>Amount</span>
                  <span>Paid</span>
                  <span>Due Date</span>
                  <span>Status</span>
                </div>
                {data.fees.map((fee) => {
                  const paid = paidForFee(fee, paymentRows);
                  const balance = Math.max(Number(fee.amount) - paid, 0);
                  return (
                    <div key={fee.id} className="grid grid-cols-[1fr_140px_140px_140px_140px] border-t px-4 py-3 text-sm">
                      <span>
                        <span className="font-semibold">{fee.fee_type}</span>
                        {fee.description ? <span className="mt-1 block text-xs text-gray-500">{fee.description}</span> : null}
                      </span>
                      <span>{money(fee.amount)}</span>
                      <span>{money(paid)}</span>
                      <span>{fee.due_date ?? "-"}</span>
                      <span className={balance > 0 ? "font-medium text-red-700" : "font-medium text-green-700"}>
                        {balance > 0 ? `${money(balance)} due` : "Paid"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-md border bg-white p-5">
          <h2 className="text-xl font-semibold">Payment History</h2>
          {paymentRows.length === 0 ? (
            <CenteredText text="No payments recorded." />
          ) : (
            <div className="mt-5 space-y-3">
              {paymentRows.map((payment) => (
                <div key={payment.id} className="rounded-md border px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">{payment.fee_type ?? "Fee Payment"}</div>
                      <div className="mt-1 text-sm text-gray-500">{payment.payment_date}</div>
                    </div>
                    <div className="font-semibold text-green-700">{money(payment.amount_paid)}</div>
                  </div>
                  {payment.reference ? <div className="mt-2 text-xs text-gray-500">{payment.reference}</div> : null}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Online payment gateway is not connected in this codebase yet. Recorded payments appear here after the school office updates them.
      </div>
    </div>
  );
}

function SummaryCard({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "red" }) {
  return (
    <div className="rounded-md border bg-white p-5">
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className={`mt-2 text-2xl font-semibold ${tone === "red" ? "text-red-700" : "text-gray-900"}`}>{value}</div>
    </div>
  );
}
