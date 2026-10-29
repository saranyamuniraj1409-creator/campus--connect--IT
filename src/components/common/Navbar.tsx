import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  Bell,
  LogOut,
  ChevronDown,
  UserCheck,
  Building2,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  Menu,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onOpenChat?: () => void;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onOpenChat,
  onSelectTab,
}) => {
  const {
    currentUser,
    activeRole,
    switchRole,
    logout,
    notifications,
    unreadNotificationCount,
    markAllNotificationsRead,
    markNotificationRead,
    resetToDemoData,
  } = useCollege();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
    student: { label: 'Student Portal', icon: <GraduationCap className="w-4 h-4" />, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    advisor: { label: 'Faculty Advisor', icon: <UserCheck className="w-4 h-4" />, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    hod: { label: 'Head of Dept (HOD)', icon: <Building2 className="w-4 h-4" />, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    admin: { label: 'Administrator', icon: <ShieldCheck className="w-4 h-4" />, color: 'bg-amber-50 text-amber-800 border-amber-200' },
  };

  const currentRoleInfo = roleLabels[activeRole] || roleLabels.student;

  const filteredNotifs = notifications.filter(
    (n) => n.roleTarget === 'all' || n.roleTarget === activeRole
  );

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
    setShowRoleMenu(false);
  };

  const handleReset = () => {
    resetToDemoData();
    setResetConfirm(false);
    setShowUserMenu(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 h-16">
        {/* Left: Mobile hamburger + Wordmark */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 text-slate-600 rounded-lg lg:hidden hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                CampusConnect
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-500 border-l border-slate-300 pl-2">
                Smart College Management
              </span>
            </div>
          </div>
        </div>

        {/* Center: Quick Switcher for Demonstration */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Switch Demo Role:
          </span>
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            {(['student', 'advisor', 'hod', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => handleRoleSelect(r)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  activeRole === r
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actions, AI button, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Campus Assistant Launcher button */}
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap"
              title="Open Campus AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">AI Assistant</span>
            </button>
          )}

          {/* Role Dropdown on mobile / small screens */}
          <div className="relative md:hidden">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg"
            >
              <span className="capitalize">{activeRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-40">
                <div className="px-3 py-1 text-xs font-semibold text-slate-400">Switch Role</div>
                {(['student', 'advisor', 'hod', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleSelect(r)}
                    className={`w-full text-left px-3 py-2 text-xs font-medium capitalize flex items-center justify-between ${
                      activeRole === r ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{r}</span>
                    {activeRole === r && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowUserMenu(false);
              }}
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">Notifications</span>
                    {unreadNotificationCount > 0 && (
                      <span className="text-[11px] font-medium text-slate-500">
                        ({unreadNotificationCount} new)
                      </span>
                    )}
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {filteredNotifs.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No notifications for your current role.
                    </div>
                  ) : (
                    filteredNotifs.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.linkTab && onSelectTab) {
                            onSelectTab(n.linkTab);
                            setShowNotifMenu(false);
                          }
                        }}
                        className={`p-3 text-left cursor-pointer transition-colors hover:bg-slate-50 ${
                          !n.read ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.detail}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-center">
                  <span className="text-[11px] text-slate-500">
                    Live updates synchronized with browser storage
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Quick Logout */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-2 p-1 pl-2 text-left rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
            >
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs flex items-center justify-center overflow-hidden">
                {currentUser?.name.charAt(0) || 'U'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentUser?.name.split(' ')[0] || 'User'}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight capitalize">
                  {currentRoleInfo.label.split(' ')[0]}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">{currentUser?.name}</p>
                  <p className="text-xs text-slate-500">{currentUser?.email}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                    {currentRoleInfo.icon}
                    <span>{currentRoleInfo.label}</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => setResetConfirm(true)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reset Sample Data</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>

                {resetConfirm && (
                  <div className="p-3 mx-2 my-1 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                    <p className="font-semibold">Reset to default demo data?</p>
                    <p className="text-[11px] text-amber-700 mt-1">This will reload original demo records.</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleReset}
                        className="px-2 py-1 bg-amber-600 text-white rounded text-[11px] font-medium"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setResetConfirm(false)}
                        className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Demo storage indicator notice */}
      <div className="bg-blue-50/80 border-t border-b border-blue-100 px-4 py-1 text-[11px] text-blue-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Demonstration Mode:</span>
          <span>Authentication and data are simulated via browser localStorage. No production secrets required.</span>
        </div>
        <div className="hidden sm:block text-[10px] text-blue-600">
          Role: <strong className="capitalize">{activeRole}</strong>
        </div>
      </div>
    </header>
  );
};
