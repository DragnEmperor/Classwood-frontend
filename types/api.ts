export type UserType = "School" | "Staff" | "Student";
export type TimeString = `${number}${number}:${number}${number}:${number}${number}`;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user_type: UserType;
  tokens: {
    access: string;
    refresh: string;
  };
  message?: string;
}

export interface Account {
  id: number;
  email: string;
  school_name?: string;
  is_paid?: boolean;
}

export interface SessionRecord {
  id: number;
  year: string;
  is_active: boolean;
}

export interface Classroom {
  id: string;
  class_name: string;
  section_name: string;
  section?: string;
  class_teacher?: string;
  sub_class_teacher?: string;
  teachers?: string[];
  strength?: string | number;
  no_of_subjects?: string | number;
  no_of_teachers?: string | number;
  school?: string | number;
}

export interface StudentSummary {
  user: number;
  first_name: string;
  last_name: string;
  roll_no: string;
  /** 0 = no record, 1 = absent, 2 = present, one entry per day of the current month */
  month_attendance: number[];
}

export interface StaffSummary {
  user: number;
  first_name: string;
  last_name: string;
  isTeachingStaff: boolean;
  month_attendance: number[];
}

export interface FeeSummary {
  total_fees: number;
  total_paid: number;
  pending: number;
}

export interface Payment {
  id: number;
  student_name: string;
  amount_paid: string;
  payment_date: string;
}

export interface PaymentsResponse {
  payments: Payment[];
}

export interface ThoughtOfTheDay {
  id?: number;
  content: string;
  date: string;
}

export interface Notice {
  id: number;
  title: string;
  description: string;
  date_posted: string;
  posted_by?: string;
}

export interface SchoolEvent {
  id: number;
  title: string;
  description: string;
  date: string;
}

export interface AccountProfile extends Account {
  school_logo_url?: string;
}

export interface PaginatedResponse<T>{
  count: number
  next: string | null
  previous: string | null
  results : T[]
}

export interface Subject {
  id: string;
  name: string;
  teacher: string;
  teacher_id: string | number | null;
  classroom?: string;
  classroom_name?: string;
}

export interface Staff {
  user: {
    id: string | number;
    email: string;
  };
  first_name: string;
  last_name: string;
  school?: string | number;
  is_teaching_staff?: boolean;
  profile_pic?: string | null;
  profile_pic_url?: string | null;
  date_of_birth?: string | null;
  gender?: string;
  mobile_number?: string;
  contact_email?: string | null;
  address?: string;
  account_no?: string;
  ifsc_code?: string;
  is_class_teacher?: boolean;
  date_of_joining?: string;
  staff_id?: string | null;
  incharge_of?: string | null;
  sub_incharge_of?: string[];
  total_attendance?: number;
  month_attendance?: number[];
  year_attendance?: number[];
}

export interface Student {
  user: {
    id: string | number;
    email: string;
  };
  first_name: string;
  last_name: string;
  roll_no: string;
  admission_no: string;
  gender: string;
  classroom: string;
  month_attendance: number[];
}

export interface TimeTable {
  id: string;
  start_time: TimeString;
  end_time: TimeString;
  subject: string | null;
  classroom: string;
  day: string;
  teacher: string | number | null;
}

export interface CommonTime {
  id: string;
  start_time: TimeString;
  end_time: TimeString;
  subject: string;
  classroom: string;
}
