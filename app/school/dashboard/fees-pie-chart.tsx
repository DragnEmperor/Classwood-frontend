"use client";

import { PieChart } from "react-minimal-pie-chart";
import type { FeeSummary } from "@/types/api";

export function FeesPieChart({ summary }: { summary: FeeSummary | null }) {
  const paid = summary ? Number.parseFloat(summary.total_paid) : 0;
  const pending = summary ? Number.parseFloat(summary.pending) : 0;
  const total = summary ? Number.parseFloat(summary.total_fees) : 100;

  return (
    <PieChart
      data={[
        { title: "Paid", value: paid, color: "#2DD4BF" },
        { title: "Pending", value: pending, color: "#F59E0B" },
      ]}
      lengthAngle={360}
      lineWidth={10}
      startAngle={180}
      totalValue={total > 0 ? total : 100}
      rounded
      animate
      background="#818CF8"
    />
  );
}
