export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_SHORT = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export const API_BASE = 'http://127.0.0.1:5001/api';

export const CATEGORY_COLORS: Record<string, string> = {
  general: 'badge-blue',
  academic: 'badge-purple',
  event: 'badge-green',
  exam: 'badge-orange',
  urgent: 'badge-red',
};

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  pending: 'badge-yellow',
  approved: 'badge-green',
  rejected: 'badge-red',
  cancelled: 'badge-gray',
};

export const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@campus.com', password: 'admin123' },
  { role: 'Faculty', email: 'faculty1@campus.com', password: 'faculty123' },
  { role: 'Student', email: 'student1@campus.com', password: 'student123' },
];
