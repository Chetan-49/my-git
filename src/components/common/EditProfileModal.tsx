import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Image as ImageIcon,
  Save,
  Check,
  Sparkles,
  RefreshCw,
  Mail,
  GraduationCap,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { ProfileData, Role } from '../../types/index.ts';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile: ProfileData;
  onSave: (updatedProfile: ProfileData) => void;
  role: Role;
}

const PRESET_AVATARS = [
  {
    name: 'Academic Scholar 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  },
  {
    name: 'Academic Scholar 2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  },
  {
    name: 'Academic Scholar 3',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  },
  {
    name: 'Academic Scholar 4',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  initialProfile,
  onSave,
  role,
}) => {
  const [displayName, setDisplayName] = useState(initialProfile.displayName);
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatarUrl);
  const [email, setEmail] = useState(initialProfile.email);
  const [titleOrProgram, setTitleOrProgram] = useState(initialProfile.titleOrProgram);
  const [imageError, setImageError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync state whenever modal opens or initialProfile changes
  useEffect(() => {
    if (isOpen) {
      setDisplayName(initialProfile.displayName);
      setAvatarUrl(initialProfile.avatarUrl);
      setEmail(initialProfile.email);
      setTitleOrProgram(initialProfile.titleOrProgram);
      setImageError(false);
      setErrorMessage('');
    }
  }, [isOpen, initialProfile]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setErrorMessage('Display name cannot be empty.');
      return;
    }

    onSave({
      displayName: displayName.trim(),
      avatarUrl: avatarUrl.trim() || initialProfile.avatarUrl,
      email: email.trim(),
      titleOrProgram: titleOrProgram.trim(),
    });
    onClose();
  };

  const handleResetToDefault = () => {
    setDisplayName(role === 'student' ? 'Alex Rivera' : 'Prof. Marcus Vance');
    setAvatarUrl(initialProfile.avatarUrl);
    setEmail(role === 'student' ? 'a.rivera@edupulse.edu' : 'm.vance@edupulse.edu');
    setTitleOrProgram(
      role === 'student' ? 'B.S. in Data Science' : 'Faculty Lead, Applied Mathematics'
    );
    setImageError(false);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in-50">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Edit Profile Information
              </h2>
              <p className="text-xs text-slate-500">
                Update your display name, avatar photo, and academic credentials
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Profile Picture Live Preview & URL Input */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              Profile Picture Preview &amp; URL
            </label>

            <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <div className="relative shrink-0">
                <img
                  src={imageError || !avatarUrl ? initialProfile.avatarUrl : avatarUrl}
                  alt={displayName}
                  onError={() => setImageError(true)}
                  onLoad={() => setImageError(false)}
                  className="w-16 h-16 rounded-xl object-cover ring-2 ring-indigo-500/30 shadow-sm bg-slate-200"
                  referrerPolicy="no-referrer"
                />
                <span
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full ring-2 ring-white bg-emerald-500"
                  title="Profile verified"
                />
              </div>

              <div className="flex-1 min-w-0">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={avatarUrl}
                  onChange={(e) => {
                    setAvatarUrl(e.target.value);
                    setImageError(false);
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                />
                <span className="block text-[11px] text-slate-500 mt-1">
                  Enter any direct image URL, or choose a preset below
                </span>
              </div>
            </div>

            {/* Preset Avatars Bar */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-600 block">
                Quick Preset Avatars:
              </span>
              <div className="flex items-center gap-2">
                {PRESET_AVATARS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAvatarUrl(preset.url);
                      setImageError(false);
                    }}
                    className={`relative rounded-lg p-0.5 border transition-all cursor-pointer ${
                      avatarUrl === preset.url
                        ? 'border-indigo-600 ring-2 ring-indigo-400/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                    title={preset.name}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-8 h-8 rounded-md object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setAvatarUrl(initialProfile.avatarUrl);
                    setImageError(false);
                  }}
                  className="ml-auto text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 focus:outline-none"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Restore Original</span>
                </button>
              </div>
            </div>
          </div>

          {/* Display Name Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Full Display Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alex Rivera or Prof. Marcus Vance"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 font-medium"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <span className="text-[11px] text-slate-500">
              This name will be displayed in the sidebar, header greeting, and class rosters.
            </span>
          </div>

          {/* Academic Program / Department Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              {role === 'student' ? 'Degree Program / Major' : 'Department & Faculty Title'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={titleOrProgram}
                onChange={(e) => setTitleOrProgram(e.target.value)}
                placeholder={
                  role === 'student'
                    ? 'e.g. B.S. in Data Science'
                    : 'e.g. Lead Faculty, Applied Mathematics'
                }
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900"
              />
              {role === 'student' ? (
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              ) : (
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              )}
            </div>
          </div>

          {/* University Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              University Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@edupulse.edu"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
              Reset to Defaults
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors focus:outline-none"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
