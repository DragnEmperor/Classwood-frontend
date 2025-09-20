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

export interface AccountUser {
  id: string | number;
  email: string;
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
  total_fees: string | number;
  total_paid: string | number;
  pending: string | number;
  paid_percentage?: number;
}

export interface Payment {
  id: string | number;
  student_name: string;
  fee_id?: string | number;
  fee_type?: string;
  fee_amount?: string;
  amount_paid: string;
  payment_date: string;
  payment_mode?: string;
  reference?: string | null;
}

export interface PaymentsResponse {
  payments: Payment[];
  count?: number;
}

export interface FeeCollectionStatus {
  total_students: number;
  fully_paid: number;
  partially_paid: number;
  outstanding: number;
  total_collected: string;
  collection_percentage: number;
}

export interface Fee {
  id: string;
  fee_type: string;
  amount: string;
  className: string;
  classroom_id: string;
  due_date: string | null;
  description: string | null;
  created_at: string;
  student_count: number;
  collection_status: FeeCollectionStatus;
}

export interface StudentFeeItem {
  id: string;
  fee_type: string;
  amount: string;
  className: string;
  due_date: string | null;
  description: string | null;
  created_at: string;
  for_class?: string;
  school?: string | number;
  session?: string | number;
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

export interface SchoolProfile {
  user: AccountUser;
  school_name: string;
  school_phone: string;
  school_address: string;
  school_city: string;
  school_state: string;
  school_zipcode: string;
  school_logo?: string | null;
  school_logo_url?: string | null;
  school_website?: string | null;
  date_of_establishment?: string | null;
  staff_limit?: string;
  student_limit?: string;
  school_board?: string;
  school_affNo?: string;
  school_head?: string | null;
  staff_strength?: number;
  student_strength?: number;
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
  profile_pic?: string | null;
  profile_pic_url?: string | null;
  contact_email?: string | null;
  address?: string;
  father_name?: string;
  mother_name?: string;
  parent_mobile_number?: string;
  subjects?: string[];
  total_attendance?: number;
  month_attendance: number[];
  year_attendance?: Array<{
    month: number;
    attendance_records: Array<{ date: string; present: boolean }>;
  }>;
}

export interface StudentFeesResponse {
  fees: StudentFeeItem[];
  payments: Payment[];
  total_amount: string;
  amount_to_pay: string;
  total_paid: string;
  balance_due: string;
}

export interface Exam {
  id: string;
  tag: string;
  classroom: string;
  classroom_name: string;
  subject: string;
  subject_name: string;
  max_marks: number;
  date_of_exam: string;
  description?: string | null;
  is_complete: boolean;
  attachments?: string[];
}

export interface ExamResult {
  id: string;
  student: string;
  student_name: string;
  exam: string;
  score: number;
  exam_tag?: string;
  subject_name?: string;
  classroom_name?: string;
  max_marks?: number;
  date_of_exam?: string;
  attachments?: string[];
}

export interface Syllabus {
  id: string;
  classroom: string;
  classroom_name: string;
  subject: string;
  subject_name: string;
  tag?: string | null;
  attachments?: string[];
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
