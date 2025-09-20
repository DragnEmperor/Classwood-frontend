# Classwood Frontend

Classwood Frontend is the Next.js application for Classwood, a school management platform that gives schools, staff, and students separate role-based workspaces. It replaces the legacy React/Redux frontend with a Next.js App Router application using TypeScript, Tailwind CSS, React Query, and cookie-based authentication.

The app connects to the Django REST Framework [backend](https://github.com/DragnEmperor/Classwood-DRF)

## What The Application Does

Classwood centralizes common school operations:

- School administrators manage dashboards, classrooms, staff, students, attendance, fees, timetable, syllabus, exams, notices, events, sessions, and profile details.
- Staff users see assigned classrooms, student lists, attendance marking, timetable, syllabus uploads, and exam/result workflows.
- Student users see their dashboard, subjects, syllabus, marks, fee structure, payment history, notices, events, and profile details.
- Public users can access the landing page, login, registration, forgot password, and OTP verification flows.

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- TanStack React Query
- Headless UI
- React Icons
- Django REST Framework backend

## Authentication And API Flow

Authentication is handled through Next.js API routes and HTTP-only cookies.

- `app/api/auth/*` handles login, logout, signup, forgot password, and OTP verification.
- Successful login stores the JWT access token in the `access_token` HTTP-only cookie.
- A browser-readable `auth_state` cookie stores non-sensitive role state such as `userType`.
- `middleware.ts` protects `/school`, `/staff`, and `/student` routes and enforces role-based access.
- Server-side fetches use `lib/api.ts`, which reads the HTTP-only token from cookies.
- Client-side React Query calls use `lib/client-api.ts`, which calls `/api/backend/*`.
- `app/api/backend/[...path]/route.ts` proxies browser requests to DRF while keeping tokens out of browser JavaScript.

## Main Routes

### Public

| Route | Purpose |
|---|---|
| `/` | Classwood landing page |
| `/login` | Login |
| `/register` | School signup |
| `/forgot-password` | Password reset request |

### School

| Route | Purpose |
|---|---|
| `/school/dashboard` | School overview, notices, events, thought of the day, fee summary |
| `/school/classroom` | Classroom, subject, student, and CSV upload management |
| `/school/staff` | Staff directory, staff forms, staff CSV upload |
| `/school/attendance` | Student attendance workflows |
| `/school/fees` | Fee structure, payment recording, collection status |
| `/school/timetable` | Timetable and common time slots |
| `/school/syllabus` | Syllabus upload and browsing |
| `/school/test` | Exam/test creation, CSV/manual result upload, past results |

### Staff

| Route | Purpose |
|---|---|
| `/staff/dashboard` | Staff overview and assigned work |
| `/staff/classroom` | Assigned classrooms, students, attendance marking |
| `/staff/timetable` | Read-only assigned class timetable |
| `/staff/syllabus` | Staff syllabus viewing/upload |
| `/staff/test` | Exam/test result upload and past results |

### Student

| Route | Purpose |
|---|---|
| `/student/dashboard` | Student overview, subjects, results, fees, notices, events |
| `/student/subject` | Subjects and syllabus |
| `/student/test` | Uploaded marks and result summary |
| `/student/fees` | Fee structure, payment history, balance due |
| `/student/message` | Placeholder route; no real messaging API exists yet |

## Project Layout

```text
app/
  api/
    auth/                  # Next auth proxy routes
    backend/[...path]/     # Authenticated browser-to-DRF proxy
  _components/             # Shared UI primitives
  school/                  # School-admin workspace
  staff/                   # Staff workspace
  student/                 # Student workspace
  login/ register/         # Public auth screens
lib/
  api.ts                   # Server-side DRF fetch helper
  client-api.ts            # Browser-safe proxy fetch helper
  auth.ts                  # Cookie session helpers
  react-query.ts           # Query client setup
  utils.ts constants.ts    # Shared helpers/constants
types/
  api.ts                   # Shared API response types
public/
  assets/                  # Images and static assets
  Test-*.csv               # CSV examples for uploads
middleware.ts              # Role-based route protection
```

## Environment

Create `.env.local` from `.env.example`:

```sh
cp .env.example .env.local
```

Default values:

```env
API_URL=http://127.0.0.1:8000/api/
NEXT_PUBLIC_APP_URL=http://localhost:3000
COOKIE_SECURE=false
```

Set `COOKIE_SECURE=true` in production when serving over HTTPS.

## Setup

Install dependencies:

```sh
npm install
```

Start the Django [backend](https://github.com/DragnEmperor/Classwood-DRF), then start the frontend:

```sh
npm run dev
```

The frontend normally runs at:

```text
http://localhost:3000
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start local Next.js dev server |
| `npm run build` | Production build and route validation |
| `npm run start` | Serve the production build |
| `npm run lint` | Run Next lint integration |
| `npm run typecheck` | Run `tsc --noEmit` |


## Known Gaps

- Student messaging is a route-level placeholder because the backend has no messaging API yet.
- Payment gateway integration is not present; school users can record payments and students can view fee/payment status.
- Staff image warnings can be resolved by replacing remaining `<img>` tags with `next/image`.

## Migration Notes

This application is migrated from the legacy React/Redux code under `_legacy_src`. The current implementation favors:

- Next.js App Router routes instead of React Router.
- React Query for client data and mutations.
- Shared typed API shapes in `types/api.ts`.
- HTTP-only token storage instead of browser `localStorage`.
- Role-scoped layouts and sidebars for school, staff, and student users.
