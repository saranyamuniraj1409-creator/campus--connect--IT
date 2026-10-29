import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import {
  Building2,
  Users,
  GraduationCap,
  CalendarCheck2,
  BarChart3,
  BookOpen,
  Megaphone,
  Search,
  Filter,
  Plus,
  Send,
  AlertTriangle,
  Award,
  Layers,
  CheckCircle2,
  Phone,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { FacultyMember } from '../../types';

interface HODDashboardProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const HODDashboard: React.FC<HODDashboardProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const {
    currentUser,
    departments,
    facultyList,
    batchStudents,
    announcements,
    addAnnouncement,
    addFacultyMember,
  } = useCollege();

  // Find IT Department (with fallback)
  const dept = departments.find((d) => d.code === 'IT') || departments.find((d) => d.code === 'CSE') || departments[0];

  // Faculty Search & Filter
  const [facultySearch, setFacultySearch] = useState('');
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);

  // New Faculty Form State
  const [newFacName, setNewFacName] = useState('');
  const [newFacEmail, setNewFacEmail] = useState('');
  const [newFacDesignation, setNewFacDesignation] = useState('Assistant Professor');
  const [newFacQualification, setNewFacQualification] = useState('');
  const [newFacPhone, setNewFacPhone] = useState('');
  const [newFacCourses, setNewFacCourses] = useState('');

  // Circular Form State
  const [circularTitle, setCircularTitle] = useState('');
  const [circularContent, setCircularContent] = useState('');
  const [circularPriority, setCircularPriority] = useState<'urgent' | 'high' | 'normal'>('high');
  const [circularCategory, setCircularCategory] = useState<'Examination' | 'Academic' | 'Events' | 'Administrative'>('Examination');
  const [circularSuccess, setCircularSuccess] = useState(false);

  // Selected semester for report
  const [selectedSemester, setSelectedSemester] = useState('Semester 3');

  // Filter faculty
  const filteredFaculty = facultyList.filter(
    (f) =>
      f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.designation.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.employeeId.toLowerCase().includes(facultySearch.toLowerCase())
  );

  // Add faculty handler
  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacName.trim() || !newFacEmail.trim()) return;

    addFacultyMember({
      employeeId: `FAC-IT-0${Math.floor(Math.random() * 80) + 40}`,
      name: newFacName.trim(),
      email: newFacEmail.trim(),
      department: 'Department of Information Technology',
      designation: newFacDesignation,
      qualification: newFacQualification.trim() || 'M.Tech / Ph.D in Information Technology',
      courses: newFacCourses.split(',').map((c) => c.trim()).filter(Boolean),
      experienceYears: 5,
      phone: newFacPhone.trim() || '+91 94440 00000',
      status: 'active',
    });

    setShowAddFacultyModal(false);
    setNewFacName('');
    setNewFacEmail('');
    setNewFacQualification('');
    setNewFacPhone('');
    setNewFacCourses('');
  };

  // Add circular handler
  const handlePublishCircular = (e: React.FormEvent) => {
    e.preventDefault();
    if (!circularTitle.trim() || !circularContent.trim()) return;

    addAnnouncement({
      title: circularTitle.trim(),
      content: circularContent.trim(),
      targetRole: 'all',
      department: 'Department of Information Technology',
      category: circularCategory,
      priority: circularPriority,
      authorName: currentUser?.name || 'Dr. Palani',
      authorRole: 'Professor & Head of Department (IT Head)',
    });

    setCircularTitle('');
    setCircularContent('');
    setCircularSuccess(true);
    setTimeout(() => setCircularSuccess(false), 3000);
  };

  // At-risk students count
  const atRiskStudents = batchStudents.filter(
    (s) => s.overallAttendance < 75 || s.cgpa < 7.0
  );

  return (
    <div className="space-y-6">
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <span>Department Head Console</span>
                <span>·</span>
                <span>{dept.name}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome, {currentUser?.name || 'Dr. Palani'}
              </h1>
              <p className="text-sm text-purple-100/90 mt-1">
                Overseeing {dept.totalFaculty} Faculty Members, {dept.totalStudents} Enrolled Engineers, and 4 Accredited Laboratories
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-purple-200">
                <span>Department Code: <strong className="text-white font-mono">{dept.code}</strong></span>
                <span>·</span>
                <span>Established: <strong className="text-white">{dept.establishedYear}</strong></span>
                <span>·</span>
                <span>Accreditation: <strong className="text-emerald-300">NBA Tier 1 (Valid till 2028)</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onSelectTab('analytics')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-semibold text-white transition-colors shadow-xs flex items-center gap-2 whitespace-nowrap"
              >
                <BarChart3 className="w-4 h-4" />
                <span>View Attendance Analytics</span>
              </button>
              <button
                onClick={() => onSelectTab('announcements')}
                className="px-4 py-2 bg-white text-purple-950 hover:bg-purple-50 rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Issue Circular</span>
              </button>
            </div>
          </div>

          {/* Department KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Department Faculty</span>
                <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">{dept.totalFaculty}</span>
                <span className="text-xs text-emerald-600 font-medium">100% Ph.D / M.Tech</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Faculty-to-student ratio: 1:16.9</p>
              <button
                onClick={() => onSelectTab('faculty')}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Inspect Faculty Directory →
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Enrolled Students</span>
                <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <GraduationCap className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">{dept.totalStudents}</span>
                <span className="text-xs text-slate-500">Across 4 Batches</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Year 1 to Year 4 Undergraduate (IT)</p>
              <button
                onClick={() => onSelectTab('reports')}
                className="mt-2 text-xs text-purple-600 hover:text-purple-800 font-medium"
              >
                View Academic Performance →
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Department Attendance</span>
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <CalendarCheck2 className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">{dept.averageAttendance}%</span>
                <span className="text-xs text-emerald-600 font-medium">+2.1% YoY</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Highest attendance across college</p>
              <button
                onClick={() => onSelectTab('analytics')}
                className="mt-2 text-xs text-emerald-600 hover:text-emerald-800 font-medium"
              >
                Deep Analytics →
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Semester Pass Rate</span>
                <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Award className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">{dept.avgPassRate}%</span>
                <span className="text-xs text-emerald-600 font-medium">Top Rank</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">95% campus placement clearance</p>
              <button
                onClick={() => onSelectTab('reports')}
                className="mt-2 text-xs text-amber-600 hover:text-amber-800 font-medium"
              >
                View At-Risk Students ({atRiskStudents.length}) →
              </button>
            </div>
          </div>

          {/* Department Analytics Visual Chart & Quick Faculty List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance & Pass Rate Chart */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Department Performance Comparison</h3>
                <span className="text-[11px] text-slate-400">Odd Semester 2026</span>
              </div>

              {/* Bar visualization */}
              <div className="mt-4 space-y-3.5">
                {departments.map((dept) => (
                  <div key={dept.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">
                        {dept.name} ({dept.code})
                      </span>
                      <span className="font-mono text-slate-600 font-bold">
                        Att: {dept.averageAttendance}% · Pass: {dept.avgPassRate}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex gap-0.5">
                      <div
                        className={`h-full rounded-l-full ${
                          dept.code === 'IT' ? 'bg-purple-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${dept.averageAttendance}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> IT Department
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Other Engineering Disciplines
                </span>
              </div>
            </div>

            {/* Core Faculty Spotlight */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Key Faculty & Course Assignments</h3>
                <button
                  onClick={() => onSelectTab('faculty')}
                  className="text-xs text-purple-700 hover:text-purple-900 font-medium"
                >
                  Full Directory ({facultyList.length}) →
                </button>
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {facultyList.slice(0, 4).map((fac) => (
                  <div key={fac.id} className="py-2.5 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{fac.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {fac.employeeId}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{fac.designation}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {fac.courses.map((c, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-purple-50 text-purple-800 px-1.5 py-0.2 rounded font-mono"
                          >
                            {c.split(':')[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700 font-semibold shrink-0">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Faculty Details Tab */}
      {activeTab === 'faculty' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Department Faculty Directory</h2>
              <p className="text-xs text-slate-500">
                Manage professor workloads, assigned course schedules, and academic credentials
              </p>
            </div>
            <button
              onClick={() => setShowAddFacultyModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Faculty Member</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search faculty by name, ID or designation..."
              value={facultySearch}
              onChange={(e) => setFacultySearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Faculty Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFaculty.map((fac) => (
              <div
                key={fac.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-purple-700 px-2 py-0.5 rounded bg-purple-50">
                      {fac.employeeId}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded capitalize">
                      {fac.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2.5">{fac.name}</h3>
                  <p className="text-xs font-medium text-slate-600 mt-0.5">{fac.designation}</p>
                  <p className="text-[11px] text-slate-500 italic mt-1">{fac.qualification}</p>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2 text-[11px]">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{fac.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono">{fac.phone}</span>
                    </div>
                    <div className="text-[11px] pt-1">
                      <span className="text-slate-400 block mb-1">Courses Handled:</span>
                      <div className="space-y-0.5">
                        {fac.courses.map((course, idx) => (
                          <span
                            key={idx}
                            className="block text-[11px] font-medium text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Experience: <strong className="font-mono text-slate-800">{fac.experienceYears} Years</strong></span>
                  {fac.isAdvisor && (
                    <span className="text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded">
                      Class Advisor
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student Reports & At-Risk Tracker */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Student Reports & At-Risk Monitoring</h2>
              <p className="text-xs text-slate-500">
                Identify students requiring academic intervention or attendance counseling before semester end
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Filter Batch:</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
              >
                <option value="Semester 6">3rd Year (Semester 6 - Sec A)</option>
                <option value="Semester 4">2nd Year (Semester 4)</option>
                <option value="Semester 8">Final Year (Semester 8)</option>
              </select>
            </div>
          </div>

          {/* At-Risk Warning Callout */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                At-Risk Academic Intervention List ({atRiskStudents.length} Students Identified)
              </h4>
              <p className="text-xs text-amber-800 mt-1">
                These students have attendance &lt; 75% or cumulative GPA &lt; 7.0 and are at risk of exam debarment.
                Automated counseling alerts have been forwarded to Class Advisor Dr. Rajesh Varma.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4 text-center">Current CGPA</th>
                    <th className="py-3 px-4 text-center">Attendance %</th>
                    <th className="py-3 px-4">Intervention Reason</th>
                    <th className="py-3 px-4">Assigned Advisor</th>
                    <th className="py-3 px-4 text-right">Recommended Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {atRiskStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-purple-700">{std.rollNumber}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{std.name}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold">
                        <span className={std.cgpa < 7.0 ? 'text-amber-700 font-bold' : 'text-slate-700'}>
                          {std.cgpa}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold">
                        <span className="px-2 py-0.5 rounded bg-red-50 text-red-700">
                          {std.overallAttendance}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {std.overallAttendance < 75 ? 'Attendance Shortage Risk' : 'GPA Improvement Program'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">Dr. Rajesh Varma</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-800 rounded font-semibold text-[11px]">
                          Parent Meeting
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Department Attendance & Analytics Engine</h2>
            <p className="text-xs text-slate-500">
              Macro attendance rates across courses, sections, and monthly trend curves
            </p>
          </div>

          {/* Visual Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Department Overall Attendance</span>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-purple-700">{dept.averageAttendance}%</span>
                <span className="text-xs text-emerald-600 font-medium">+1.4% this month</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Target benchmark set by Academic Council: 80.0%</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Attendance Compliance Rate</span>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-emerald-700">92.6%</span>
                <span className="text-xs text-slate-500">Above 75% limit</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">408 out of 440 students in good standing</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Lab vs Theory Attendance</span>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-slate-900">95.4%</span>
                <span className="text-xs text-slate-500">Labs vs 85.8% Theory</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Hands-on practicals show higher engagement</p>
            </div>
          </div>

          {/* Subject Attendance Breakdown */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Course-Level Attendance Distribution (IT Department)</h3>
            <div className="space-y-4">
              {[
                { name: 'IT305: Data Structures & Algorithms Lab', faculty: 'Dr. Madheshwaran', att: 98.4, status: 'Outstanding' },
                { name: 'IT301: Data Structures & Algorithms', faculty: 'Dr. Madheshwaran', att: 95.8, status: 'Optimal' },
                { name: 'IT302: Object-Oriented Programming (Java)', faculty: 'Prof. Ananya Sen', att: 93.3, status: 'Optimal' },
                { name: 'IT304: Database Management Systems', faculty: 'Prof. Meera Pillai', att: 91.5, status: 'Optimal' },
                { name: 'IT701: Cloud Computing Architecture', faculty: 'Dr. Palani (IT Head)', att: 94.6, status: 'Optimal' },
                { name: 'IT303: Digital Principles & Arch', faculty: 'Dr. Vikramaditya Rao', att: 72.4, status: 'Attention Required' },
              ].map((c, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{c.name}</span>
                      <span className="text-slate-500 text-[11px] ml-2">({c.faculty})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          c.att < 75 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {c.status}
                      </span>
                      <span className="font-mono font-bold text-slate-900 w-12 text-right">{c.att}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${c.att < 75 ? 'bg-red-500' : 'bg-purple-600'}`}
                      style={{ width: `${c.att}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Department Circulars & Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Issue Department Circulars</h2>
              <p className="text-xs text-slate-500">
                Publish high-authority circulars to all faculty, students, and lab staff
              </p>
            </div>
          </div>

          {circularSuccess && (
            <div className="p-3 bg-purple-50 border border-purple-200 text-purple-900 rounded-xl text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>Official Department Circular successfully disseminated to all student and faculty portals!</span>
            </div>
          )}

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Draft HOD Circular</h3>
            <form onSubmit={handlePublishCircular} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Circular Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandatory Guidelines for Major Project Reviews & Thesis Submission"
                  value={circularTitle}
                  onChange={(e) => setCircularTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={circularCategory}
                    onChange={(e) => setCircularCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
                  >
                    <option value="Examination">Examination & Assessments</option>
                    <option value="Academic">Academic Standards & Syllabus</option>
                    <option value="Events">Symposium & Research Seminars</option>
                    <option value="Administrative">Department Administration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={circularPriority}
                    onChange={(e) => setCircularPriority(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
                  >
                    <option value="urgent">Urgent Attention (High Banner)</option>
                    <option value="high">High Priority</option>
                    <option value="normal">Standard Circular</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Circular Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter full text of circular including dates, venues, committee members, and penalties..."
                  value={circularContent}
                  onChange={(e) => setCircularContent(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Issue & Sign Circular</span>
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
            <h3 className="text-base font-bold text-slate-900">Add Faculty Member</h3>
            <p className="text-xs text-slate-500 mt-1">
              Assign new faculty member to Department of Information Technology.
            </p>

            <form onSubmit={handleAddFaculty} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ramesh Chander"
                  value={newFacName}
                  onChange={(e) => setNewFacName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh.c@campus.edu"
                  value={newFacEmail}
                  onChange={(e) => setNewFacEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                  <select
                    value={newFacDesignation}
                    onChange={(e) => setNewFacDesignation(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
                  >
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Lecturer">Lecturer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 94440 12345"
                    value={newFacPhone}
                    onChange={(e) => setNewFacPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Qualification</label>
                <input
                  type="text"
                  placeholder="e.g. Ph.D in Computer Science (IIT Delhi)"
                  value={newFacQualification}
                  onChange={(e) => setNewFacQualification(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Courses Assigned (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS501: Data Structures, CS502: Algorithms"
                  value={newFacCourses}
                  onChange={(e) => setNewFacCourses(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500"
                />
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
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Register Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
