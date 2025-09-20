"use client";

import { useState } from "react";
import type { Exam } from "@/types/api";
import CreateExamPanel from "./_components/create-panel";
import PastExamsPanel from "./_components/past-panel";
import ExamResultsDrawer from "./_components/drawer";

export default function ExamTestPage() {
  const [mode, setMode] = useState<"create" | "past">("create");
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  return (
    <div className="px-4 py-8 md:px-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-semibold">Exam and Test</h1>
        <div className="flex w-fit rounded-md bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode("create")}
            className={`rounded-md px-4 py-2 font-medium ${mode === "create" ? "bg-white" : "text-gray-600"}`}
          >
            Add Results
          </button>
          <button
            type="button"
            onClick={() => setMode("past")}
            className={`rounded-md px-4 py-2 font-medium ${mode === "past" ? "bg-white" : "text-gray-600"}`}
          >
            Past Exams
          </button>
        </div>
      </div>

      {mode === "create" ? <CreateExamPanel onCreated={() => setMode("past")} /> : <PastExamsPanel onOpen={setSelectedExam} />}

      {selectedExam ? <ExamResultsDrawer exam={selectedExam} onClose={() => setSelectedExam(null)} /> : null}
    </div>
  );
}
