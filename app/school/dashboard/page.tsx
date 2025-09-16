import Image from "next/image";
import Link from "next/link";
import { AiOutlineBarChart } from "react-icons/ai";
import { apiFetch, ApiError } from "@/lib/api";
import { FeesPieChart } from "./fees-pie-chart";
import { ThoughtOfTheDay } from "./thought-of-the-day";
import type {
  StudentSummary,
  StaffSummary,
  Classroom,
  FeeSummary,
  PaymentsResponse,
  ThoughtOfTheDay as ThoughtOfTheDayType,
} from "@/types/api";

export const dynamic = "force-dynamic";

interface CountTotals {
  students: number;
  staff: number;
  classes: number;
}

interface PresentTotals {
  students: number;
  teachingStaff: number;
  nonTeachingStaff: number;
}

function safeFetch<T>(path: string, fallback: T): Promise<T> {
  return apiFetch<T>(path).catch((err) => {
    if (err instanceof ApiError) console.warn(`[dashboard] ${path} -> ${err.status}`);
    else console.warn(`[dashboard] ${path} failed`, err);
    return fallback;
  });
}

function aggregatePresence(
  students: StudentSummary[],
  staff: StaffSummary[],
  todayIndex: number,
): PresentTotals {
  const studentsPresent = students.reduce(
    (sum, s) => sum + (s.month_attendance?.[todayIndex] === 2 ? 1 : 0),
    0,
  );
  const teachingPresent = staff.reduce(
    (sum, s) =>
      sum + (s.isTeachingStaff && s.month_attendance?.[todayIndex] === 2 ? 1 : 0),
    0,
  );
  const nonTeachingPresent = staff.reduce(
    (sum, s) =>
      sum + (!s.isTeachingStaff && s.month_attendance?.[todayIndex] === 2 ? 1 : 0),
    0,
  );
  return {
    students: studentsPresent,
    teachingStaff: teachingPresent,
    nonTeachingStaff: nonTeachingPresent,
  };
}

export default async function SchoolDashboardPage() {
  const todayIndex = new Date().getDate() - 1;

  const [students, staff, classrooms, feeSummary, paymentsData, thoughts] =
    await Promise.all([
      safeFetch<StudentSummary[]>("list/students/", []),
      safeFetch<StaffSummary[]>("list/staff/", []),
      safeFetch<Classroom[]>("list/classroom/", []),
      safeFetch<FeeSummary | null>("list/fees/?summary=true", null),
      safeFetch<PaymentsResponse>("list/payments/?limit=10", { payments: [] }),
      safeFetch<ThoughtOfTheDayType[]>("list/thoughtDay/", []),
    ]);

  const totals: CountTotals = {
    students: students.length,
    staff: staff.length,
    classes: classrooms.length,
  };
  const presence = aggregatePresence(students, staff, todayIndex);
  const recentPayments = paymentsData.payments ?? [];
  const latestThought = thoughts.length ? thoughts[thoughts.length - 1].content : "";

  return (
    <div className="my-10 flex flex-col md:px-10 min-[1200px]:flex-row min-[1200px]:px-0">
      <div className="w-full min-[1200px]:ml-10 xl:w-3/5 2xl:mx-10 2xl:w-2/3 2xl:pl-0">
        <span className="mb-4 text-3xl font-semibold">Dashboard</span>

        <div className="mt-4 w-full rounded-lg p-3 shadow-lg">
          <div className="flex justify-between">
            <StatCard
              href="/school/students"
              bg="bg-[#FBF0FD]"
              img="/assets/schoolStudent.png"
              count={totals.students}
              label="Total Student"
            />
            <StatCard
              href="/school/staff"
              bg="bg-[#FDF9F0]"
              img="/assets/schoolStaff.png"
              count={totals.staff}
              label="Total Staff"
            />
            <StatCard
              href="/school/classroom"
              bg="bg-[#F0F7FD]"
              img="/assets/schoolClasses.png"
              count={totals.classes}
              label="Total Classes"
            />
            <StatCard
              bg="bg-[#F0FDF0]"
              img="/assets/schoolAchivement.png"
              count={0}
              label="Total Achivements"
            />
          </div>

          <ThoughtOfTheDay initial={latestThought} />
        </div>

        <div className="mt-10 flex flex-row">
          <Link
            href="/school/fees"
            className="mb-8 flex w-3/5 flex-col rounded-xl px-6 py-4 shadow-md"
          >
            <span className="flex border-b pb-2 text-xl font-semibold">Fee Management</span>
            <div className="flex flex-row">
              <div className="w-full">
                <div className="flex h-full w-full flex-col items-center justify-center p-4">
                  <FeesPieChart summary={feeSummary} />
                </div>
              </div>
              <div className="flex w-2/5 flex-col items-start justify-center">
                <FeeStat label="Total Fees" dot="#818CF8" value={feeSummary?.total_fees} />
                <FeeStat label="Fee Submitted" dot="#2DD4BF" value={feeSummary?.total_paid} />
                <FeeStat label="Fee Pending" dot="#F59E0B" value={feeSummary?.pending} />
              </div>
            </div>
          </Link>

          <div className="mx-4 h-fit w-2/5 rounded-xl p-4 shadow-md">
            <span className="flex border-b pb-2 text-xl font-semibold">
              Attendence Management
            </span>
            <div className="flex flex-col pt-4">
              <PresentRow label="Present Student" value={presence.students} />
              <PresentRow label="Present Teaching Staff" value={presence.teachingStaff} />
              <PresentRow label="Present Non Teaching Staff" value={presence.nonTeachingStaff} />
            </div>
          </div>
        </div>

        <div className="mt-10 h-auto w-full bg-gray-200 p-6 md:rounded-[30px]">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="flex-1 text-center text-2xl md:text-4xl">Payment History</h1>
          </div>
          <div className="mt-4 grid grid-cols-4">
            {["Serial", "Student Name", "Amount", "Date"].map((h) => (
              <div
                key={h}
                className="text-md py-3 text-center font-bold uppercase text-gray-700 lg:text-lg"
              >
                {h}
              </div>
            ))}
            {recentPayments.length > 0 ? (
              recentPayments.map((p, idx) => (
                <PaymentRow key={p.id} index={idx} payment={p} />
              ))
            ) : (
              <div className="col-span-4 px-6 py-4 text-center">No Payment History Found</div>
            )}
          </div>
        </div>
      </div>

      <div className="my-10 w-full px-10 xl:w-2/5 2xl:w-1/3 min-[1200px]:my-0 min-[1200px]:mx-10 min-[1200px]:px-0">
        <PlaceholderPanel title="Notices" />
        <PlaceholderPanel title="Events" />
      </div>
    </div>
  );
}

function StatCard({
  href,
  bg,
  img,
  count,
  label,
}: {
  href?: string;
  bg: string;
  img: string;
  count: number;
  label: string;
}) {
  const inner = (
    <>
      <Image src={img} alt="" width={64} height={64} className="my-2" />
      <span className="text-xl font-semibold">{count}</span>
      <span className="text-sm">{label}</span>
    </>
  );
  const className = `flex w-[22%] cursor-pointer flex-col items-center justify-center rounded-lg ${bg} px-4 py-4`;
  return href ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}

function FeeStat({ label, dot, value }: { label: string; dot: string; value?: string }) {
  return (
    <div className="mb-6 flex flex-col">
      <span className="flex items-center justify-center text-gray-600">
        <span
          className="mr-2 h-4 w-4 rounded-full"
          style={{ backgroundColor: dot }}
        />
        {label}
      </span>
      <span className="ml-6 text-xl font-bold">Rs {value ?? "0"}</span>
    </div>
  );
}

function PresentRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="mb-5 flex flex-col">
        <span className="text-gray-500">{label}</span>
        <span className="text-xl font-semibold">{value}</span>
      </div>
      <AiOutlineBarChart className="h-6 w-6 text-[#2dd480]" />
    </div>
  );
}

function PaymentRow({
  index,
  payment,
}: {
  index: number;
  payment: { id: number; student_name: string; amount_paid: string; payment_date: string };
}) {
  return (
    <>
      <div className="px-6 py-4 text-center">{index + 1}</div>
      <div className="px-6 py-4 text-center">{payment.student_name}</div>
      <div className="px-6 py-4 text-center">Rs {payment.amount_paid}</div>
      <div className="px-6 py-4 text-center">
        {new Date(payment.payment_date).toLocaleDateString()}
      </div>
    </>
  );
}

function PlaceholderPanel({ title }: { title: string }) {
  return (
    <div className="mb-6 rounded-xl bg-white p-6 shadow-md">
      <h3 className="border-b pb-2 text-lg font-semibold">{title}</h3>
      <p className="mt-4 text-sm text-gray-500">
        {title} panel rebuild scheduled for Phase 3.2.
      </p>
    </div>
  );
}
