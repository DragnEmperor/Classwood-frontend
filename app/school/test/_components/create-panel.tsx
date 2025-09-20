"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AiFillFileExcel } from "react-icons/ai";
import { clientFetch, clientFetchPage } from "@/lib/client-api";
import type { Classroom, Exam, Student, Subject } from "@/types/api";
import { useToast } from "@/app/_components/toast-provider";
import {classLabel} from "@/lib/utils";
import CenteredText from "@/app/_components/centered-text";
import Loading from "@/app/_components/loader";
import Field from "@/app/_components/field";
import PaginationControls from "@/app/_components/pagination";

const STUDENTS_PAGE_SIZE = 20;

export default function CreateExamPanel({ onCreated, scope = "school" }: { onCreated: () => void; scope?: "school" | "staff" }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [classroomId, setClassroomId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [tag, setTag] = useState("");
  const [date, setDate] = useState("");
  const [maxMarks, setMaxMarks] = useState("100");
  const [description, setDescription] = useState("");
  const [resultMode, setResultMode] = useState<"manual" | "csv">("manual");
  const [scores, setScores] = useState<Record<string, string>>({});
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [studentsPage, setStudentsPage] = useState(1);

  const classroomQueryKey = scope === "staff" ? ["staff", "classrooms"] : ["classrooms"];
  const classroomQueryUrl = scope === "staff" ? "staff/classroom/" : "list/classroom/";

  const classroomsQuery = useQuery({
    queryKey: classroomQueryKey,
    queryFn: () => clientFetchPage<Classroom>(classroomQueryUrl, { pageSize: 100 }),
  });
  const classrooms = classroomsQuery.data?.results ?? [];
  const selectedClassroomId = classroomId || classrooms[0]?.id || "";

  useEffect(() => {
    setStudentsPage(1);
  }, [selectedClassroomId]);

  const subjectsQuery = useQuery({
    queryKey: ["subjects", selectedClassroomId],
    queryFn: () => clientFetchPage<Subject>(`staff/subject/?classroom=${selectedClassroomId}`, { pageSize: 100 }),
    enabled: Boolean(selectedClassroomId),
  });
  const subjects = subjectsQuery.data?.results ?? [];

  const studentsQuery = useQuery({
    queryKey: ["students", selectedClassroomId, studentsPage, STUDENTS_PAGE_SIZE],
    queryFn: () => clientFetchPage<Student>(`staff/student/?classroom=${selectedClassroomId}`, { page: studentsPage, pageSize: STUDENTS_PAGE_SIZE }),
    enabled: Boolean(selectedClassroomId),
  });
  const students = studentsQuery.data?.results ?? [];

  const createMutation = useMutation({
    mutationFn: async () => {
      const finalClassroom = selectedClassroomId;
      const finalSubject = subjectId || subjects[0]?.id || "";
      const total = Number(maxMarks);
      if (!finalClassroom || !finalSubject) throw new Error("Select class and subject");
      if (!tag.trim() || !date || !total) throw new Error("Complete exam details");

      const examResponse = await clientFetch<{ message: string; data: Exam }>("staff/exam/", {
        method: "POST",
        body: {
          tag: tag.trim(),
          date_of_exam: date,
          max_marks: total,
          classroom: finalClassroom,
          subject: finalSubject,
          description: description.trim(),
        },
      });
      const exam = examResponse.data;

      if (resultMode === "csv") {
        if (!csvFile) throw new Error("Select a result CSV");
        const formData = new FormData();
        formData.append("exam", exam.id);
        formData.append("classroom", finalClassroom);
        formData.append("csv_file", csvFile);
        await clientFetch("staff/result/", { method: "POST", body: formData });
      } else {
        const entries = students.filter((student) => scores[String(student.user.id)] !== undefined && scores[String(student.user.id)] !== "");
        if (!entries.length) throw new Error("Enter marks for at least one student.");
        for (const student of entries) {
          await clientFetch("staff/result/", {
            method: "POST",
            body: {
              exam: exam.id,
              student: student.user.id,
              score: Number(scores[String(student.user.id)]),
            },
          });
        }
      }

      return exam;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["exams"] }),
        queryClient.invalidateQueries({ queryKey: ["results"] }),
      ]);
      toast.success("Exam saved successfully");
      onCreated();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to save exam"),
  });
  const classroomNotFoundText = scope === "staff" ? "You are not assigned to any classroom yet." : "Please create a classroom first.";
  if (classroomsQuery.isPending) return <Loading />;
  if (!classrooms.length) return <CenteredText text={classroomNotFoundText} />;

  return (
    <div className="mt-8 rounded-md border bg-white p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Class">
          <select value={selectedClassroomId} onChange={(event) => { setClassroomId(event.target.value); setSubjectId(""); setScores({}); }} className="input">
            {classrooms.map((classroom) => <option key={classroom.id} value={classroom.id}>{classLabel(classroom)}</option>)}
          </select>
        </Field>
        <Field label="Subject">
          <select value={subjectId || subjects[0]?.id || ""} onChange={(event) => setSubjectId(event.target.value)} className="input">
            {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
          </select>
        </Field>
        <Field label="Exam Name">
          <input value={tag} onChange={(event) => setTag(event.target.value)} className="input" placeholder="Half yearly, Unit test, etc." />
        </Field>
        <Field label="Exam Date">
          <input value={date} onChange={(event) => setDate(event.target.value)} type="date" className="input" />
        </Field>
        <Field label="Total Marks">
          <input value={maxMarks} onChange={(event) => setMaxMarks(event.target.value)} type="number" min={1} className="input" />
        </Field>
        <Field label="Description">
          <input value={description} onChange={(event) => setDescription(event.target.value)} className="input" placeholder="Optional" />
        </Field>
      </div>

      <div className="mt-8 border-t pt-5">
        <div className="flex w-fit rounded-md bg-slate-100 p-1">
          <button type="button" onClick={() => setResultMode("manual")} className={`rounded-md px-4 py-2 font-medium ${resultMode === "manual" ? "bg-white" : "text-gray-600"}`}>
            Manual Marks
          </button>
          <button type="button" onClick={() => setResultMode("csv")} className={`rounded-md px-4 py-2 font-medium ${resultMode === "csv" ? "bg-white" : "text-gray-600"}`}>
            CSV Upload
          </button>
        </div>

        {resultMode === "csv" ? (
          <div className="mt-5">
            <a href="/Test-Result.csv" download className="inline-flex items-center rounded-md border border-dashed border-indigo-300 px-4 py-2 font-medium text-indigo-700 hover:bg-indigo-50">
              <AiFillFileExcel className="mr-2" />
              Download Example
            </a>
            <label className="mt-4 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center hover:bg-gray-100">
              <span className="font-semibold text-gray-600">{csvFile ? csvFile.name : "Click to upload result CSV"}</span>
              <span className="mt-1 text-xs text-gray-500">CSV format only</span>
              <input type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => setCsvFile(event.target.files?.[0] ?? null)} />
            </label>
          </div>
        ) : studentsQuery.isPending ? (
          <CenteredText text="Loading students..." />
        ) : students.length === 0 ? (
          <CenteredText text="No students in this class." />
        ) : (
          <div className="mt-5 overflow-x-auto rounded-md border">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[120px_1fr_180px_140px] bg-slate-50 px-4 py-3 text-sm font-semibold text-gray-600">
                <span>Roll No</span>
                <span>Student</span>
                <span>Obtained Marks</span>
                <span>Percentage</span>
              </div>
              {students.map((student) => {
                const key = String(student.user.id);
                const score = scores[key] ?? "";
                const percentage = score && Number(maxMarks) ? Math.round((Number(score) / Number(maxMarks)) * 100) : "";
                return (
                  <div key={key} className="grid grid-cols-[120px_1fr_180px_140px] border-t px-4 py-3 text-sm">
                    <span className="font-semibold">{student.roll_no}</span>
                    <span>{student.first_name} {student.last_name}</span>
                    <input value={score} type="number" min={0} max={Number(maxMarks) || undefined} onChange={(event) => setScores((current) => ({ ...current, [key]: event.target.value }))} className="input py-1" />
                    <span>{percentage !== "" ? `${percentage}%` : "-"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {resultMode === "manual" ? (
          <div className="mt-4">
            <PaginationControls
              page={studentsPage}
              pageSize={STUDENTS_PAGE_SIZE}
              total={studentsQuery.data?.count ?? 0}
              isLoading={studentsQuery.isFetching}
              onPageChange={setStudentsPage}
            />
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex justify-end border-t pt-5">
        <button type="button" disabled={createMutation.isPending} onClick={() => createMutation.mutate()} className="rounded-md bg-indigo-600 px-5 py-2 font-medium text-white disabled:opacity-60">
          {createMutation.isPending ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
