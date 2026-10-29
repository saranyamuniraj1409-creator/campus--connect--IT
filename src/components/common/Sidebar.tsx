import React from 'react';
import { useCollege } from '../../context/CollegeContext';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  CalendarCheck2,
  GraduationCap,
  Calendar,
  FileText,
  Clock,
  Megaphone,
  Bot,
  Users,
  CheckSquare,
  Building,
  BarChart3,
  BookOpen,
  Settings,
  Shield,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
}) => {
  const { activeRole, currentUser, assignments, leaveRequests } = useCollege();

  const pendingAssignmentsCount = assignments.filter((a) => !a.submitted).length;
  const pendingLeavesCount = leaveRequests.filter((l) => l.status === 'pending').length;

  const getNavItems = (role: UserRole): NavItem[] => {
    switch (role) {
      case 'student':
        return [
          { id: 'overview', label: 'Student Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'attendance', label: 'Attendance Tracker', icon: <CalendarCheck2 className="w-4 h-4" /> },
          { id: 'marks', label: 'Marks & CGPA', icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'timetable', label: 'Class Timetable', icon: <Calendar className="w-4 h-4" /> },
          {
            id: 'assignments',
            label: 'Assignments',
            icon: <FileText className="w-4 h-4" />,
            badge: pendingAssignmentsCount > 0 ? pendingAssignmentsCount : undefined,
          },
          { id: 'leaves', label: 'Leave Requests', icon: <Clock className="w-4 h-4" /> },
          { id: 'announcements', label: 'Announcements', icon: <Megaphone className="w-4 h-4" /> },
          { id: 'assistant', label: 'AI Campus Assistant', icon: <Bot className="w-4 h-4" /> },
        ];
      case 'advisor':
        return [
          { id: 'overview', label: 'Advisor Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'students', label: 'Advisee Students', icon: <Users className="w-4 h-4" /> },
          { id: 'attendance', label: 'Mark Attendance', icon: <CheckSquare className="w-4 h-4" /> },
          { id: 'marks', label: 'Internal Marks', icon: <GraduationCap className="w-4 h-4" /> },
          {
            id: 'leaves',
            label: 'Leave Approvals',
            icon: <Clock className="w-4 h-4" />,
            badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined,
          },
          { id: 'announcements', label: 'Post Notices', icon: <Megaphone className="w-4 h-4" /> },
        ];
      case 'hod':
        return [
          { id: 'overview', label: 'Department Overview', icon: <Building className="w-4 h-4" /> },
          { id: 'faculty', label: 'Faculty Directory', icon: <Users className="w-4 h-4" /> },
          { id: 'reports', label: 'Student Performance', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'analytics', label: 'Attendance Analytics', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'announcements', label: 'Circulars & Notices', icon: <Megaphone className="w-4 h-4" /> },
        ];
      case 'admin':
        return [
          { id: 'overview', label: 'College Overview', icon: <Shield className="w-4 h-4" /> },
          { id: 'students', label: 'Manage Students', icon: <Users className="w-4 h-4" /> },
          { id: 'faculty', label: 'Manage Faculty', icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'departments', label: 'Departments', icon: <Building className="w-4 h-4" /> },
          { id: 'reports', label: 'Analytics & Audit', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'settings', label: 'System Settings', icon: <Settings className="w-4 h-4" /> },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems(activeRole);

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header in Sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
          <span className="text-sm font-bold text-slate-800">Navigation Menu</span>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Card */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
              {currentUser?.name.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {currentUser?.name}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {currentUser?.department || 'University Portal'}
              </p>
              <div className="mt-1">
                <span className="text-[10px] font-mono uppercase bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                  {currentUser?.rollNumber || currentUser?.employeeId || activeRole}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            {activeRole.toUpperCase()} CONSOLE
          </p>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
                      isActive ? 'bg-white text-blue-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/40 text-[11px] text-slate-500">
          <div className="flex items-center justify-between">
            <span>Academic Term</span>
            <span className="font-semibold text-slate-700">Odd Sem 2026</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span>Portal Build</span>
            <span className="font-mono text-[10px] text-slate-400">v2.4.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
