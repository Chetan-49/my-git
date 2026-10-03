import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  Settings,
  Sparkles,
  LogOut,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  Award,
  Layers
} from 'lucide-react';
import { Role, NavTab } from '../../types/index.ts';

interface SidebarProps {
  role: Role;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  studentAvatar: string;
  teacherAvatar: string;
  pendingTasksCount: number;
  ungradedSubmissionsCount: number;
  onRoleToggle: (newRole: Role) => void;
  mobileMenuOpen?: boolean;
  onCloseMobile?: () => void;
  studentName?: string;
  teacherName?: string;
  studentTitle?: string;
  teacherTitle?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  activeTab,
  onTabChange,
  studentAvatar,
  teacherAvatar,
  pendingTasksCount,
  ungradedSubmissionsCount,
  onRoleToggle,
  mobileMenuOpen,
  onCloseMobile,
  studentName,
  teacherName,
  studentTitle,
  teacherTitle,
}) => {
  const isStudent = role === 'student';

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard Home',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'courses' as NavTab,
      label: isStudent ? 'Courses & Lectures' : 'Managed Classes',
      icon: BookOpen,
      badge: '4 Active',
    },
    {
      id: 'assignments' as NavTab,
      label: isStudent ? 'Assignments & Deadlines' : 'Grading & Queue',
      icon: ClipboardCheck,
      badge: isStudent
        ? `${pendingTasksCount} Due`
        : `${ungradedSubmissionsCount} Queue`,
      badgeColor: isStudent
        ? 'text-amber-700 bg-amber-50'
        : 'text-amber-700 bg-amber-50',
    },
    {
      id: 'analytics' as NavTab,
      label: 'Performance Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings & Security',
      icon: Settings,
      badge: null,
    },
  ];

  const handleItemClick = (tab: NavTab) => {
    onTabChange(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={`fixed md:sticky top-0 left-0 z-40 h-screen w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out ${
        mobileMenuOpen
          ? 'translate-x-0 shadow-2xl'
          : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-900/10">
            <Layers className="w-5 h-5 text-indigo-100" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
              EduPulse Nexus
            </span>
            <span className="text-[11px] text-slate-500 font-medium block">
              Academic Portal
            </span>
          </div>
        </div>
      </div>

      {/* User Profile Snippet (Dynamic based on Role) */}
      <div className="p-4 mx-3 my-3 bg-slate-50 border border-slate-200/80 rounded-xl transition-all">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={isStudent ? studentAvatar : teacherAvatar}
              alt={isStudent ? (studentName || 'Alex Rivera') : (teacherName || 'Prof. Marcus Vance')}
              className="w-11 h-11 rounded-lg object-cover ring-2 ring-white shadow-sm"
              referrerPolicy="no-referrer"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                isStudent ? 'bg-emerald-500' : 'bg-indigo-600'
              }`}
              title="Active session"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {isStudent ? (studentName || 'Alex Rivera') : (teacherName || 'Prof. Marcus Vance')}
            </h3>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {isStudent
                ? (studentTitle || 'Sophomore · Data Science')
                : (teacherTitle || 'Lead Faculty · Mathematics')}
            </p>
          </div>
        </div>

        {/* Role state indicator badge */}
        <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">Active Mode</span>
          <span
            className={`font-semibold text-[11px] px-2 py-0.5 rounded ${
              isStudent
                ? 'bg-blue-100/70 text-blue-900'
                : 'bg-indigo-100/70 text-indigo-900'
            }`}
          >
            {isStudent ? 'Student Account' : 'Instructor Account'}
          </span>
        </div>
      </div>

      {/* Core Nav Tabs */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto pt-1">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Workspace Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group focus:outline-none ${
                isActive
                  ? 'bg-indigo-50 text-indigo-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded tabular-nums shrink-0 ${
                    item.badgeColor || (isActive ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Role Switcher Drawer CTA & Footer */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-700">Quick Switch</span>
            <span className="text-[10px] text-slate-400">Simulation</span>
          </div>
          <button
            onClick={() => onRoleToggle(isStudent ? 'teacher' : 'student')}
            className="w-full py-1.5 px-2 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-indigo-700 rounded-md shadow-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            {isStudent ? (
              <>
                <span>Switch to Teacher</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Switch to Student</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>EduPulse Nexus v2.4</span>
          <span className="flex items-center gap-1 text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Accredited
          </span>
        </div>
      </div>
    </aside>
  );
};
