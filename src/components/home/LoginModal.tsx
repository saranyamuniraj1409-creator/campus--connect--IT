import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  UserCheck,
  Building2,
  ShieldCheck,
  X,
  Lock,
  Mail,
  ArrowRight,
  Info,
} from 'lucide-react';
import { DEMO_USERS } from '../../data/mockData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'student',
}) => {
  const { login } = useCollege();
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [email, setEmail] = useState(DEMO_USERS[defaultRole]?.email || 'student@campus.edu');
  const [password, setPassword] = useState('student123');

  if (!isOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEMO_USERS[role]?.email || '');
    setPassword(`${role}123`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, selectedRole);
    onClose();
  };

  const roleConfigs: Record<
    UserRole,
    { title: string; subtitle: string; icon: React.ReactNode; color: string }
  > = {
    student: {
      title: 'Student Portal',
      subtitle: 'M. Saranya · 25BIT043 (Sem 3 IT)',
      icon: <GraduationCap className="w-5 h-5 text-blue-600" />,
      color: 'border-blue-500 bg-blue-50/50',
    },
    advisor: {
      title: 'Faculty Advisor',
      subtitle: 'Dr. Madheshwaran · FAC-IT-012',
      icon: <UserCheck className="w-5 h-5 text-emerald-600" />,
      color: 'border-emerald-500 bg-emerald-50/50',
    },
    hod: {
      title: 'Head of Dept (HOD)',
      subtitle: 'Dr. Palani · IT Head (FAC-IT-001)',
      icon: <Building2 className="w-5 h-5 text-purple-600" />,
      color: 'border-purple-500 bg-purple-50/50',
    },
    admin: {
      title: 'College Administrator',
      subtitle: 'Registrar & Systems Bureau',
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      color: 'border-amber-500 bg-amber-50/50',
    },
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3 mx-auto sm:mx-0 shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Sign in to CampusConnect
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose a role below for instant pre-populated credentials
          </p>
        </div>

        {/* 1-Click Role Selectors */}
        <div className="grid grid-cols-2 gap-2.5 mt-5">
          {(['student', 'advisor', 'hod', 'admin'] as UserRole[]).map((role) => {
            const config = roleConfigs[role];
            const isSelected = selectedRole === role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleSelect(role)}
                className={`p-3 text-left rounded-xl border transition-all flex items-start gap-2.5 ${
                  isSelected
                    ? `${config.color} border-2 shadow-xs`
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="mt-0.5 shrink-0">{config.icon}</div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{config.title}</div>
                  <div className="text-[10px] text-slate-500 truncate">{config.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Demo Notice */}
        <div className="mt-4 p-2.5 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2 text-xs text-blue-900">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span className="text-[11px] leading-tight">
            <strong>Demonstration Credentials:</strong> Password is preset to{' '}
            <code className="font-mono bg-blue-100 px-1 py-0.5 rounded text-blue-950 font-semibold">
              {selectedRole}123
            </code>
            . Data is saved in browser storage.
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Institutional Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Account Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span>Enter as {roleConfigs[selectedRole].title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
