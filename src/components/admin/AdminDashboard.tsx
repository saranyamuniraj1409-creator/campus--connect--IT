import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Building,
  BarChart3,
  Settings,
  Search,
  Plus,
  Trash2,
  Edit,
  RotateCcw,
  CheckCircle2,
  Download,
  DollarSign,
  Briefcase,
  Layers,
  BookOpen,
} from 'lucide-react';
import { BatchStudent, COLLEGE_SUMMARY } from '../../data/mockData';
import { Department, FacultyMember } from '../../types';

interface AdminDashboardProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const {
    currentUser,
    batchStudents,
    facultyList,
    departments,
    addStudentToBatch,
    deleteBatchStudent,
    addFacultyMember,
    deleteFacultyMember,
    addDepartment,
    resetToDemoData,
  } = useCollege();

  // Search queries
  const [studentSearch, setStudentSearch] = useState('');
  const [facultySearch, setFacultySearch] = useState('');

  // Modals
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // New Student form
  const [newStdName, setNewStdName] = useState('');
  const [newStdRoll, setNewStdRoll] = useState('');
  const [newStdEmail, setNewStdEmail] = useState('');
  const [newStdPhone, setNewStdPhone] = useState('');
  const [newStdCGPA, setNewStdCGPA] = useState('8.50');

  // New Faculty form
  const [newFacName, setNewFacName] = useState('');
  const [newFacEmail, setNewFacEmail] = useState('');
  const [newFacDept, setNewFacDept] = useState('Department of Information Technology');
  const [newFacDesignation, setNewFacDesignation] = useState('Assistant Professor');

  // New Department form
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptHOD, setNewDeptHOD] = useState('');
  const [newDeptCapacity, setNewDeptCapacity] = useState('120');

  // Filter lists
  const filteredStudents = batchStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredFaculty = facultyList.filter(
    (f) =>
      f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.department.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.employeeId.toLowerCase().includes(facultySearch.toLowerCase())
  );

  // Handlers
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStdName || !newStdRoll || !newStdEmail) return;

    addStudentToBatch({
      name: newStdName.trim(),
      rollNumber: newStdRoll.trim(),
      email: newStdEmail.trim(),
      cgpa: Number(newStdCGPA) || 8.0,
      overallAttendance: 85.0,
      status: 'Good Standing',
      pendingLeaves: 0,
      phone: newStdPhone.trim() || '+91 98450 00000',
    });

    setShowAddStudentModal(false);
    setNewStdName('');
    setNewStdRoll('');
    setNewStdEmail('');
    setNewStdPhone('');
  };

  const handleCreateFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacName || !newFacEmail) return;

    addFacultyMember({
      employeeId: `FAC-${newFacDept.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 80) + 20}`,
      name: newFacName.trim(),
      email: newFacEmail.trim(),
      department: newFacDept,
      designation: newFacDesignation,
      qualification: 'Ph.D / M.Tech',
      courses: ['Core Discipline Lecture'],
      experienceYears: 6,
      phone: '+91 94441 00000',
      status: 'active',
    });

    setShowAddFacultyModal(false);
    setNewFacName('');
    setNewFacEmail('');
  };

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptCode || !newDeptName || !newDeptHOD) return;

    addDepartment({
      code: newDeptCode.trim().toUpperCase(),
      name: newDeptName.trim(),
      hodName: newDeptHOD.trim(),
      hodEmail: `hod.${newDeptCode.toLowerCase()}@campus.edu`,
      totalFaculty: 12,
      totalStudents: 180,
      averageAttendance: 84.5,
      avgPassRate: 90.0,
      establishedYear: 2026,
      intakeCapacity: Number(newDeptCapacity) || 60,
    });

    setShowAddDeptModal(false);
    setNewDeptCode('');
    setNewDeptName('');
    setNewDeptHOD('');
  };

  return (
    <div className="space-y-6">
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <span>College Central Administration</span>
                <span>·</span>
                <span>Command Center</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Campus Executive Console
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                University Institutional Operations, Enrollment Registry & Financial Overview
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-300">
                <span>Status: <strong className="text-emerald-400 font-semibold">{COLLEGE_SUMMARY.auditStatus}</strong></span>
                <span>·</span>
                <span>Term: <strong className="text-white">{COLLEGE_SUMMARY.semesterTerm}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setShowAddStudentModal(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold text-white transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Enroll New Student</span>
              </button>
              <button
                onClick={() => onSelectTab('settings')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>System Settings</span>
              </button>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Enrolled Students</span>
                <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <GraduationCap className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">{COLLEGE_SUMMARY.totalStudents}</span>
                <span className="text-xs text-emerald-600 font-medium">98.4% Capacity</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Across 6 Academic Faculties</p>
              <button
                onClick={() => onSelectTab('students')}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Manage Student Registry →
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Academic Faculty</span>
                <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">{COLLEGE_SUMMARY.totalFaculty}</span>
                <span className="text-xs text-slate-500">Full-Time</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Professors, Assoc & Asst Faculty</p>
              <button
                onClick={() => onSelectTab('faculty')}
                className="mt-2 text-xs text-purple-600 hover:text-purple-800 font-medium"
              >
                Manage Faculty List →
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Degree Departments</span>
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Building className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">{departments.length}</span>
                <span className="text-xs text-emerald-600 font-medium">Accredited</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Engineering & Tech Divisions</p>
              <button
                onClick={() => onSelectTab('departments')}
                className="mt-2 text-xs text-emerald-600 hover:text-emerald-800 font-medium"
              >
                Inspect Departments →
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Placement Rate</span>
                <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Briefcase className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">{COLLEGE_SUMMARY.overallPlacementRate}%</span>
                <span className="text-xs text-emerald-600 font-medium">Record High</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">128 Recruiter Companies Visited</p>
              <button
                onClick={() => onSelectTab('reports')}
                className="mt-2 text-xs text-amber-600 hover:text-amber-800 font-medium"
              >
                View Analytics & Audit →
              </button>
            </div>
          </div>

          {/* Quick Institutional Overview Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Summary */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Academic Departments Summary</h3>
                <button
                  onClick={() => onSelectTab('departments')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All ({departments.length}) →
                </button>
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {departments.slice(0, 5).map((dept) => (
                  <div key={dept.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-700">{dept.code}</span>
                        <span className="text-xs font-medium text-slate-900">{dept.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">HOD: {dept.hodName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-800">
                        {dept.totalStudents} Students
                      </span>
                      <span className="block text-[10px] text-slate-400 font-mono">
                        {dept.totalFaculty} Faculty
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Institutional Financial & Tuition Fee Status */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Tuition & Financial Operations</h3>
                <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  96.8% Collection
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">Total Semester Tuition Billed</span>
                    <span className="font-mono font-bold text-slate-900">$14,240,000</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '96.8%' }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>Collected: $13,784,320</span>
                    <span className="text-amber-700 font-medium">Pending: $455,680</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Research Grants Disbursed</span>
                    <span className="text-base font-bold font-mono text-blue-700 mt-1 block">
                      {COLLEGE_SUMMARY.activeResearchGrants}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Library Digital Licenses</span>
                    <span className="text-base font-bold font-mono text-purple-700 mt-1 block">
                      {COLLEGE_SUMMARY.libraryBooksCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Students Tab */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Student Registry & Enrollment</h2>
              <p className="text-xs text-slate-500">
                Enroll, update, and manage student demographic records across departments
              </p>
            </div>
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll Student</span>
            </button>
          </div>

          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student by roll number or name..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4 text-center">CGPA</th>
                    <th className="py-3 px-4 text-center">Attendance %</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{std.rollNumber}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{std.name}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{std.email}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">{std.cgpa}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                        {std.overallAttendance}%
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            std.overallAttendance < 75
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {std.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => deleteBatchStudent(std.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                          title="Delete Student Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Manage Faculty Tab */}
      {activeTab === 'faculty' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">College Faculty Registry</h2>
              <p className="text-xs text-slate-500">
                Staff allocations, department appointments, and employee status
              </p>
            </div>
            <button
              onClick={() => setShowAddFacultyModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Appoint Faculty</span>
            </button>
          </div>

          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search faculty by name, department or ID..."
              value={facultySearch}
              onChange={(e) => setFacultySearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Employee ID</th>
                    <th className="py-3 px-4">Faculty Name</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Designation</th>
                    <th className="py-3 px-4">Official Email</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFaculty.map((fac) => (
                    <tr key={fac.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{fac.employeeId}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{fac.name}</td>
                      <td className="py-3.5 px-4 text-slate-700">{fac.department}</td>
                      <td className="py-3.5 px-4 text-slate-600">{fac.designation}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{fac.email}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 capitalize">
                          {fac.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => deleteFacultyMember(fac.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                          title="Remove Faculty Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Academic Departments</h2>
              <p className="text-xs text-slate-500">
                Institutional departments, appointed HODs, seat capacity, and attendance statistics
              </p>
            </div>
            <button
              onClick={() => setShowAddDeptModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Department</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {dept.code}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Est. {dept.establishedYear}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-2.5">{dept.name}</h3>
                <p className="text-xs text-slate-600 mt-1">Head of Dept: <strong className="text-slate-800">{dept.hodName}</strong></p>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Enrolled Students</span>
                    <strong className="text-slate-900 font-mono text-sm">{dept.totalStudents}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Total Faculty</span>
                    <strong className="text-slate-900 font-mono text-sm">{dept.totalFaculty}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Average Attendance</span>
                    <strong className="text-slate-900 font-mono text-sm">{dept.averageAttendance}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Pass Rate</span>
                    <strong className="text-slate-900 font-mono text-sm">{dept.avgPassRate}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* College Reports & Analytics & Audit Log */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">College Institutional Analytics & Audit Trail</h2>
            <p className="text-xs text-slate-500">
              Regulatory compliance records, accreditation audits, and operational system logs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Campus Placement Clearance</span>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-slate-900">92.4%</span>
                <span className="text-xs text-emerald-600 font-medium">+3.2% vs 2025</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Highest package: $42,000 / annum</p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Accreditation Standing</span>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-emerald-700">A++</span>
                <span className="text-xs text-slate-500">NAAC Rating</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">All engineering courses NBA accredited</p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Faculty Retention</span>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-blue-700">96.5%</span>
                <span className="text-xs text-slate-500">Annual Retention</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Average tenure: 8.4 years</p>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800">
              System Operations Audit Log
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {[
                { time: 'Today, 10:14 AM', user: 'admin@campus.edu', action: 'Institutional fee reconciliation batch executed', ip: '10.0.1.25' },
                { time: 'Today, 09:30 AM', user: 'Dr. Sunita Kulkarni', action: 'Issued circular: End-Semester Exam Schedule Nov 2026', ip: '10.0.4.11' },
                { time: 'Yesterday, 04:45 PM', user: 'Dr. Rajesh Varma', action: 'Approved On-Duty Leave application for student CS2023048', ip: '10.0.2.88' },
                { time: 'Yesterday, 02:15 PM', user: 'admin@campus.edu', action: 'Enrolled new mentee batch under CSE 3rd Year Sec A', ip: '10.0.1.25' },
                { time: 'Oct 27, 11:00 AM', user: 'System Task', action: 'Nightly database snapshot saved to browser persistent storage', ip: 'Internal' },
              ].map((log, i) => (
                <div key={i} className="p-3.5 px-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-semibold text-slate-800">{log.action}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Initiator: <strong className="font-mono text-slate-700">{log.user}</strong> · IP: {log.ip}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* System Settings & Reset Data Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">System Administration & Demo Management</h2>
            <p className="text-xs text-slate-500">
              Configuration, data recovery, and local storage controls
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Reset Demonstration Environment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This application operates with an in-browser local storage mock layer. If you have modified records,
              added new students, or changed marks and wish to return to the pristine default demonstration state,
              click the button below.
            </p>

            {showResetConfirm ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-3">
                <p className="font-bold">Are you sure you want to reset all mock data?</p>
                <p className="text-amber-800">
                  This will reload all original demo records for Students, Advisors, HOD, and Administrator.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      resetToDemoData();
                      setShowResetConfirm(false);
                    }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-2 border border-slate-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Reset to Factory Demo State</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Enroll New Student</h3>
            <p className="text-xs text-slate-500 mt-1">Add student record into Computer Science batch.</p>

            <form onSubmit={handleCreateStudent} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diya Sengupta"
                  value={newStdName}
                  onChange={(e) => setNewStdName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS2023062"
                    value={newStdRoll}
                    onChange={(e) => setNewStdRoll(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Initial CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={newStdCGPA}
                    onChange={(e) => setNewStdCGPA(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. diya.s@campus.edu"
                  value={newStdEmail}
                  onChange={(e) => setNewStdEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98450 11999"
                  value={newStdPhone}
                  onChange={(e) => setNewStdPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Faculty Modal */}
      {showAddFacultyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Appoint New Faculty</h3>
            <p className="text-xs text-slate-500 mt-1">Register faculty profile in college directory.</p>

            <form onSubmit={handleCreateFaculty} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Harish Chandra"
                  value={newFacName}
                  onChange={(e) => setNewFacName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. harish.c@campus.edu"
                  value={newFacEmail}
                  onChange={(e) => setNewFacEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                <select
                  value={newFacDept}
                  onChange={(e) => setNewFacDept(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                <select
                  value={newFacDesignation}
                  onChange={(e) => setNewFacDesignation(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Visiting Lecturer">Visiting Lecturer</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFacultyModal(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Add Academic Department</h3>
            <p className="text-xs text-slate-500 mt-1">Configure department code and intake capacity.</p>

            <form onSubmit={handleCreateDepartment} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BIOTECH"
                    value={newDeptCode}
                    onChange={(e) => setNewDeptCode(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Intake Capacity</label>
                  <input
                    type="number"
                    value={newDeptCapacity}
                    onChange={(e) => setNewDeptCapacity(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Biotechnology & Genetic Engineering"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Appointed HOD Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Shalini Mukherjee"
                  value={newDeptHOD}
                  onChange={(e) => setNewDeptHOD(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
