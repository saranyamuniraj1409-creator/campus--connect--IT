import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { UserRole } from '../../types';
import { LoginModal } from './LoginModal';
import {
  GraduationCap,
  UserCheck,
  Building2,
  ShieldCheck,
  CalendarCheck2,
  FileText,
  BarChart3,
  Bot,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ChevronRight,
  Shield,
  Layers,
  Award,
} from 'lucide-react';
import { DEMO_USERS, COLLEGE_SUMMARY } from '../../data/mockData';

export const LandingPage: React.FC = () => {
  const { login } = useCollege();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalDefaultRole, setModalDefaultRole] = useState<UserRole>('student');

  const handleQuickLogin = (role: UserRole) => {
    login(DEMO_USERS[role].email, role);
  };

  const handleOpenLogin = (role: UserRole = 'student') => {
    setModalDefaultRole(role);
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Bar Contract (3 Zones) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <a href="#" className="text-xl font-bold tracking-tight text-slate-900">
              CampusConnect
            </a>
          </div>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-700 transition-colors whitespace-nowrap shrink-0">
              Platform Modules
            </a>
            <a href="#roles" className="hover:text-blue-700 transition-colors whitespace-nowrap shrink-0">
              Role Dashboards
            </a>
            <a href="#departments" className="hover:text-blue-700 transition-colors whitespace-nowrap shrink-0">
              Academic Departments
            </a>
            <a href="#accreditation" className="hover:text-blue-700 transition-colors whitespace-nowrap shrink-0">
              Institutional Accreditation
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleOpenLogin('student')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs whitespace-nowrap shrink-0"
            >
              Sign In to Portal
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column (Prose) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                Integrated Higher Education Ecosystem
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 text-balance leading-tight">
                Empowering Students, Faculty & Leadership with Real-Time Academic Intelligence.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                CampusConnect bridges daily academic life and institutional management: automated attendance tracking,
                continuous marks evaluation, paperless leave approvals, department analytics, and an integrated AI Student Assistant.
              </p>

              {/* Instant Demo Launch Button */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleQuickLogin('student')}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <span>Launch Student Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenLogin('advisor')}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-all border border-slate-200 flex items-center gap-2"
                >
                  <span>Explore Other Roles</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Adjacency Proof Strip */}
              <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 border-t border-slate-100">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>4 Dedicated Dashboards</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Local Storage Persistence</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero Server Setup</span>
                </div>
              </div>
            </div>

            {/* Right Column (Hero Campus Image) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100 aspect-4/3 sm:aspect-16/10 lg:aspect-4/3">
                <img
                  src="/src/assets/images/campus_hero_aerial_1793259120859.jpg"
                  alt="Modern collegiate university campus grounds with students"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white text-xs">
                    <span className="font-bold block text-sm">Central University Campus</span>
                    <span className="text-slate-200">Department of Information Technology</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Column Metric Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-slate-200">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                {COLLEGE_SUMMARY.totalStudents}
              </span>
              <p className="text-xs text-slate-500 mt-1">Full-Time Enrolled Engineers</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                {COLLEGE_SUMMARY.totalFaculty}
              </span>
              <p className="text-xs text-slate-500 mt-1">Tenured Academic Faculty</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                {COLLEGE_SUMMARY.overallPlacementRate}%
              </span>
              <p className="text-xs text-slate-500 mt-1">Institutional Placement Clearance</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700 tabular-nums">
                NAAC A++
              </span>
              <p className="text-xs text-slate-500 mt-1">Highest University Grade</p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Quick Access Portal */}
      <section id="roles" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Interactive Demonstrations
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Select Your Role to Enter Live Demo Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Every dashboard has functional state, mock data, and full interactive buttons.
              Click any card below to sign in instantly with one click.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Student Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Student Dashboard</h3>
                <p className="text-xs text-blue-700 font-medium mt-0.5">
                  M. Saranya · Roll: 25BIT043 (Sem 3 IT)
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span>Subject attendance with shortage alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span>Continuous marks & GPA breakdown</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span>Class timetable & coursework upload</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span>Leave applications & AI Assistant</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleQuickLogin('student')}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Instant Login (Student)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Advisor Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Faculty Advisor</h3>
                <p className="text-xs text-emerald-700 font-medium mt-0.5">
                  Dr. Madheshwaran · FAC-IT-012
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>Advisee batch roster & counseling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>Mark daily session attendance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>Internal assessment marks entry</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>Review & approve leave petitions</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleQuickLogin('advisor')}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Instant Login (Advisor)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* HOD Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Department Head (HOD)</h3>
                <p className="text-xs text-purple-700 font-medium mt-0.5">
                  Dr. Palani · IT Head (FAC-IT-001)
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    <span>Department KPIs & enrollment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    <span>Faculty course assignments & load</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    <span>At-risk student monitoring alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    <span>Issue official circulars & notices</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleQuickLogin('hod')}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Instant Login (HOD)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Admin Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">College Administrator</h3>
                <p className="text-xs text-amber-800 font-medium mt-0.5">
                  Central Registrar's Bureau
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    <span>Manage student & faculty registries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    <span>Academic department capacity</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    <span>Tuition reconciliation & metrics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    <span>Audit trail & system reset tools</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleQuickLogin('admin')}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Instant Login (Admin)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Modules */}
      <section id="features" className="py-20 bg-white border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              System Capabilities
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
              Everything Your Institution Needs in One Unified Web Portal
            </h2>
            <p className="text-sm text-slate-600 mt-3">
              Built desktop-first, mobile responsive, and fully compliant with academic bylaws.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <CalendarCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Smart Attendance Management</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Subject-wise attendance tracking with real-time percentage indicators. Automatically alerts students
                whose records dip below the mandatory 75% university eligibility requirement.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Continuous Assessment & GPA</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Breakdown of internal tests, quizzes, and assignment evaluations. Automatic computation of letter grades
                (O to C) and cumulative GPA across all registered course credits.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Paperless Leave Workflow</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                End-to-end digital approval for Medical, On-Duty, and Conference leaves. Faculty advisors review
                applications with one click and leave comments stored in student records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Environment & Library */}
      <section id="departments" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-16/10">
                <img
                  src="/src/assets/images/campus_library_study_1793259121693.jpg"
                  alt="University Library study commons"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                Academic Infrastructure
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                State-of-the-Art Research Libraries and Learning Commons
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Over 65,000 digital volumes, IEEE Explore access, and high-performance computing clusters.
                CampusConnect integrates directly with library circulation catalogs and lab reservations.
              </p>
              <div className="space-y-3 pt-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Central Library open 7 days a week with digital reservation kiosk</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Integrated AI Campus Assistant trained on syllabus & handbook</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>High-speed Gigabit campus Wi-Fi & modern lab infrastructure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="accreditation" className="bg-white border-t border-slate-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-slate-800">CampusConnect</span>
            <span>·</span>
            <span>Smart College Management System</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Demonstration Environment</span>
            <span>·</span>
            <span>Local Storage Mock Layer</span>
            <span>·</span>
            <span>NAAC A++ Accredited Institution</span>
          </div>
          <div>
            © {new Date().getFullYear()} CampusConnect University Systems.
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        defaultRole={modalDefaultRole}
      />
    </div>
  );
};
