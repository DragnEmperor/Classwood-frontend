export type UserType = "School" | "Staff" | "Student";

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
  id: number;
  class_name: string;
  section?: string;
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
  total_fees: string;
  total_paid: string;
  pending: string;
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
