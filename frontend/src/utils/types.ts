export type UserRole = 'admin' | 'faculty' | 'student';

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  student_profile?: Student;
  faculty_profile?: Faculty;
}

export interface Student {
  id: number;
  user_id: number;
  user?: User;
  roll_number: string;
  department_id: number;
  department?: Department;
  semester: number;
  section: string;
  admission_year: number;
  date_of_birth?: string;
  address?: string;
  guardian_name?: string;
  guardian_phone?: string;
  full_name?: string;
  email?: string;
}

export interface Faculty {
  id: number;
  user_id: number;
  user?: User;
  employee_id: string;
  department_id: number;
  department?: Department;
  designation: string;
  qualification?: string;
  date_of_joining?: string;
  specialization?: string;
  full_name?: string;
  email?: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  student_count?: number;
  faculty_count?: number;
  created_at: string;
}

export interface Subject {
  id: number;
  code: string;
  name: string;
  department_id: number;
  department?: Department;
  semester: number;
  credits: number;
  faculty_id?: number;
  faculty?: Faculty;
}

export interface TimetableEntry {
  id: number;
  subject_id: number;
  subject?: Subject;
  faculty_id: number;
  faculty?: Faculty;
  department_id: number;
  department?: Department;
  semester: number;
  section: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string;
}

export interface AttendanceRecord {
  id: number;
  student_id: number;
  student?: Student;
  timetable_entry_id: number;
  date: string;
  status: 'present' | 'absent' | 'late';
  marked_by: number;
  created_at: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  category: 'general' | 'academic' | 'event' | 'exam' | 'urgent';
  target_role: 'all' | 'student' | 'faculty';
  department_id?: number;
  author_id: number;
  author?: User;
  is_pinned: boolean;
  published_at: string;
  expires_at?: string;
}

export interface Facility {
  id: number;
  name: string;
  type: 'lab' | 'hall' | 'seminar_room' | 'sports';
  capacity: number;
  location: string;
  description?: string;
  is_available: boolean;
}

export interface FacilityBooking {
  id: number;
  facility_id: number;
  facility?: Facility;
  booked_by: number;
  booker?: User;
  purpose: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approved_by?: number;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface DashboardStats {
  totalStudents: number;
  totalFaculty: number;
  departments: number;
  pendingBookings: number;
}

export interface AttendanceSummary {
  department: string;
  percentage: number;
}

export interface StudentAttendanceStats {
  overall_percentage: number;
  total_classes: number;
  present: number;
  absent: number;
}
