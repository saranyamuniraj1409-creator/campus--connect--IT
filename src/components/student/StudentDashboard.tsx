import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { AIChatbot } from '../common/AIChatbot';
import {
  CalendarCheck2,
  GraduationCap,
  FileText,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Upload,
  BookOpen,
  ArrowUpRight,
  Sparkles,
  Info,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface StudentDashboardProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const {
    studentProfile,
    attendance,
    marks,
    timetable,
    assignments,
    leaveRequests,
    announcements,
    submitAssignment,
    applyLeave,
  } = useCollege();

  // Modals state
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [submissionFileName, setSubmissionFileName] = useState('');

  // Leave form state
  const [leaveType, setLeaveType] = useState<'Medical' | 'On-Duty' | 'Personal' | 'Academic Conference'>('Medical');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reasonDetails, setReasonDetails] = useState('');

  // Timetable filter
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Monday');

  // Assignment filter
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');

  // Calculate statistics
  const totalClasses = attendance.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const attendedClasses = attendance.reduce((acc, curr) => acc + curr.attendedClasses, 0);
  const avgAttendance = totalClasses > 0 ? ((attendedClasses / totalClasses) * 100).toFixed(1) : '0';
  const lowAttendanceSubjects = attendance.filter((a) => a.percentage < 75);
  const pendingAssignments = assignments.filter((a) => !a.submitted);

  // Submit assignment handler
  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentId || !submissionFileName.trim()) return;
    submitAssignment(selectedAssignmentId, submissionFileName.trim());
    setShowSubmitModal(false);
    setSelectedAssignmentId(null);
    setSubmissionFileName('');
  };

  // Apply leave handler
  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDate || !toDate || !reasonDetails.trim()) return;

    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    applyLeave({
      fromDate,
      toDate,
      daysCount: Math.max(1, daysCount),
      reasonType: leaveType,
      reasonDetails: reasonDetails.trim(),
    });

    setShowLeaveModal(false);
    setFromDate('');
    setToDate('');
    setReasonDetails('');
  };

  return (
    <div className="space-y-6">
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
                <span>Student Academic Portal</span>
                <span>·</span>
                <span>Semester {studentProfile.semester} ({studentProfile.batch})</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome back, {studentProfile.name}
              </h1>
              <p className="text-sm text-blue-100/90 mt-1">
                Department of {studentProfile.department} · Section {studentProfile.section}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-blue-200">
                <span>Roll No: <strong className="text-white font-mono">{studentProfile.rollNumber}</strong></span>
                <span>·</span>
                <span>Faculty Advisor: <strong className="text-white">{studentProfile.advisorName}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onSelectTab('assistant')}
                className="px-4 py-2 bg-blue-500/30 hover:bg-blue-500/50 border border-blue-400/40 rounded-xl text-xs font-semibold text-white flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Ask AI Assistant</span>
              </button>
              <button
                onClick={() => onSelectTab('timetable')}
                className="px-4 py-2 bg-white text-blue-900 hover:bg-blue-50 rounded-xl text-xs font-semibold transition-colors shadow-xs whitespace-nowrap"
              >
                View Timetable
              </button>
            </div>
          </div>

          {/* Low Attendance Alert Banner if any */}
          {lowAttendanceSubjects.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-amber-900">
                  Attendance Advisory Notice ({lowAttendanceSubjects.length} subject below 75%)
                </h4>
                <p className="text-xs text-amber-800 mt-1">
                  You are currently below the university 75% attendance threshold in:
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {lowAttendanceSubjects.map((sub) => (
                    <span
                      key={sub.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-100 text-amber-900 text-xs font-medium"
                    >
                      <span>{sub.courseName}</span>
                      <strong className="font-mono text-amber-700">{sub.percentage}%</strong>
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-amber-700 mt-2">
                  Recommended action: Attend next 4 consecutive lectures without absentia to cross 75.0% threshold.
                </p>
              </div>
            </div>
          )}

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Overall Attendance</span>
                <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <CalendarCheck2 className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">{avgAttendance}%</span>
                <span className="text-xs font-medium text-emerald-600">Requirement: 75%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${Math.min(100, Number(avgAttendance))}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                {attendedClasses} attended / {totalClasses} conducted
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Cumulative GPA</span>
                <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <GraduationCap className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">{studentProfile.cgpa}</span>
                <span className="text-xs text-slate-500">/ 10.0 scale</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full"
                  style={{ width: `${(studentProfile.cgpa / 10) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {studentProfile.completedCredits} credits earned out of {studentProfile.totalCredits}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Pending Tasks</span>
                <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <FileText className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">{pendingAssignments.length}</span>
                <span className="text-xs text-amber-600 font-medium">Action Needed</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 line-clamp-1">
                Next: {pendingAssignments[0]?.title || 'All submissions up to date'}
              </p>
              <button
                onClick={() => onSelectTab('assignments')}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <span>Submit Work</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Leave Balance</span>
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Clock className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">8 Days</span>
                <span className="text-xs text-slate-500">Remaining</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                {leaveRequests.filter((l) => l.status === 'approved').length} approved requests this term
              </p>
              <button
                onClick={() => {
                  onSelectTab('leaves');
                  setShowLeaveModal(true);
                }}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <span>Apply for Leave</span>
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick Schedule Preview & Announcements Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Schedule Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Today's Academic Schedule</h3>
                </div>
                <button
                  onClick={() => onSelectTab('timetable')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  Full Timetable <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 mt-3">
                {timetable.filter((t) => t.day === 'Monday').map((slot) => (
                  <div key={slot.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-blue-700">{slot.courseCode}</span>
                        <span className="text-xs font-semibold text-slate-800 truncate">{slot.courseName}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {slot.room} · {slot.facultyName}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-medium text-slate-700">{slot.time}</span>
                      <span className="block text-[10px] text-slate-400 capitalize">{slot.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Announcements Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Official Campus Notices</h3>
                </div>
                <button
                  onClick={() => onSelectTab('announcements')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3 mt-3">
                {announcements.slice(0, 3).map((ann) => (
                  <div key={ann.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{ann.title}</h4>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize shrink-0 ${
                          ann.priority === 'urgent'
                            ? 'bg-red-100 text-red-700'
                            : ann.priority === 'high'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {ann.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{ann.content}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                      <span>{ann.authorRole}</span>
                      <span>{ann.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Tracker Tab */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Subject-wise Attendance Tracker</h2>
              <p className="text-xs text-slate-500">
                Mandatory University Criterion: 75.0% minimum attendance per course
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Overall Record:</span>
                <span className="text-lg font-bold font-mono text-slate-900">{avgAttendance}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Faculty In-Charge</th>
                    <th className="py-3 px-4 text-center">Conducted</th>
                    <th className="py-3 px-4 text-center">Attended</th>
                    <th className="py-3 px-4 text-center">Percentage</th>
                    <th className="py-3 px-4">Status & Health</th>
                    <th className="py-3 px-4 text-right">Last Entry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendance.map((rec) => {
                    const isLow = rec.percentage < 75;
                    const isGood = rec.percentage >= 85;
                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-bold font-mono text-blue-700 block">{rec.courseCode}</span>
                          <span className="font-medium text-slate-800">{rec.courseName}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{rec.facultyName}</td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-700">{rec.totalClasses}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">{rec.attendedClasses}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold">
                          <span
                            className={`px-2 py-0.5 rounded ${
                              isLow
                                ? 'bg-red-50 text-red-700'
                                : isGood
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {rec.percentage}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 text-red-700 font-semibold text-[11px]">
                              <AlertTriangle className="w-3.5 h-3.5" /> Shortage Alert
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Eligible for Finals
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-500 font-mono text-[11px]">
                          {rec.lastUpdated}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance Guidance Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              Attendance Regulations & Medical Condonation
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-xs text-slate-600">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Standard Eligibility</span>
                <span>Students maintaining 75.0% and above are directly eligible to sit for end-semester theory and laboratory examinations.</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Medical Condonation</span>
                <span>Attendance between 65.0% and 74.9% may be condoned by the Dean on valid medical grounds with approved documentation.</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Detention Rule</span>
                <span>Attendance strictly below 65.0% cannot be condoned under any circumstances; the course must be repeated in summer terms.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Marks & CGPA Tab */}
      {activeTab === 'marks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Academic Marks & Semester Grades</h2>
              <p className="text-xs text-slate-500">
                Current Semester {studentProfile.semester} ({studentProfile.batch}) Evaluation Breakdown (Internals + End-Sem Total)
              </p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-4">
              <div>
                <span className="text-[11px] text-blue-700 font-semibold uppercase block">Current CGPA</span>
                <span className="text-xl font-bold font-mono text-blue-900">{studentProfile.cgpa}</span>
              </div>
              <div className="border-l border-blue-200 pl-4">
                <span className="text-[11px] text-blue-700 font-semibold uppercase block">Credits Earned</span>
                <span className="text-xl font-bold font-mono text-blue-900">
                  {studentProfile.completedCredits} / {studentProfile.totalCredits}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4 text-center">Credits</th>
                    <th className="py-3 px-4 text-center">Internal 1 (25)</th>
                    <th className="py-3 px-4 text-center">Internal 2 (25)</th>
                    <th className="py-3 px-4 text-center">Assignments (25)</th>
                    <th className="py-3 px-4 text-center">End Sem (25)</th>
                    <th className="py-3 px-4 text-center">Total (100)</th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {marks.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold font-mono text-blue-700 block">{row.courseCode}</span>
                        <span className="font-medium text-slate-800">{row.courseName}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-600">{row.credits}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-700">{row.internal1}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-700">{row.internal2}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-700">{row.assignmentMarks}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-700">{row.endSem}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">{row.total}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded font-bold font-mono ${
                            row.grade === 'O'
                              ? 'bg-purple-50 text-purple-700'
                              : row.grade.startsWith('A')
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {row.grade}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-700">
                        {row.gradePoints.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Class Timetable Tab */}
      {activeTab === 'timetable' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Weekly Class Timetable</h2>
              <p className="text-xs text-slate-500">
                Department of Information Technology · Semester {studentProfile.semester} ({studentProfile.batch}) · Section A
              </p>
            </div>
            {/* Day Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 overflow-x-auto">
              {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const).map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    selectedDay === day
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {timetable
              .filter((slot) => slot.day === selectedDay)
              .map((slot) => (
                <div
                  key={slot.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                      {slot.courseCode}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{slot.time}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{slot.courseName}</h4>
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Venue:</span>
                      <strong className="text-slate-800">{slot.room}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Instructor:</span>
                      <span className="text-slate-800 truncate max-w-[140px]">{slot.facultyName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Type:</span>
                      <span className="text-slate-800 font-medium">{slot.type}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Assignments & Project Submissions</h2>
              <p className="text-xs text-slate-500">
                Track coursework milestones, upload deliverables, and view professor grades
              </p>
            </div>
            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              {(['all', 'pending', 'submitted', 'graded'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setAssignmentFilter(filter)}
                  className={`px-3 py-1 text-xs font-medium rounded capitalize transition-colors ${
                    assignmentFilter === filter
                      ? 'bg-white text-blue-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments
              .filter((a) => (assignmentFilter === 'all' ? true : a.status === assignmentFilter))
              .map((asg) => (
                <div
                  key={asg.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-blue-700">{asg.courseCode}</span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${
                          asg.status === 'graded'
                            ? 'bg-purple-100 text-purple-700'
                            : asg.status === 'submitted'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {asg.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-2">{asg.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{asg.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span>Due Date: <strong className="text-slate-800 font-mono">{asg.dueDate}</strong></span>
                      <span>Max Marks: <strong className="text-slate-800 font-mono">{asg.maxMarks}</strong></span>
                    </div>

                    {asg.status === 'pending' ? (
                      <button
                        onClick={() => {
                          setSelectedAssignmentId(asg.id);
                          setShowSubmitModal(true);
                        }}
                        className="w-full mt-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Submit Work Deliverable</span>
                      </button>
                    ) : (
                      <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>File: <strong className="font-mono text-slate-800">{asg.submissionFile}</strong></span>
                          <span className="text-slate-400">{asg.submissionDate}</span>
                        </div>
                        {asg.marksAwarded !== undefined && (
                          <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                            <span className="font-bold text-slate-900">Marks Awarded:</span>
                            <span className="font-mono font-bold text-purple-700 text-xs">
                              {asg.marksAwarded} / {asg.maxMarks}
                            </span>
                          </div>
                        )}
                        {asg.feedback && (
                          <p className="text-slate-600 italic mt-1">"{asg.feedback}"</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Leave Requests Tab */}
      {activeTab === 'leaves' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Leave Requests & Approvals</h2>
              <p className="text-xs text-slate-500">
                Apply for medical, on-duty, or personal leave with Class Advisor authorization
              </p>
            </div>
            <button
              onClick={() => setShowLeaveModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs whitespace-nowrap self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Apply New Leave</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Application ID</th>
                    <th className="py-3 px-4">Leave Category</th>
                    <th className="py-3 px-4">Date Duration</th>
                    <th className="py-3 px-4 text-center">Days</th>
                    <th className="py-3 px-4">Reason Statement</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Advisor Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaveRequests.map((leave) => (
                    <tr key={leave.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{leave.id}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">{leave.reasonType}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {leave.fromDate} → {leave.toDate}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                        {leave.daysCount}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs text-slate-600 truncate">{leave.reasonDetails}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                            leave.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : leave.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 italic">
                        {leave.advisorRemarks || `Pending review by ${studentProfile.advisorName}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Campus Announcements & Circulars</h2>
            <p className="text-xs text-slate-500">
              Official circulars from University Administration, Controller of Examinations & Department HOD
            </p>
          </div>

          <div className="space-y-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        ann.priority === 'urgent'
                          ? 'bg-red-100 text-red-700'
                          : ann.priority === 'high'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ann.priority}
                    </span>
                    <span className="text-xs font-semibold text-blue-700">{ann.category}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">{ann.department}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{ann.date}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2">{ann.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{ann.content}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Authorized by: <strong className="text-slate-800">{ann.authorName}</strong> ({ann.authorRole})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Assistant Tab */}
      {activeTab === 'assistant' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">CampusConnect AI Student Assistant</h2>
            <p className="text-xs text-slate-500">
              Interactive chatbot grounded in university bylaws, syllabus, attendance policy, and examination schedules
            </p>
          </div>
          <AIChatbot />
        </div>
      )}

      {/* Submit Assignment Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Upload Assignment Deliverable</h3>
            <p className="text-xs text-slate-500 mt-1">
              Select or type the submission filename (PDF, ZIP, or Jupyter Notebook).
            </p>

            <form onSubmit={handleAssignmentSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deliverable File Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS2023048_Raft_Consensus.zip"
                  value={submissionFileName}
                  onChange={(e) => setSubmissionFileName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">Simulate Local File Selection</p>
                <div className="flex justify-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setSubmissionFileName(`25BIT043_${Date.now()}_Project.pdf`)}
                    className="text-[11px] px-2 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:text-blue-600"
                  >
                    Quick .pdf
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmissionFileName(`25BIT043_${Date.now()}_Source.zip`)}
                    className="text-[11px] px-2 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:text-blue-600"
                  >
                    Quick .zip
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!submissionFileName.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Submit Deliverable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Apply for Student Leave</h3>
            <p className="text-xs text-slate-500 mt-1">
              Requests are routed directly to your Class Advisor {studentProfile.advisorName}.
            </p>

            <form onSubmit={handleLeaveSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Leave Category
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="Medical">Medical (Health / Hospitalization)</option>
                  <option value="On-Duty">On-Duty (Sports / University Representation)</option>
                  <option value="Academic Conference">Academic Conference / Hackathon</option>
                  <option value="Personal">Personal / Family Obligation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason / Justification
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="State the reason clearly for advisor appraisal..."
                  value={reasonDetails}
                  onChange={(e) => setReasonDetails(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
