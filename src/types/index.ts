export type UserRole = 'student' | 'advisor' | 'hod' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  rollNumber?: string;
  employeeId?: string;
  designation?: string;
  semester?: number;
  section?: string;
  phone: string;
  joinedDate: string;
}

export interface StudentProfile extends User {
  cgpa: number;
  completedCredits: number;
  totalCredits: number;
  advisorName: string;
  batch: string;
  bloodGroup: string;
  emergencyContact: string;
  address: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  courseCode: string;
  courseName: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  lastUpdated: string;
  facultyName: string;
}

export interface DailyAttendance {
  id: string;
  date: string;
  courseCode: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  status: 'present' | 'absent' | 'late';
}

export interface MarkRecord {
  id: string;
  studentId: string;
  courseCode: string;
  courseName: string;
  credits: number;
  internal1: number; // max 25
  internal2: number; // max 25
  assignmentMarks: number; // max 25
  endSem: number; // max 25
  total: number; // max 100
  grade: string;
  gradePoints: number;
  semester: number;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;
  courseCode: string;
  courseName: string;
  room: string;
  facultyName: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
}

export interface Assignment {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  submitted: boolean;
  submissionDate?: string;
  submissionFile?: string;
  marksAwarded?: number;
  status: 'pending' | 'submitted' | 'graded';
  feedback?: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  fromDate: string;
  toDate: string;
  daysCount: number;
  reasonType: 'Medical' | 'On-Duty' | 'Personal' | 'Academic Conference';
  reasonDetails: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
  advisorRemarks?: string;
  documentName?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetRole: 'all' | 'student' | 'advisor' | 'hod';
  department: string;
  authorName: string;
  authorRole: string;
  date: string;
  priority: 'urgent' | 'high' | 'normal';
  category: 'Examination' | 'Academic' | 'Events' | 'Administrative' | 'Placement';
}

export interface Department {
  id: string;
  code: string;
  name: string;
  hodName: string;
  hodEmail: string;
  totalFaculty: number;
  totalStudents: number;
  averageAttendance: number;
  avgPassRate: number;
  establishedYear: number;
  intakeCapacity: number;
}

export interface FacultyMember {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  qualification: string;
  courses: string[];
  experienceYears: number;
  phone: string;
  status: 'active' | 'on_leave';
  isAdvisor?: boolean;
  adviseeBatch?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  quickPrompts?: string[];
}
