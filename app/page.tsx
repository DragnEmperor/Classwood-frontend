import Image from "next/image";
import Link from "next/link";
import {
  AiOutlineBank,
  AiOutlineCalendar,
  AiOutlineCheck,
  AiOutlineCreditCard,
  AiOutlineFileText,
  AiOutlineRead,
  AiOutlineSchedule,
} from "react-icons/ai";
import { getSession } from "@/lib/auth";

const heroImage =
  "https://images.unsplash.com/photo-1584697964156-deca98e4439d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&q=85";

const services = [
  {
    title: "Fee Management",
    description: "Create fee structures, record payments, apply concessions, and track pending balances.",
    Icon: AiOutlineCreditCard,
  },
  {
    title: "Classroom Operations",
    description: "Manage classes, subjects, class teachers, student lists, and student CSV uploads.",
    Icon: AiOutlineBank,
  },
  {
    title: "Attendance",
    description: "Mark daily staff and student attendance with clear present, absent, and pending views.",
    Icon: AiOutlineCalendar,
  },
  {
    title: "Timetable",
    description: "Build class timetables with regular periods and common slots such as recess or assemblies.",
    Icon: AiOutlineSchedule,
  },
  {
    title: "Exam and Test",
    description: "Create exams, upload marks manually or by CSV, and publish results to students.",
    Icon: AiOutlineFileText,
  },
  {
    title: "Syllabus",
    description: "Share syllabus records and attachments with staff and students in the active session.",
    Icon: AiOutlineRead,
  },
];

const steps = [
  {
    label: "Step 1",
    title: "Register your institute",
    description: "Create the school account and start the active academic session.",
  },
  {
    label: "Step 2",
    title: "Create staff and classes",
    description: "Add teachers, classrooms, subjects, and students from forms or CSV files.",
  },
  {
    label: "Step 3",
    title: "Run daily workflows",
    description: "Publish timetables, mark attendance, collect fees, and share exam results.",
  },
];

const offerings = [
  "Share timetables, notices, notes, syllabus, and exam results with students.",
  "Upload student and staff records with CSV examples for faster onboarding.",
  "Store attendance, classroom, staff, student, and fee records in one place.",
  "Send parents clearer fee status through recorded payments and balances.",
  "Give staff and students role-specific dashboards instead of one shared admin view.",
  "Keep the current academic session separate from older school data.",
];

function dashboardPath(userType?: string) {
  if (!userType) return "/login";
  return `/${userType.toLowerCase()}/dashboard`;
}

export default async function HomePage() {
  const session = await getSession();
  const dashboardHref = dashboardPath(session?.userType);

  return (
    <main className="bg-white text-gray-950">
      <header className="fixed left-0 right-0 top-0 z-30 border-b border-white/20 bg-black/50 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/assets/CLASSWOOD_Logo.png" width={150} height={24} alt="Classwood" priority />
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-white/85 md:flex">
            <a href="#services" className="hover:text-white">
              Features
            </a>
            <a href="#process" className="hover:text-white">
              Process
            </a>
            <a href="#about" className="hover:text-white">
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {session ? (
              <Link href={dashboardHref} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-gray-100">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden rounded-md border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 sm:inline-flex">
                  Login
                </Link>
                <Link href="/register" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-gray-100">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section
        className="relative flex min-h-[76svh] items-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">Classwood</p>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl">
              Integrated School Platform
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-xl">
              A multi-role application for schools to manage classrooms, staff, students, attendance, fees, timetable, syllabus, and exam results from one place.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={session ? dashboardHref : "/register"} className="inline-flex justify-center rounded-md bg-amber-400 px-6 py-3 font-semibold text-gray-950 hover:bg-amber-300">
                {session ? "Open dashboard" : "Get started"}
              </Link>
              <a href="#services" className="inline-flex justify-center rounded-md border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10">
                Explore features
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6 lg:px-8">
          <Metric value="3" label="Role-specific portals" />
          <Metric value="8+" label="School workflows migrated" />
          <Metric value="CSV" label="Bulk import support" />
        </div>
      </section>

      <section id="process" className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700">Simple setup</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-5xl">
              Simplify institute management in three steps.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.label} className="rounded-md border bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo-700">{step.label}</div>
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700">What we offer</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-5xl">Our Services</h2>
            <p className="mt-4 text-gray-600">
              The migrated app now covers the core school, staff, and student workflows from the legacy React experience.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map(({ title, description, Icon }) => (
              <div key={title} className="rounded-md border bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-amber-100 text-amber-800">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-gray-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">What are we offering</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-5xl">One operating system for everyday school work.</h2>
            <p className="mt-5 text-base leading-8 text-white/70">
              Classwood connects administrators, teachers, and students through dedicated dashboards backed by the same school session data.
            </p>
            <div className="mt-8">
              <Link href={session ? dashboardHref : "/register"} className="inline-flex rounded-md bg-white px-6 py-3 font-semibold text-gray-950 hover:bg-gray-100">
                {session ? "Continue to dashboard" : "Start your school setup"}
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {offerings.map((item) => (
              <div key={item} className="flex gap-3 rounded-md border border-white/10 bg-white/5 p-4">
                <AiOutlineCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-300" />
                <p className="text-sm leading-6 text-white/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-md border bg-slate-50 p-6 md:grid-cols-3 lg:p-10">
          <AudienceCard
            image="/assets/schoolStaff.png"
            title="For staff"
            description="Assigned classes, student attendance, timetable, syllabus, and exam results."
          />
          <AudienceCard
            image="/assets/schoolStudent.png"
            title="For students"
            description="Subjects, syllabus, results, fee balances, notices, and events."
          />
          <AudienceCard
            image="/assets/schoolClasses.png"
            title="For schools"
            description="Centralized management for staff, classes, fees, exams, attendance, and timetables."
          />
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div
          className="mx-auto max-w-7xl rounded-md bg-cover bg-center p-8 text-white lg:p-12"
          style={{ backgroundImage: "linear-gradient(90deg, rgba(0,0,0,.82), rgba(0,0,0,.42)), url(/assets/footer.jpg)" }}
        >
          <h2 className="max-w-3xl text-3xl font-bold sm:text-5xl">Integrated School Platform</h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/80">
            Manage the daily work of your school through a platform that understands admin, staff, and student needs separately.
          </p>
          <div className="mt-8">
            <Link href={session ? dashboardHref : "/register"} className="inline-flex rounded-md bg-amber-400 px-6 py-3 font-semibold text-gray-950 hover:bg-amber-300">
              {session ? "Open dashboard" : "Get started"}
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Image src="/assets/CLASSWOOD_Logo.png" width={150} height={24} alt="Classwood" />
            <p className="mt-4 max-w-md text-sm leading-6 text-white/60">
              A network where schools, teachers, and students connect.
            </p>
          </div>
          <div className="grid gap-8 text-sm sm:grid-cols-3">
            <FooterColumn title="Resources" links={["Features", "Help"]} />
            <FooterColumn title="Company" links={["About Us", "Careers"]} />
            <FooterColumn title="Legal" links={["Privacy Policy", "Terms"]} />
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-white/50">
          © 2026 Classwood. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-md border bg-slate-50 px-5 py-4">
      <div className="text-2xl font-bold text-gray-950">{value}</div>
      <div className="mt-1 text-sm text-gray-600">{label}</div>
    </div>
  );
}

function AudienceCard({
  image,
  title,
  description,
}: {
  image: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-md border bg-white p-5">
      <Image src={image} width={56} height={56} alt="" className="h-14 w-14" />
      <h3 className="mt-5 text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-gray-600">{description}</p>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-4 space-y-3 text-white/60">
        {links.map((link) => (
          <li key={link}>
            <a href="#services" className="hover:text-white">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
