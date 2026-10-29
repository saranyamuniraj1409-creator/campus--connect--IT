import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import {
  Users,
  CheckSquare,
  GraduationCap,
  Clock,
  Megaphone,
  Search,
  Filter,
  Check,
  X,
  AlertTriangle,
  Download,
  Plus,
  Send,
  Calendar,
  Save,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { BatchStudent } from '../../data/mockData';

interface AdvisorDashboardProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const AdvisorDashboard: React.FC<AdvisorDashboardProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const {
    currentUser,
    batchStudents,
    leaveRequests,
    marks,
    announcements,
    markBatchAttendance,
    updateStudentMarks,
    reviewLeaveRequest,
    addAnnouncement,
  } = useCollege();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'warning' | 'good'>('all');

  // Daily Attendance Tool State
  const [selectedCourse, setSelectedCourse] = useState('IT301: Data Structures & Algorithms');
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [presentMap, setPresentMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    batchStudents.forEach((s) => {
      // Default to present except those on warning
      initial[s.id] = s.overallAttendance >= 70;
    });
    return initial;
  });
  const [attendanceSavedMessage, setAttendanceSavedMessage] = useState(false);

  // Leave Review State
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected'>('approved');

  // Post Announcement State
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState<'Academic' | 'Examination' | 'Events' | 'Administrative'>('Academic');
  const [annPriority, setAnnPriority] = useState<'normal' | 'high' | 'urgent'>('high');
  const [annContent, setAnnContent] = useState('');
  const [annSuccess, setAnnSuccess] = useState(false);

  // Marks editing state
  const [editingMarkId, setEditingMarkId] = useState<string | null>(null);
  const [editScore1, setEditScore1] = useState(0);
  const [editScore2, setEditScore2] = useState(0);
  const [editAssign, setEditAssign] = useState(0);

  // Filter advisee batch
  const filteredStudents = batchStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (attendanceFilter === 'warning') return s.overallAttendance < 75;
    if (attendanceFilter === 'good') return s.overallAttendance >= 75;
    return true;
  });

  const warningStudentsCount = batchStudents.filter((s) => s.overallAttendance < 75).length;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'pending');

  // Attendance handlers
  const toggleStudentPresence = (id: string) => {
    setPresentMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const markAllPresent = () => {
    const updated: Record<string, boolean> = {};
    batchStudents.forEach((s) => {
      updated[s.id] = true;
    });
    setPresentMap(updated);
  };

  const handleSaveAttendance = () => {
    const presentIds = Object.keys(presentMap).filter((id) => presentMap[id]);
    markBatchAttendance(presentIds);
    setAttendanceSavedMessage(true);
    setTimeout(() => setAttendanceSavedMessage(false), 3000);
  };

  // Leave review handler
  const handleConfirmReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeaveId) return;
    reviewLeaveRequest(selectedLeaveId, reviewAction, reviewRemarks.trim());
    setShowReviewModal(false);
    setSelectedLeaveId(null);
    setReviewRemarks('');
  };

  // Post announcement handler
  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    addAnnouncement({
      title: annTitle.trim(),
      content: annContent.trim(),
      category: annCategory,
      priority: annPriority,
      targetRole: 'student',
      department: 'Department of Information Technology',
      authorName: currentUser?.name || 'Dr. Madheshwaran',
      authorRole: 'Class Advisor (IT Sem 3 - Batch 2025-2029)',
    });

    setAnnTitle('');
    setAnnContent('');
    setAnnSuccess(true);
    setTimeout(() => setAnnSuccess(false), 3000);
  };

  // Marks editor
  const handleSaveMarks = (markId: string) => {
    updateStudentMarks(markId, {
      internal1: Number(editScore1),
      internal2: Number(editScore2),
      assignmentMarks: Number(editAssign),
    });
    setEditingMarkId(null);
  };

  // Export CSV mock
  const handleExportCSV = () => {
    const header = 'RollNumber,Name,CGPA,Attendance,Status\n';
    const rows = batchStudents
      .map((s) => `${s.rollNumber},"${s.name}",${s.cgpa},${s.overallAttendance}%,${s.status}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IT_Sem3_Class_Advisor_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <span>Class Advisor Portal</span>
                <span>·</span>
                <span>Department of Information Technology · Sem 3 (2025-2029)</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome, {currentUser?.name}
              </h1>
              <p className="text-sm text-emerald-100/90 mt-1">
                Responsible for 60 Advisee Students · Odd Semester Academic Mentorship
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-emerald-200">
                <span>Faculty ID: <strong className="text-white font-mono">{currentUser?.employeeId || 'FAC-IT-012'}</strong></span>
                <span>·</span>
                <span>Office: <strong className="text-white">Cabin IT-204</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onSelectTab('attendance')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-semibold text-white transition-colors shadow-xs flex items-center gap-2 whitespace-nowrap"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Mark Today's Attendance</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-white text-emerald-950 hover:bg-emerald-50 rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Batch Data</span>
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Advisee Students</span>
                <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">{batchStudents.length}</span>
                <span className="text-xs text-slate-500">Active Mentees</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Section A · Batch 2023-2027</p>
              <button
                onClick={() => onSelectTab('students')}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                View Advisee List →
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Attendance Risk</span>
                <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-amber-700">{warningStudentsCount}</span>
                <span className="text-xs text-amber-600 font-medium">Below 75%</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Requires counseling notice</p>
              <button
                onClick={() => {
                  setAttendanceFilter('warning');
                  onSelectTab('students');
                }}
                className="mt-2 text-xs text-amber-700 hover:text-amber-900 font-medium"
              >
                Inspect Flagged Students →
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Pending Leaves</span>
                <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Clock className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">{pendingLeaves.length}</span>
                <span className="text-xs text-purple-600 font-medium">Awaiting Action</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Medical & On-Duty petitions</p>
              <button
                onClick={() => onSelectTab('leaves')}
                className="mt-2 text-xs text-purple-600 hover:text-purple-800 font-medium"
              >
                Review Requests →
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Batch Avg CGPA</span>
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <GraduationCap className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">8.24</span>
                <span className="text-xs text-emerald-600 font-medium">Class Average</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">12 students with CGPA &gt; 9.0</p>
              <button
                onClick={() => onSelectTab('marks')}
                className="mt-2 text-xs text-emerald-600 hover:text-emerald-800 font-medium"
              >
                Manage Internal Marks →
              </button>
            </div>
          </div>

          {/* Pending Leaves Queue & Quick Student Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Leaves Box */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Pending Advisee Leave Applications</h3>
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                  {pendingLeaves.length} pending
                </span>
              </div>

              {pendingLeaves.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No pending student leave requests currently.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 mt-2">
                  {pendingLeaves.map((l) => (
                    <div key={l.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{l.studentName}</span>
                          <span className="text-xs font-mono text-slate-500">({l.rollNumber})</span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                            {l.reasonType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-1">{l.reasonDetails}</p>
                        <span className="text-[11px] font-mono text-slate-400 mt-0.5 block">
                          Duration: {l.fromDate} → {l.toDate} ({l.daysCount} days)
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setSelectedLeaveId(l.id);
                            setReviewAction('approved');
                            setShowReviewModal(true);
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedLeaveId(l.id);
                            setReviewAction('rejected');
                            setShowReviewModal(true);
                          }}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold flex items-center gap-1"
                        >
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attendance Alert Students */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">Attendance Shortage Advisory</h3>
                </div>
                <button
                  onClick={() => {
                    setAttendanceFilter('warning');
                    onSelectTab('students');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All Warning List
                </button>
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {batchStudents
                  .filter((s) => s.overallAttendance < 75)
                  .map((s) => (
                    <div key={s.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{s.name}</span>
                          <span className="text-xs font-mono text-slate-500">({s.rollNumber})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Phone: {s.phone}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                          {s.overallAttendance}%
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">CGPA: {s.cgpa}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advisee Students Tab */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Advisee Student Roster</h2>
              <p className="text-xs text-slate-500">
                Department of Information Technology · Semester 3 (Batch 2025-2029) · Dr. Madheshwaran (Class Advisor)
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-200 self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setAttendanceFilter('all')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  attendanceFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
                }`}
              >
                All Mentees ({batchStudents.length})
              </button>
              <button
                onClick={() => setAttendanceFilter('warning')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  attendanceFilter === 'warning' ? 'bg-white text-red-700 shadow-xs font-semibold' : 'text-slate-600'
                }`}
              >
                Shortage Risk ({warningStudentsCount})
              </button>
              <button
                onClick={() => setAttendanceFilter('good')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  attendanceFilter === 'good' ? 'bg-white text-emerald-700 shadow-xs font-semibold' : 'text-slate-600'
                }`}
              >
                Good Standing
              </button>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4 text-center">CGPA</th>
                    <th className="py-3 px-4 text-center">Overall Attendance</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Contact Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((std) => {
                    const isWarning = std.overallAttendance < 75;
                    return (
                      <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{std.rollNumber}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">{std.name}</td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono">{std.email}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">{std.cgpa}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold">
                          <span
                            className={`px-2 py-0.5 rounded ${
                              isWarning ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {std.overallAttendance}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              isWarning ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {std.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{std.phone}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Mark Class Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Mark Daily Session Attendance</h2>
              <p className="text-xs text-slate-500">
                Select lecture course, session date, and toggle roll calls for IT Semester 3 Section A
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllPresent}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200"
              >
                Mark All Present
              </button>
              <button
                onClick={handleSaveAttendance}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Attendance Log</span>
              </button>
            </div>
          </div>

          {attendanceSavedMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Session attendance successfully recorded and synchronized to student portals!</span>
            </div>
          )}

          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="IT301: Data Structures & Algorithms">IT301: Data Structures & Algorithms</option>
                <option value="IT305: Data Structures & Algorithms Lab">IT305: Data Structures & Algorithms Lab</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Session Date</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              >
              </input>
            </div>
          </div>

          {/* Roll Call Attendance Grid */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">
                Roll Call List ({batchStudents.length} Registered Students)
              </span>
              <span className="text-slate-500">
                Present:{' '}
                <strong className="text-emerald-700 font-mono">
                  {Object.values(presentMap).filter(Boolean).length}
                </strong>{' '}
                · Absent:{' '}
                <strong className="text-red-700 font-mono">
                  {Object.values(presentMap).filter((v) => !v).length}
                </strong>
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {batchStudents.map((std) => {
                const isPresent = presentMap[std.id] ?? true;
                return (
                  <div
                    key={std.id}
                    onClick={() => toggleStudentPresence(std.id)}
                    className="p-3.5 px-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isPresent ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {isPresent ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-slate-900">{std.rollNumber}</span>
                          <span className="text-xs font-medium text-slate-800">{std.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">Term Average: {std.overallAttendance}%</span>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                          isPresent ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {isPresent ? 'Present' : 'Absent'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Internal Marks Management Tab */}
      {activeTab === 'marks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Internal Marks Management</h2>
              <p className="text-xs text-slate-500">
                Update Internal 1, Internal 2, and Assignment scores with instant grade generation
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Grade Sheet</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4 text-center">Internal 1 (25)</th>
                    <th className="py-3 px-4 text-center">Internal 2 (25)</th>
                    <th className="py-3 px-4 text-center">Assignments (25)</th>
                    <th className="py-3 px-4 text-center">End Sem (25)</th>
                    <th className="py-3 px-4 text-center">Total (100)</th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {marks.map((m) => {
                    const isEditing = editingMarkId === m.id;
                    return (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-bold font-mono text-blue-700 block">{m.courseCode}</span>
                          <span className="font-medium text-slate-800">{m.courseName}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              max={25}
                              value={editScore1}
                              onChange={(e) => setEditScore1(Number(e.target.value))}
                              className="w-16 px-1.5 py-1 border border-blue-400 rounded text-center text-xs"
                            />
                          ) : (
                            m.internal1
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              max={25}
                              value={editScore2}
                              onChange={(e) => setEditScore2(Number(e.target.value))}
                              className="w-16 px-1.5 py-1 border border-blue-400 rounded text-center text-xs"
                            />
                          ) : (
                            m.internal2
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              max={25}
                              value={editAssign}
                              onChange={(e) => setEditAssign(Number(e.target.value))}
                              className="w-16 px-1.5 py-1 border border-blue-400 rounded text-center text-xs"
                            />
                          ) : (
                            m.assignmentMarks
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-600">{m.endSem}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">{m.total}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-700">{m.grade}</td>
                        <td className="py-3.5 px-4 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleSaveMarks(m.id)}
                                className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingMarkId(null)}
                                className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[11px]"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingMarkId(m.id);
                                setEditScore1(m.internal1);
                                setEditScore2(m.internal2);
                                setEditAssign(m.assignmentMarks);
                              }}
                              className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[11px] font-semibold"
                            >
                              Edit Marks
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Leave Approvals Tab */}
      {activeTab === 'leaves' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Advisee Leave Requests</h2>
              <p className="text-xs text-slate-500">
                Evaluate student petitions and approve/reject with official advisor remarks
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Leave Category</th>
                    <th className="py-3 px-4">Dates</th>
                    <th className="py-3 px-4 text-center">Days</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaveRequests.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{l.studentName}</span>
                        <span className="font-mono text-slate-500 text-[11px]">{l.rollNumber}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">{l.reasonType}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {l.fromDate} → {l.toDate}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">{l.daysCount}</td>
                      <td className="py-3.5 px-4 max-w-xs text-slate-600 truncate">{l.reasonDetails}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                            l.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : l.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {l.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedLeaveId(l.id);
                                setReviewAction('approved');
                                setShowReviewModal(true);
                              }}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setSelectedLeaveId(l.id);
                                setReviewAction('rejected');
                                setShowReviewModal(true);
                              }}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-semibold"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Class Notices & Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Post Class & Advisee Notices</h2>
              <p className="text-xs text-slate-500">
                Broadcast academic instructions directly to all CSE Year 3 Section A students
              </p>
            </div>
          </div>

          {annSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Announcement successfully published to all advisee student portals!</span>
            </div>
          )}

          {/* Form */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Create New Class Announcement</h3>
            <form onSubmit={handlePostAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems Lab Project Viva Schedule"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="Academic">Academic Instructions</option>
                    <option value="Examination">Internal Assessments</option>
                    <option value="Events">Hackathon / Workshops</option>
                    <option value="Administrative">Administrative Circular</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={annPriority}
                    onChange={(e) => setAnnPriority(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Attention</option>
                    <option value="normal">Standard Notice</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide complete guidelines, deadlines, and deliverables..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Notice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Leave Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Confirm Leave {reviewAction === 'approved' ? 'Approval' : 'Rejection'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add advisor remarks that will appear in the student's portal.
            </p>

            <form onSubmit={handleConfirmReview} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Advisor Remarks / Reason
                </label>
                <textarea
                  rows={3}
                  placeholder={
                    reviewAction === 'approved'
                      ? 'e.g. Approved. Ensure pending lab records are submitted on return.'
                      : 'e.g. Attendance already below 75%; please meet advisor in person.'
                  }
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded-lg text-xs font-semibold transition-colors ${
                    reviewAction === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirm {reviewAction === 'approved' ? 'Approval' : 'Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
