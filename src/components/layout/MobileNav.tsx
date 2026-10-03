import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  Settings,
} from 'lucide-react';
import { Role, NavTab } from '../../types/index.ts';

interface MobileNavProps {
  role: Role;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  pendingTasksCount: number;
  ungradedSubmissionsCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  role,
  activeTab,
  onTabChange,
  pendingTasksCount,
  ungradedSubmissionsCount,
}) => {
  const isStudent = role === 'student';

  const items = [
    { id: 'dashboard' as NavTab, label: 'Home', icon: LayoutDashboard },
    { id: 'courses' as NavTab, label: 'Courses', icon: BookOpen },
    {
      id: 'assignments' as NavTab,
      label: isStudent ? 'Tasks' : 'Grading',
      icon: ClipboardCheck,
      badge: isStudent ? pendingTasksCount : ungradedSubmissionsCount,
    },
    { id: 'analytics' as NavTab, label: 'Stats', icon: BarChart3 },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 text-[10px] font-semibold transition-colors focus:outline-none ${
              isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5 mb-0.5" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-2 bg-amber-500 text-white rounded-full text-[9px] w-3.5 h-3.5 flex items-center justify-center font-bold tabular-nums">
                  {item.badge}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
