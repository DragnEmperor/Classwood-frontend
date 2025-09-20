import { AiOutlineUserAdd , AiFillFileExcel} from "react-icons/ai";
import { BsBriefcase } from "react-icons/bs";
import { FiEdit2, FiX } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdClass, MdOutlineSchool } from "react-icons/md";
import { clientFetchPage } from "@/lib/client-api";
import { classLabel } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { Classroom, Student, Subject } from "@/types/api";

export default function ClassroomDetailsDrawer({
  classroom,
  onClose,
  onEdit,
  onAddSubject,
  onAddStudent,
  onUploadStudents,
  onViewStudents,
}: {
  classroom: Classroom;
  onClose: () => void;
  onEdit: () => void;
  onAddSubject: () => void;
  onAddStudent: () => void;
  onUploadStudents: () => void;
  onViewStudents: () => void;
}) {
  const subjectsQuery = useQuery({
    queryKey: ["subjects", classroom.id],
    queryFn: () =>
      clientFetchPage<Subject>(`staff/subject/?classroom=${classroom.id}`, { pageSize: 100 }),
  });
  const studentsQuery = useQuery({
    queryKey: ["students", classroom.id],
    queryFn: () =>
      clientFetchPage<Student>(`staff/student/?classroom=${classroom.id}`, { pageSize: 1 }),
  });

  const subjects = subjectsQuery.data?.results ?? [];

  return (
    <div className="fixed inset-0 z-40 bg-black/30">
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-xl">
        <div className="relative border-b px-6 py-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute left-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            aria-label="Close class details"
          >
            <FiX />
          </button>
          <h2 className="mt-10 text-center text-3xl font-semibold">{classLabel(classroom)}</h2>
        </div>

        <div className="flex-1 px-6 py-5">
          <div className="grid grid-cols-2 gap-4 border-b pb-5">
            <InfoCard icon={<BsBriefcase />} label="Class Teacher" value={classroom.class_teacher ?? "Not assigned"} />
            <InfoCard icon={<MdOutlineSchool />} label="Total Students" value={classroom.strength ?? 0} />
          </div>

          <section className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800">Students</h3>
            <div className="mt-3 space-y-3 text-sm font-semibold text-gray-500">
              <div className="flex items-center justify-between rounded-md bg-indigo-50 px-4 py-3">
                <span>Total Students</span>
                <span>{studentsQuery.data?.count ?? classroom.strength ?? 0}</span>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800">Subject Detail</h3>
            {subjectsQuery.isPending ? (
              <div className="mt-4 text-gray-500">Loading subjects...</div>
            ) : subjects.length === 0 ? (
              <div className="mt-4 text-gray-500">No subjects added.</div>
            ) : (
              <div className="mt-3 space-y-2">
                {subjects.map((subject) => (
                  <div key={subject.id} className="flex items-center rounded-md px-3 py-2 hover:bg-gray-50">
                    <MdClass className="mr-4 h-7 w-7 text-indigo-700" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-600">{subject.name}</span>
                      <span className="text-sm text-gray-500">{subject.teacher}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="border-t px-6 py-5">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center justify-center rounded-md border border-indigo-500 px-4 py-2 font-medium text-indigo-600 hover:bg-indigo-50"
            >
              <FiEdit2 className="mr-2" />
              Edit
            </button>
            <button
              type="button"
              onClick={onAddSubject}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
            >
              <IoMdAddCircleOutline className="mr-2" />
              Add Subject
            </button>
          </div>
          <button
            type="button"
            onClick={onAddStudent}
            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
          >
            <AiOutlineUserAdd className="mr-2" />
            Add Student
          </button>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onUploadStudents}
              className="inline-flex items-center justify-center rounded-md border border-indigo-500 px-4 py-2 font-medium text-indigo-600 hover:bg-indigo-50"
            >
              <AiFillFileExcel className="mr-2" />
              Upload CSV
            </button>
            <button
              type="button"
              onClick={onViewStudents}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              View Students
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col rounded-md bg-slate-50 p-4">
      <span className="mb-2 text-2xl text-indigo-600">{icon}</span>
      <span className="mb-2 font-semibold">{label}</span>
      <span className="text-gray-600">{value}</span>
    </div>
  );
}
