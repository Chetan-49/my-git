import React, { useState } from 'react';
import {
  Settings,
  Bell,
  User,
  Shield,
  Palette,
  Check,
  Save,
  Moon,
  Sun,
  Sparkles,
  Edit3,
} from 'lucide-react';
import { Role, ProfileData } from '../../types/index.ts';
import { EditProfileModal } from '../common/EditProfileModal.tsx';

interface SettingsViewProps {
  role: Role;
  onSavePreferences: (message: string) => void;
  onRoleToggle: (role: Role) => void;
  theme?: 'light' | 'dark';
  onThemeToggle?: (newTheme: 'light' | 'dark') => void;
  profile?: ProfileData;
  onUpdateProfile?: (updatedProfile: ProfileData) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  role,
  onSavePreferences,
  onRoleToggle,
  theme = 'light',
  onThemeToggle,
  profile = {
    displayName: role === 'student' ? 'Alex Rivera' : 'Prof. Marcus Vance',
    avatarUrl: '',
    email: role === 'student' ? 'a.rivera@edupulse.edu' : 'm.vance@edupulse.edu',
    titleOrProgram:
      role === 'student'
        ? 'B.S. in Data Science (Sophomore)'
        : 'Lead Faculty, Department of Applied Mathematics',
  },
  onUpdateProfile,
}) => {
  const isStudent = role === 'student';

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [gradeNotification, setGradeNotification] = useState(true);
  const [digestCadence, setDigestCadence] = useState('daily');
  const [defaultRolePreference, setDefaultRolePreference] = useState<Role>(role);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePreferences('Portal settings and notification preferences updated successfully.');
  };

  const handleToggleThemeMode = (mode: 'light' | 'dark') => {
    if (onThemeToggle) {
      onThemeToggle(mode);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          System Preferences & Account Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your role simulation defaults, appearance theme, email notifications, and academic profile
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Account Profile Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Active Academic Identity
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsEditProfileModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 border border-indigo-200/80 rounded-lg transition-all focus:outline-none shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile Information</span>
            </button>
          </div>

          {/* Profile Overview Card */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-slate-50/70 border border-slate-200/70 rounded-xl">
            <div className="relative shrink-0">
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-16 h-16 rounded-xl object-cover ring-2 ring-indigo-500/20 shadow-sm bg-slate-200"
                referrerPolicy="no-referrer"
              />
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full ring-2 ring-white bg-emerald-500"
                title="Verified active session"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 truncate">
                  {profile.displayName}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                  {role}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {profile.titleOrProgram}
              </p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {profile.email}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsEditProfileModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors self-start sm:self-auto shrink-0 shadow-xs"
            >
              Update Photo &amp; Details
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Full Display Name
              </label>
              <input
                type="text"
                disabled
                value={profile.displayName}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                University Email Address
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Dark Mode Theme Toggle Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Display Appearance & Theme
              </h2>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
              Active: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Switch between crisp light mode and low-light dark mode. Toggling updates CSS custom properties across all dashboard surfaces, typography, cards, and data visualizers.
          </p>

          {/* Theme selector cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Light Mode Card */}
            <button
              type="button"
              onClick={() => handleToggleThemeMode('light')}
              className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer focus:outline-none ${
                theme === 'light'
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900">
                      Standard Light Mode
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      Clean high-contrast surfaces
                    </span>
                  </div>
                </div>
                {theme === 'light' && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                )}
              </div>

              {/* Mini visual tokens preview */}
              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-2 text-[10px] text-slate-500">
                <span className="w-3 h-3 rounded-full bg-slate-100 border border-slate-300" title="Canvas: #F8FAFC" />
                <span className="w-3 h-3 rounded-full bg-white border border-slate-300" title="Card: #FFFFFF" />
                <span className="w-3 h-3 rounded-full bg-indigo-600" title="Accent: #4F46E5" />
                <span className="ml-1">Default Campus Theme</span>
              </div>
            </button>

            {/* Dark Mode Card */}
            <button
              type="button"
              onClick={() => handleToggleThemeMode('dark')}
              className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer focus:outline-none ${
                theme === 'dark'
                  ? 'border-indigo-500 bg-slate-900 text-white ring-2 ring-indigo-500/30 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-900 text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white">
                      Low-Light Dark Mode
                    </span>
                    <span className="block text-[11px] text-slate-400">
                      Comfortable late-night study
                    </span>
                  </div>
                </div>
                {theme === 'dark' && (
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                )}
              </div>

              {/* Mini visual tokens preview */}
              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center gap-2 text-[10px] text-slate-400">
                <span className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800" title="Canvas: #0B0F19" />
                <span className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" title="Card: #111827" />
                <span className="w-3 h-3 rounded-full bg-indigo-500" title="Accent: #6366F1" />
                <span className="ml-1 text-slate-300">Low-Glare CSS Variables</span>
              </div>
            </button>
          </div>

          {/* Quick toggle bar */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-indigo-500" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span className="text-slate-700 font-medium">
                {theme === 'dark'
                  ? 'Dark mode CSS variables are active across root elements.'
                  : 'Light mode active with standard educational palette.'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleToggleThemeMode(theme === 'dark' ? 'light' : 'dark')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-700'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>
        </div>

        {/* Role Default Preference */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Dual-Role Default Landing Mode
            </h2>
          </div>

          <p className="text-xs text-slate-500">
            Choose which portal workspace EduPulse Nexus loads on launch:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setDefaultRolePreference('student');
                onRoleToggle('student');
              }}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                role === 'student'
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-50'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <span className="block text-xs font-bold text-slate-900">
                Student Workspace
              </span>
              <span className="block text-[11px] text-slate-500 mt-1">
                Prioritizes active coursework, due tasks, GPA, and personal feedback.
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDefaultRolePreference('teacher');
                onRoleToggle('teacher');
              }}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                role === 'teacher'
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-50'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <span className="block text-xs font-bold text-slate-900">
                Teacher / Faculty Console
              </span>
              <span className="block text-[11px] text-slate-500 mt-1">
                Prioritizes class cohort operations, grading queue, and analytics metrics.
              </span>
            </button>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Academic Alerts & Digest Cadence
            </h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-slate-50/70 rounded-lg border border-slate-200/70 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-slate-900 block">
                  Email Notifications
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Receive instant emails when assignments are posted or grades published
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50/70 rounded-lg border border-slate-200/70 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-slate-900 block">
                  24-Hour Deadline Warnings
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Highlight pending deliverables due within 24 hours in the top utility bar
                </span>
              </div>
              <input
                type="checkbox"
                checked={deadlineReminders}
                onChange={(e) => setDeadlineReminders(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50/70 rounded-lg border border-slate-200/70 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-slate-900 block">
                  Grading Queue Batch Alerts
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Notify faculty when cohort submission volume exceeds 5 unreviewed items
                </span>
              </div>
              <input
                type="checkbox"
                checked={gradeNotification}
                onChange={(e) => setGradeNotification(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Edit Profile Modal */}
      {onUpdateProfile && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          initialProfile={profile}
          onSave={onUpdateProfile}
          role={role}
        />
      )}
    </div>
  );
};
