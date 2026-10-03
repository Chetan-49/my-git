import React, { useState } from 'react';
import { X, Plus, Calendar, Clock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { TeacherClass } from '../../types/index.ts';

interface CreateAssignmentModalProps {
  classes: TeacherClass[];
  isOpen: boolean;
  onClose: () => void;
  onCreateAssignment: (data: {
    title: string;
    classId: string;
    courseCode: string;
    dueDate: string;
    maxPoints: number;
    description: string;
  }) => void;
}

export const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({
  classes,
  isOpen,
  onClose,
  onCreateAssignment,
}) => {
  const [selectedClassId, setSelectedClassId] = useState(
    classes.length > 0 ? classes[0].id : ''
  );
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('Oct 14, 2026, 11:59 PM');
  const [maxPoints, setMaxPoints] = useState('100');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an assignment title.');
      return;
    }
    const points = parseInt(maxPoints, 10);
    if (isNaN(points) || points <= 0) {
      setError('Max points must be a positive integer.');
      return;
    }

    const targetClass = classes.find((c) => c.id === selectedClassId);

    onCreateAssignment({
      title: title.trim(),
      classId: selectedClassId,
      courseCode: targetClass ? targetClass.code : 'MATH 241',
      dueDate,
      maxPoints: points,
      description: description.trim() || 'Please submit your solutions as a PDF or handwritten scan.',
    });

    setTitle('');
    setDescription('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Create New Assignment
              </h2>
              <p className="text-xs text-slate-500">
                Publish a problem set, lab, or exam to student syllabus
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
              Class Cohort
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assignment Title
            </label>
            <input
              type="text"
              placeholder="e.g. Problem Set 8: Surface Integrals & Flux Equations"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Due Date & Time
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Max Points
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={maxPoints}
                onChange={(e) => setMaxPoints(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Submission Guidelines & Rubric Notes
            </label>
            <textarea
              rows={3}
              placeholder="Provide instructions, required file formats, proof expectations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-slate-800 resize-none leading-relaxed"
            />
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
              <Plus className="w-3.5 h-3.5" />
              <span>Publish Assignment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
