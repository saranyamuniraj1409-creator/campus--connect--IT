import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  StudentProfile,
  AttendanceRecord,
  MarkRecord,
  TimetableSlot,
  Assignment,
  LeaveRequest,
  Announcement,
  Department,
  FacultyMember,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_STUDENT_PROFILE,
  INITIAL_ATTENDANCE,
  INITIAL_MARKS,
  INITIAL_TIMETABLE,
  INITIAL_ASSIGNMENTS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_DEPARTMENTS,
  INITIAL_FACULTY,
  ADVISOR_BATCH_STUDENTS,
  BatchStudent,
} from '../data/mockData';

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  read: boolean;
  roleTarget: 'all' | UserRole;
  linkTab?: string;
}

interface CollegeContextType {
  currentUser: User | null;
  activeRole: UserRole;
  studentProfile: StudentProfile;
  attendance: AttendanceRecord[];
  marks: MarkRecord[];
  timetable: TimetableSlot[];
  assignments: Assignment[];
  leaveRequests: LeaveRequest[];
  announcements: Announcement[];
  departments: Department[];
  facultyList: FacultyMember[];
  batchStudents: BatchStudent[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;

  // Auth actions
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Student Actions
  submitAssignment: (assignmentId: string, fileName: string) => void;
  applyLeave: (leaveData: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn' | 'studentId' | 'studentName' | 'rollNumber' | 'department'>) => void;

  // Advisor Actions
  updateAttendance: (recordId: string, attended: number, total: number) => void;
  markBatchAttendance: (presentStudentIds: string[]) => void;
  updateStudentMarks: (markId: string, updates: Partial<MarkRecord>) => void;
  reviewLeaveRequest: (leaveId: string, status: 'approved' | 'rejected', remarks: string) => void;

  // Common & Department/Admin Actions
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  addStudentToBatch: (student: Omit<BatchStudent, 'id'>) => void;
  updateBatchStudent: (id: string, updates: Partial<BatchStudent>) => void;
  deleteBatchStudent: (id: string) => void;
  addFacultyMember: (faculty: Omit<FacultyMember, 'id'>) => void;
  updateFacultyMember: (id: string, updates: Partial<FacultyMember>) => void;
  deleteFacultyMember: (id: string) => void;
  addDepartment: (department: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, updates: Partial<Department>) => void;

  // Notification actions
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;

  // Utilities
  resetToDemoData: () => void;
}

const CollegeContext = createContext<CollegeContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'campus_connect_user_v4',
  ACTIVE_ROLE: 'campus_connect_role_v4',
  STUDENT_PROFILE: 'campus_connect_profile_v4',
  ATTENDANCE: 'campus_connect_attendance_v4',
  MARKS: 'campus_connect_marks_v4',
  ASSIGNMENTS: 'campus_connect_assignments_v4',
  LEAVES: 'campus_connect_leaves_v4',
  ANNOUNCEMENTS: 'campus_connect_announcements_v4',
  DEPARTMENTS: 'campus_connect_departments_v4',
  FACULTY: 'campus_connect_faculty_v4',
  BATCH_STUDENTS: 'campus_connect_batch_students_v4',
  NOTIFICATIONS: 'campus_connect_notifications_v4',
};

function safeGetItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.warn(`Could not read ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Could not save ${key} to localStorage:`, err);
  }
}

export const CollegeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Authentication & Role
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return safeGetItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return safeGetItem<UserRole>(STORAGE_KEYS.ACTIVE_ROLE, 'student');
  });

  // Data Collections
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    return safeGetItem<StudentProfile>(STORAGE_KEYS.STUDENT_PROFILE, INITIAL_STUDENT_PROFILE);
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    return safeGetItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  });

  const [marks, setMarks] = useState<MarkRecord[]>(() => {
    return safeGetItem<MarkRecord[]>(STORAGE_KEYS.MARKS, INITIAL_MARKS);
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    return safeGetItem<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    return safeGetItem<LeaveRequest[]>(STORAGE_KEYS.LEAVES, INITIAL_LEAVE_REQUESTS);
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    return safeGetItem<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    return safeGetItem<Department[]>(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  });

  const [facultyList, setFacultyList] = useState<FacultyMember[]>(() => {
    return safeGetItem<FacultyMember[]>(STORAGE_KEYS.FACULTY, INITIAL_FACULTY);
  });

  const [batchStudents, setBatchStudents] = useState<BatchStudent[]>(() => {
    return safeGetItem<BatchStudent[]>(STORAGE_KEYS.BATCH_STUDENTS, ADVISOR_BATCH_STUDENTS);
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    return safeGetItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: 'notif_1',
        title: 'New Assignment Published',
        detail: 'Raft Consensus Algorithm due on Nov 04, 2026',
        time: '2 hours ago',
        read: false,
        roleTarget: 'student',
        linkTab: 'assignments',
      },
      {
        id: 'notif_2',
        title: 'Pending Leave Application',
        detail: 'Pooja Iyer submitted medical leave for 2 days',
        time: '3 hours ago',
        read: false,
        roleTarget: 'advisor',
        linkTab: 'leaves',
      },
      {
        id: 'notif_3',
        title: 'Exam Schedule Announced',
        detail: 'End-Semester theory examination schedule is live',
        time: '1 day ago',
        read: false,
        roleTarget: 'all',
        linkTab: 'announcements',
      },
      {
        id: 'notif_4',
        title: 'Attendance Warning Triggered',
        detail: 'Compiler Design attendance currently at 71.9%',
        time: '2 days ago',
        read: true,
        roleTarget: 'student',
        linkTab: 'attendance',
      },
    ]);
  });

  // Sync to localStorage
  useEffect(() => { safeSetItem(STORAGE_KEYS.CURRENT_USER, currentUser); }, [currentUser]);
  useEffect(() => { safeSetItem(STORAGE_KEYS.ACTIVE_ROLE, activeRole); }, [activeRole]);
  useEffect(() => { safeSetItem(STORAGE_KEYS.STUDENT_PROFILE, studentProfile); }, [studentProfile]);
  useEffect(() => { safeSetItem(STORAGE_KEYS.ATTENDANCE, attendance); }, [attendance]);
  useEffect(() => { safeSetItem(STORAGE_KEYS.MARKS, marks); }, [marks]);
  useEffect(() => { safeSetItem(STORAGE_KEYS.ASSIGNMENTS, assignments); }, [assignments]);
  useEffect(() => { safeSetItem(STORAGE_KEYS.LEAVES, leaveRequests); }, [leaveRequests]);
  useEffect(() => { safeSetItem(STORAGE_KEYS.ANNOUNCEMENTS, announcements); }, [announcements]);
  useEffect(() => { safeSetItem(STORAGE_KEYS.DEPARTMENTS, departments); }, [departments]);
  useEffect(() => { safeSetItem(STORAGE_KEYS.FACULTY, facultyList); }, [facultyList]);
  useEffect(() => { safeSetItem(STORAGE_KEYS.BATCH_STUDENTS, batchStudents); }, [batchStudents]);
  useEffect(() => { safeSetItem(STORAGE_KEYS.NOTIFICATIONS, notifications); }, [notifications]);

  // Auth Handlers
  const login = (email: string, preferredRole?: UserRole): boolean => {
    let matchedUser = Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!matchedUser && preferredRole) {
      matchedUser = DEMO_USERS[preferredRole];
    }
    if (!matchedUser) {
      matchedUser = DEMO_USERS.student;
    }

    setCurrentUser(matchedUser);
    setActiveRole(matchedUser.role);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    const targetUser = DEMO_USERS[role];
    if (targetUser) {
      setCurrentUser(targetUser);
      setActiveRole(role);
    }
  };

  // Student Actions
  const submitAssignment = (assignmentId: string, fileName: string) => {
    setAssignments((prev) =>
      prev.map((item) =>
        item.id === assignmentId
          ? {
              ...item,
              submitted: true,
              submissionDate: 'Just now',
              submissionFile: fileName,
              status: 'submitted',
            }
          : item
      )
    );

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Assignment Submitted Successfully',
      detail: `${fileName} has been uploaded and queued for evaluation.`,
      time: 'Just now',
      read: false,
      roleTarget: 'student',
      linkTab: 'assignments',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const applyLeave = (
    leaveData: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn' | 'studentId' | 'studentName' | 'rollNumber' | 'department'>
  ) => {
    const newLeave: LeaveRequest = {
      id: `lv_${Date.now()}`,
      studentId: currentUser?.id || 'usr_student_1',
      studentName: currentUser?.name || 'M. Saranya',
      rollNumber: currentUser?.rollNumber || '25BIT043',
      department: currentUser?.department || 'Department of Information Technology',
      appliedOn: new Date().toISOString().split('T')[0],
      status: 'pending',
      ...leaveData,
    };

    setLeaveRequests((prev) => [newLeave, ...prev]);

    // Push notification for student & advisor
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Leave Application Filed',
      detail: `Your request for ${leaveData.daysCount} day(s) from ${leaveData.fromDate} is submitted for advisor approval.`,
      time: 'Just now',
      read: false,
      roleTarget: 'student',
      linkTab: 'leaves',
    };
    const advisorNotif: NotificationItem = {
      id: `notif_adv_${Date.now()}`,
      title: 'New Leave Request Received',
      detail: `${newLeave.studentName} (${newLeave.rollNumber}) applied for ${newLeave.reasonType} leave.`,
      time: 'Just now',
      read: false,
      roleTarget: 'advisor',
      linkTab: 'leaves',
    };

    setNotifications((prev) => [notif, advisorNotif, ...prev]);
  };

  // Advisor Actions
  const updateAttendance = (recordId: string, attended: number, total: number) => {
    const percentage = total > 0 ? parseFloat(((attended / total) * 100).toFixed(1)) : 0;
    setAttendance((prev) =>
      prev.map((rec) =>
        rec.id === recordId
          ? {
              ...rec,
              attendedClasses: attended,
              totalClasses: total,
              percentage,
              lastUpdated: 'Just now',
            }
          : rec
      )
    );
  };

  const markBatchAttendance = (presentStudentIds: string[]) => {
    setBatchStudents((prev) =>
      prev.map((student) => {
        const isPresent = presentStudentIds.includes(student.id);
        const currentAtt = student.overallAttendance;
        // Minor delta simulation
        const updated = isPresent
          ? Math.min(100, parseFloat((currentAtt + 0.3).toFixed(1)))
          : Math.max(40, parseFloat((currentAtt - 0.7).toFixed(1)));
        const status = updated >= 75 ? 'Good Standing' : 'Attendance Warning';
        return {
          ...student,
          overallAttendance: updated,
          status,
        };
      })
    );

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Batch Attendance Recorded',
      detail: `Marked attendance for ${presentStudentIds.length} present students in session.`,
      time: 'Just now',
      read: false,
      roleTarget: 'advisor',
      linkTab: 'attendance',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const updateStudentMarks = (markId: string, updates: Partial<MarkRecord>) => {
    setMarks((prev) =>
      prev.map((rec) => {
        if (rec.id !== markId) return rec;
        const updated = { ...rec, ...updates };
        const total = (updated.internal1 || 0) + (updated.internal2 || 0) + (updated.assignmentMarks || 0) + (updated.endSem || 0);
        let grade = 'F';
        let gradePoints = 0;
        if (total >= 95) { grade = 'O'; gradePoints = 10; }
        else if (total >= 90) { grade = 'A+'; gradePoints = 9.5; }
        else if (total >= 80) { grade = 'A'; gradePoints = 8.5; }
        else if (total >= 70) { grade = 'B+'; gradePoints = 7.5; }
        else if (total >= 60) { grade = 'B'; gradePoints = 6.5; }
        else if (total >= 50) { grade = 'C'; gradePoints = 5.5; }

        return {
          ...updated,
          total,
          grade,
          gradePoints,
        };
      })
    );
  };

  const reviewLeaveRequest = (leaveId: string, status: 'approved' | 'rejected', remarks: string) => {
    setLeaveRequests((prev) =>
      prev.map((item) =>
        item.id === leaveId
          ? {
              ...item,
              status,
              advisorRemarks: remarks,
            }
          : item
      )
    );

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Leave Application ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      detail: `Advisor remark: "${remarks || 'Status updated.'}"`,
      time: 'Just now',
      read: false,
      roleTarget: 'student',
      linkTab: 'leaves',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Announcements
  const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      id: `ann_${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...announcement,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Announcement: ${announcement.title}`,
      detail: `${announcement.category} notice posted by ${announcement.authorName}`,
      time: 'Just now',
      read: false,
      roleTarget: announcement.targetRole === 'student' ? 'student' : announcement.targetRole === 'advisor' ? 'advisor' : 'all',
      linkTab: 'announcements',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Admin / HOD Batch & Faculty CRUD
  const addStudentToBatch = (student: Omit<BatchStudent, 'id'>) => {
    const newStd: BatchStudent = {
      id: `usr_std_${Date.now()}`,
      ...student,
    };
    setBatchStudents((prev) => [newStd, ...prev]);
  };

  const updateBatchStudent = (id: string, updates: Partial<BatchStudent>) => {
    setBatchStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteBatchStudent = (id: string) => {
    setBatchStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const addFacultyMember = (faculty: Omit<FacultyMember, 'id'>) => {
    const newFac: FacultyMember = {
      id: `fac_${Date.now()}`,
      ...faculty,
    };
    setFacultyList((prev) => [newFac, ...prev]);
  };

  const updateFacultyMember = (id: string, updates: Partial<FacultyMember>) => {
    setFacultyList((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteFacultyMember = (id: string) => {
    setFacultyList((prev) => prev.filter((f) => f.id !== id));
  };

  const addDepartment = (dept: Omit<Department, 'id'>) => {
    const newDept: Department = {
      id: `dept_${Date.now()}`,
      ...dept,
    };
    setDepartments((prev) => [...prev, newDept]);
  };

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  // Notifications
  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  // Reset
  const resetToDemoData = () => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    } catch {
      // ignore
    }
    setStudentProfile(INITIAL_STUDENT_PROFILE);
    setAttendance(INITIAL_ATTENDANCE);
    setMarks(INITIAL_MARKS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setDepartments(INITIAL_DEPARTMENTS);
    setFacultyList(INITIAL_FACULTY);
    setBatchStudents(ADVISOR_BATCH_STUDENTS);
  };

  const unreadNotificationCount = notifications.filter(
    (n) => !n.read && (n.roleTarget === 'all' || n.roleTarget === activeRole)
  ).length;

  return (
    <CollegeContext.Provider
      value={{
        currentUser,
        activeRole,
        studentProfile,
        attendance,
        marks,
        timetable: INITIAL_TIMETABLE,
        assignments,
        leaveRequests,
        announcements,
        departments,
        facultyList,
        batchStudents,
        notifications,
        unreadNotificationCount,

        login,
        logout,
        switchRole,

        submitAssignment,
        applyLeave,

        updateAttendance,
        markBatchAttendance,
        updateStudentMarks,
        reviewLeaveRequest,

        addAnnouncement,
        addStudentToBatch,
        updateBatchStudent,
        deleteBatchStudent,
        addFacultyMember,
        updateFacultyMember,
        deleteFacultyMember,
        addDepartment,
        updateDepartment,

        markAllNotificationsRead,
        markNotificationRead,
        resetToDemoData,
      }}
    >
      {children}
    </CollegeContext.Provider>
  );
};

export const useCollege = () => {
  const context = useContext(CollegeContext);
  if (!context) {
    throw new Error('useCollege must be used within a CollegeProvider');
  }
  return context;
};
