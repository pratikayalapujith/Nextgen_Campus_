import { User, Student, Faculty, Department, Subject, TimetableEntry, Notice, Facility, FacilityBooking } from './types';

export const mockUsers: User[] = [
  { id: 1, email: 'admin@campus.com', full_name: 'Admin User', role: 'admin', is_active: true, created_at: '2024-01-01' },
  { id: 2, email: 'faculty1@campus.com', full_name: 'Dr. Sarah Johnson', role: 'faculty', is_active: true, created_at: '2024-01-01' },
  { id: 3, email: 'faculty2@campus.com', full_name: 'Prof. Michael Chen', role: 'faculty', is_active: true, created_at: '2024-01-01' },
  { id: 4, email: 'faculty3@campus.com', full_name: 'Dr. Emily Davis', role: 'faculty', is_active: true, created_at: '2024-01-01' },
  { id: 5, email: 'faculty4@campus.com', full_name: 'Prof. Robert Wilson', role: 'faculty', is_active: true, created_at: '2024-01-01' },
  { id: 6, email: 'student1@campus.com', full_name: 'Alice Thompson', role: 'student', is_active: true, created_at: '2024-01-01' },
  { id: 7, email: 'student2@campus.com', full_name: 'Bob Martinez', role: 'student', is_active: true, created_at: '2024-01-01' },
  { id: 8, email: 'student3@campus.com', full_name: 'Carol White', role: 'student', is_active: true, created_at: '2024-01-01' },
  { id: 9, email: 'student4@campus.com', full_name: 'David Kim', role: 'student', is_active: true, created_at: '2024-01-01' },
  { id: 10, email: 'student5@campus.com', full_name: 'Eve Anderson', role: 'student', is_active: true, created_at: '2024-01-01' },
  { id: 11, email: 'student6@campus.com', full_name: 'Frank Brown', role: 'student', is_active: true, created_at: '2024-01-01' },
  { id: 12, email: 'student7@campus.com', full_name: 'Grace Lee', role: 'student', is_active: true, created_at: '2024-01-01' },
  { id: 13, email: 'student8@campus.com', full_name: 'Henry Taylor', role: 'student', is_active: true, created_at: '2024-01-01' },
];

export const mockDepartments: Department[] = [
  { id: 1, name: 'Computer Science', code: 'CS', description: 'Department of Computer Science and Engineering', student_count: 2, faculty_count: 1, created_at: '2024-01-01' },
  { id: 2, name: 'Electronics', code: 'EC', description: 'Department of Electronics and Communication', student_count: 2, faculty_count: 1, created_at: '2024-01-01' },
  { id: 3, name: 'Mechanical', code: 'ME', description: 'Department of Mechanical Engineering', student_count: 2, faculty_count: 1, created_at: '2024-01-01' },
  { id: 4, name: 'Civil', code: 'CE', description: 'Department of Civil Engineering', student_count: 2, faculty_count: 1, created_at: '2024-01-01' },
];

export const mockFaculty: Faculty[] = [
  { id: 1, user_id: 2, employee_id: 'FAC001', department_id: 1, designation: 'Associate Professor', qualification: 'Ph.D. Computer Science', full_name: 'Dr. Sarah Johnson', email: 'faculty1@campus.com' },
  { id: 2, user_id: 3, employee_id: 'FAC002', department_id: 2, designation: 'Professor', qualification: 'Ph.D. Electronics', full_name: 'Prof. Michael Chen', email: 'faculty2@campus.com' },
  { id: 3, user_id: 4, employee_id: 'FAC003', department_id: 3, designation: 'Assistant Professor', qualification: 'Ph.D. Mechanical Eng.', full_name: 'Dr. Emily Davis', email: 'faculty3@campus.com' },
  { id: 4, user_id: 5, employee_id: 'FAC004', department_id: 4, designation: 'Professor', qualification: 'Ph.D. Civil Eng.', full_name: 'Prof. Robert Wilson', email: 'faculty4@campus.com' },
];

export const mockStudents: Student[] = [
  { id: 1, user_id: 6, roll_number: 'CS2024001', department_id: 1, semester: 3, section: 'A', admission_year: 2024, full_name: 'Alice Thompson', email: 'student1@campus.com' },
  { id: 2, user_id: 7, roll_number: 'CS2024002', department_id: 1, semester: 3, section: 'A', admission_year: 2024, full_name: 'Bob Martinez', email: 'student2@campus.com' },
  { id: 3, user_id: 8, roll_number: 'EC2024001', department_id: 2, semester: 3, section: 'A', admission_year: 2024, full_name: 'Carol White', email: 'student3@campus.com' },
  { id: 4, user_id: 9, roll_number: 'EC2024002', department_id: 2, semester: 3, section: 'A', admission_year: 2024, full_name: 'David Kim', email: 'student4@campus.com' },
  { id: 5, user_id: 10, roll_number: 'ME2024001', department_id: 3, semester: 3, section: 'A', admission_year: 2024, full_name: 'Eve Anderson', email: 'student5@campus.com' },
  { id: 6, user_id: 11, roll_number: 'ME2024002', department_id: 3, semester: 3, section: 'A', admission_year: 2024, full_name: 'Frank Brown', email: 'student6@campus.com' },
  { id: 7, user_id: 12, roll_number: 'CE2024001', department_id: 4, semester: 3, section: 'A', admission_year: 2024, full_name: 'Grace Lee', email: 'student7@campus.com' },
  { id: 8, user_id: 13, roll_number: 'CE2024002', department_id: 4, semester: 3, section: 'A', admission_year: 2024, full_name: 'Henry Taylor', email: 'student8@campus.com' },
];

export const mockSubjects: Subject[] = [
  { id: 1, code: 'CS301', name: 'Data Structures', department_id: 1, semester: 3, credits: 4, faculty_id: 1 },
  { id: 2, code: 'CS302', name: 'Operating Systems', department_id: 1, semester: 3, credits: 3, faculty_id: 1 },
  { id: 3, code: 'CS303', name: 'Database Management', department_id: 1, semester: 3, credits: 4, faculty_id: 1 },
  { id: 4, code: 'EC301', name: 'Signal Processing', department_id: 2, semester: 3, credits: 4, faculty_id: 2 },
  { id: 5, code: 'EC302', name: 'Digital Electronics', department_id: 2, semester: 3, credits: 3, faculty_id: 2 },
  { id: 6, code: 'ME301', name: 'Thermodynamics', department_id: 3, semester: 3, credits: 4, faculty_id: 3 },
  { id: 7, code: 'ME302', name: 'Fluid Mechanics', department_id: 3, semester: 3, credits: 3, faculty_id: 3 },
  { id: 8, code: 'CE301', name: 'Structural Analysis', department_id: 4, semester: 3, credits: 4, faculty_id: 4 },
  { id: 9, code: 'CE302', name: 'Geotechnical Engineering', department_id: 4, semester: 3, credits: 3, faculty_id: 4 },
];

export const mockTimetable: TimetableEntry[] = [
  { id: 1, subject_id: 1, faculty_id: 1, department_id: 1, semester: 3, section: 'A', day_of_week: 0, start_time: '09:00', end_time: '10:00', room: 'CS-101' },
  { id: 2, subject_id: 2, faculty_id: 1, department_id: 1, semester: 3, section: 'A', day_of_week: 0, start_time: '10:00', end_time: '11:00', room: 'CS-102' },
  { id: 3, subject_id: 3, faculty_id: 1, department_id: 1, semester: 3, section: 'A', day_of_week: 1, start_time: '09:00', end_time: '10:00', room: 'CS-103' },
  { id: 4, subject_id: 1, faculty_id: 1, department_id: 1, semester: 3, section: 'A', day_of_week: 2, start_time: '11:00', end_time: '12:00', room: 'CS-101' },
  { id: 5, subject_id: 4, faculty_id: 2, department_id: 2, semester: 3, section: 'A', day_of_week: 0, start_time: '09:00', end_time: '10:00', room: 'EC-201' },
  { id: 6, subject_id: 5, faculty_id: 2, department_id: 2, semester: 3, section: 'A', day_of_week: 1, start_time: '10:00', end_time: '11:00', room: 'EC-202' },
  { id: 7, subject_id: 6, faculty_id: 3, department_id: 3, semester: 3, section: 'A', day_of_week: 0, start_time: '11:00', end_time: '12:00', room: 'ME-301' },
  { id: 8, subject_id: 7, faculty_id: 3, department_id: 3, semester: 3, section: 'A', day_of_week: 2, start_time: '09:00', end_time: '10:00', room: 'ME-302' },
  { id: 9, subject_id: 8, faculty_id: 4, department_id: 4, semester: 3, section: 'A', day_of_week: 1, start_time: '09:00', end_time: '10:00', room: 'CE-401' },
  { id: 10, subject_id: 9, faculty_id: 4, department_id: 4, semester: 3, section: 'A', day_of_week: 3, start_time: '10:00', end_time: '11:00', room: 'CE-402' },
  { id: 11, subject_id: 2, faculty_id: 1, department_id: 1, semester: 3, section: 'A', day_of_week: 3, start_time: '09:00', end_time: '10:00', room: 'CS-102' },
  { id: 12, subject_id: 3, faculty_id: 1, department_id: 1, semester: 3, section: 'A', day_of_week: 4, start_time: '09:00', end_time: '10:00', room: 'CS-103' },
];

export const mockNotices: Notice[] = [
  { id: 1, title: 'Mid-Semester Examination Schedule', content: 'Mid-semester examinations will be held from March 15-22. Please check the department notice board for detailed schedule.', category: 'exam', target_role: 'all', author_id: 1, author: mockUsers[0], is_pinned: true, published_at: '2024-03-01' },
  { id: 2, title: 'Annual Tech Fest Registration', content: 'Register for TechNova 2024! Events include hackathon, coding competition, and robotics challenge.', category: 'event', target_role: 'student', author_id: 1, author: mockUsers[0], is_pinned: false, published_at: '2024-02-28' },
  { id: 3, title: 'Faculty Development Workshop', content: 'A 3-day workshop on "Modern Teaching Methodologies" will be conducted on March 10-12.', category: 'academic', target_role: 'faculty', author_id: 1, author: mockUsers[0], is_pinned: false, published_at: '2024-02-25' },
  { id: 4, title: 'Library Timings Extended', content: 'The central library will remain open until 10 PM during examination period.', category: 'general', target_role: 'all', author_id: 1, author: mockUsers[0], is_pinned: false, published_at: '2024-02-20' },
];

export const mockFacilities: Facility[] = [
  { id: 1, name: 'Computer Lab A', type: 'lab', capacity: 60, location: 'Block A, Floor 2', description: 'Advanced computing lab with 60 workstations', is_available: true },
  { id: 2, name: 'Main Auditorium', type: 'hall', capacity: 500, location: 'Main Building', description: 'Large auditorium for events and seminars', is_available: true },
  { id: 3, name: 'Seminar Hall 1', type: 'seminar_room', capacity: 100, location: 'Block B, Floor 1', description: 'Equipped with projector and sound system', is_available: true },
  { id: 4, name: 'Sports Complex', type: 'sports', capacity: 200, location: 'Campus Ground', description: 'Indoor sports facility with gym and courts', is_available: true },
];

export const mockBookings: FacilityBooking[] = [
  { id: 1, facility_id: 1, facility: mockFacilities[0], booked_by: 2, booker: mockUsers[1], purpose: 'Programming Lab Session', date: '2024-03-15', start_time: '09:00', end_time: '11:00', status: 'approved', created_at: '2024-03-10' },
  { id: 2, facility_id: 2, facility: mockFacilities[1], booked_by: 1, booker: mockUsers[0], purpose: 'Annual Day Rehearsal', date: '2024-03-20', start_time: '14:00', end_time: '17:00', status: 'pending', created_at: '2024-03-12' },
  { id: 3, facility_id: 3, facility: mockFacilities[2], booked_by: 3, booker: mockUsers[2], purpose: 'Guest Lecture', date: '2024-03-18', start_time: '10:00', end_time: '12:00', status: 'pending', created_at: '2024-03-11' },
];

export const PASSWORDS: Record<string, string> = {
  'admin@campus.com': 'admin123',
  'faculty1@campus.com': 'faculty123',
  'faculty2@campus.com': 'faculty123',
  'faculty3@campus.com': 'faculty123',
  'faculty4@campus.com': 'faculty123',
  'student1@campus.com': 'student123',
  'student2@campus.com': 'student123',
  'student3@campus.com': 'student123',
  'student4@campus.com': 'student123',
  'student5@campus.com': 'student123',
  'student6@campus.com': 'student123',
  'student7@campus.com': 'student123',
  'student8@campus.com': 'student123',
};
