import React, { useState } from 'react';
import { X, Upload, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { StudentTask } from '../../types/index.ts';

interface SubmitAssignmentModalProps {
  task: StudentTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitWork: (taskId: string, notes: string) => void;
}

export const SubmitAssignmentModal: React.FC<SubmitAssignmentModalProps> = ({
  task,
  isOpen,
  onClose,
  onSubmitWork,
}) => {
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [fileName, setFileName] = useState('assignment_solution_final.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitWork(task.id, submissionNotes);
      setIsSubmitting(false);
      setSubmissionNotes('');
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-indigo-700">
              {task.courseCode} · Submission Portal
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              {task.title}
            </h2>
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
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs flex items-center justify-between">
            <span className="text-slate-500">Official Deadline:</span>
            <span className="font-semibold text-amber-700 tabular-nums">
              {task.dueDate}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Deliverable Document Attachment
            </label>
            <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 hover:bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
              <Upload className="w-6 h-6 text-indigo-600 mb-1.5" />
              <p className="text-xs font-semibold text-slate-800">
                {fileName}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PDF document (2.4 MB) · Verified Virus Scan Passed
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Submission Comments / Problem Notes
            </label>
            <textarea
              rows={3}
              placeholder="Add optional notes for the grader (e.g. assumptions, problem references)..."
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-slate-800 resize-none leading-relaxed"
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
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Uploading...' : 'Confirm Submission'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
