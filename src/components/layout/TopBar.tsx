import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Check,
  CheckCheck,
  Sparkles,
  GraduationCap,
  Briefcase,
  Menu,
  X,
  ExternalLink,
  BookOpen,
  FileText,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Role, NotificationItem, NavTab } from '../../types/index.ts';

interface TopBarProps {
  role: Role;
  onRoleToggle: (newRole: Role) => void;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  onMobileMenuToggle: () => void;
  mobileMenuOpen: boolean;
  onSearchResultSelect?: (type: 'course' | 'task' | 'class' | 'grade', title: string) => void;
  theme?: 'light' | 'dark';
  onThemeToggle?: (newTheme: 'light' | 'dark') => void;
  focusMode?: boolean;
  onToggleFocusMode?: (active: boolean) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  role,
  onRoleToggle,
  activeTab,
  onTabChange,
  notifications,
  onMarkNotificationRead,
  onClearNotifications,
  onMobileMenuToggle,
  mobileMenuOpen,
  onSearchResultSelect,
  theme = 'light',
  onThemeToggle,
  focusMode = false,
  onToggleFocusMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const relevantNotifications = notifications.filter(
    (n) => n.targetRole === 'both' || n.targetRole === role
  );
  const unreadCount = relevantNotifications.filter((n) => n.unread).length;

  // Search indexing
  const searchableItems = [
    { title: 'AP Calculus BC (MATH 241)', type: 'course', tab: 'courses' as NavTab, desc: 'Prof. Vance · Room B-104' },
    { title: 'Physics 101: Mechanics & Optics', type: 'course', tab: 'courses' as NavTab, desc: 'Dr. Chen · SciLab 3' },
    { title: 'Data Structures & Algorithms (CS 201)', type: 'course', tab: 'courses' as NavTab, desc: 'Prof. Rostova · Turing Hall' },
    { title: 'Organic Chemistry I (CHEM 110)', type: 'course', tab: 'courses' as NavTab, desc: 'Dr. Jenkins · ChemLab 201' },
    { title: "Calculus Problem Set 7: Green's Theorem", type: 'assignment', tab: 'assignments' as NavTab, desc: 'Due Today at 11:59 PM' },
    { title: "Optics & Snell's Law Lab Report", type: 'assignment', tab: 'assignments' as NavTab, desc: 'Due Today at 05:00 PM' },
    { title: 'Midterm Exam 1: Integration Techniques', type: 'grade', tab: 'assignments' as NavTab, desc: 'Score: 94/100 (A)' },
    { title: 'Linear Algebra & Vector Spaces', type: 'course', tab: 'courses' as NavTab, desc: 'MATH 310 · 34 students' },
  ];

  const searchResults = searchQuery.trim()
    ? searchableItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-white border-b border-slate-200">
      {/* Zone 1: Mobile toggle + Breadcrumb / Portal Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
          <span className="font-semibold text-slate-800">EduPulse Nexus</span>
          <span aria-hidden="true" className="text-slate-300">/</span>
          <span className="capitalize text-slate-600 font-medium">
            {activeTab === 'dashboard' ? 'Overview' : activeTab}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-xs text-indigo-700 bg-indigo-50 font-medium px-2 py-0.5 rounded">
            {role === 'student' ? 'Student Workspace' : 'Faculty Console'}
          </span>
        </div>
      </div>

      {/* Zone 2: Global Search Input */}
      <div className="relative flex-1 max-w-md mx-4" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search courses, assignments..."
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Live Search Autocomplete Dropdown */}
        {searchOpen && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in-50">
            <div className="p-2 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Search Results ({searchResults.length})
            </div>
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching academic records found for &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onTabChange(item.tab);
                      setSearchOpen(false);
                      setSearchQuery('');
                      if (onSearchResultSelect) {
                        onSearchResultSelect(item.type as any, item.title);
                      }
                    }}
                    className="w-full text-left p-3 hover:bg-slate-50 transition-colors flex items-start gap-2.5 focus:outline-none"
                  >
                    {item.type === 'course' ? (
                      <BookOpen className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    ) : (
                      <FileText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-800 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 capitalize">
                      {item.tab}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Zone 3: Notifications & Persistent Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white tabular-nums ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in-50">
              <div className="flex items-center justify-between p-3.5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    Notifications
                  </span>
                  <span className="text-[11px] text-slate-500 tabular-nums">
                    {unreadCount} unread
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onClearNotifications}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 focus:outline-none"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {relevantNotifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No new academic alerts.
                  </div>
                ) : (
                  relevantNotifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`p-3.5 transition-colors cursor-pointer text-left hover:bg-slate-50 ${
                        n.unread ? 'bg-indigo-50/30' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-900 leading-tight">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap tabular-nums">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {n.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 capitalize">
                          {n.category}
                        </span>
                        {n.unread ? (
                          <span className="text-[10px] text-indigo-600 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                            Unread
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Read</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Dark Mode Theme Toggle */}
        {onThemeToggle && (
          <button
            onClick={() => onThemeToggle(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>
        )}

        {/* Student Focus Mode Toggle */}
        {role === 'student' && onToggleFocusMode && (
          <button
            onClick={() => onToggleFocusMode(!focusMode)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all focus:outline-none ${
              focusMode
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
            title={focusMode ? 'Exit Focus Mode (Esc)' : 'Enter full-screen study Focus Mode'}
          >
            {focusMode ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit Focus</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Focus Mode</span>
              </>
            )}
          </button>
        )}

        {/* Persistent, High-Visibility Role Switcher Toggle */}
        <div className="relative flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            onClick={() => onRoleToggle('student')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap focus:outline-none ${
              role === 'student'
                ? 'bg-white text-indigo-900 shadow-sm border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Switch to Student View"
          >
            <GraduationCap className={`w-3.5 h-3.5 ${role === 'student' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Student View</span>
            <span className="sm:hidden">Student</span>
          </button>

          <button
            onClick={() => onRoleToggle('teacher')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap focus:outline-none ${
              role === 'teacher'
                ? 'bg-white text-indigo-900 shadow-sm border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Switch to Teacher View"
          >
            <Briefcase className={`w-3.5 h-3.5 ${role === 'teacher' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Teacher View</span>
            <span className="sm:hidden">Teacher</span>
          </button>
        </div>
      </div>
    </header>
  );
};
