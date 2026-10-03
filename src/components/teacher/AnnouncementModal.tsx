import React, { useState } from 'react';
import { X, Send, Megaphone, AlertCircle } from 'lucide-react';
import { TeacherClass, Announcement } from '../../types/index.ts';

interface AnnouncementModalProps {
  classes: TeacherClass[];
  isOpen: boolean;
  onClose: () => void;
  onPostAnnouncement: (announcement: Omit<Announcement, 'id' | 'postedAt'>) => void;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  classes,
  isOpen,
  onClose,
  onPostAnnouncement,
}) => {
  const [selectedClassId, setSelectedClassId] = useState(
    classes.length > 0 ? classes[0].id : ''
  );
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'normal' | 'important'>('normal');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an announcement headline.');
      return;
    }
    if (!content.trim()) {
      setError('Please enter the announcement body content.');
      return;
    }

    const targetClass = classes.find((c) => c.id === selectedClassId);

    onPostAnnouncement({
      classId: selectedClassId,
      className: targetClass ? targetClass.name : 'All Classes',
      title: title.trim(),
      content: content.trim(),
      author: 'Prof. Marcus Vance',
      priority,
    });

    // Reset and close
    setTitle('');
    setContent('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Post Class Announcement
              </h2>
              <p className="text-xs text-slate-500">
                Broadcast notification to enrolled student portals
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Course / Class Cohort
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.name} ({c.studentCount} students)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Announcement Title
            </label>
            <input
              type="text"
              placeholder="e.g. Exam Review Session Location Moved, Office Hours Schedule"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Message Content
            </label>
            <textarea
              rows={4}
              placeholder="Type the message for your students..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-slate-800 resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Priority Flag
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  checked={priority === 'normal'}
                  onChange={() => setPriority('normal')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Standard Announcement</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  checked={priority === 'important'}
                  onChange={() => setPriority('important')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span className="font-semibold text-amber-800">
                  High Priority / Urgent Alert
                </span>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Announcement</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
