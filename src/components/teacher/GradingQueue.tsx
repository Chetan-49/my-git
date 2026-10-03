import React, { useState } from 'react';
import {
  Clock,
  User,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { SubmissionQueueItem } from '../../types/index.ts';

interface GradingQueueProps {
  submissions: SubmissionQueueItem[];
  onGradeSubmit: (
    submissionId: string,
    score: number,
    feedback: string
  ) => void;
}

export const GradingQueue: React.FC<GradingQueueProps> = ({
  submissions,
  onGradeSubmit,
}) => {
  const ungradedItems = submissions.filter((s) => s.status === 'ungraded');
  const [expandedId, setExpandedId] = useState<string | null>(
    ungradedItems.length > 0 ? ungradedItems[0].id : null
  );

  // Form states for the currently expanded submission
  const [scoreInput, setScoreInput] = useState<string>('92');
  const [feedbackInput, setFeedbackInput] = useState<string>(
    'Solid work on the Green’s theorem line integral derivation. Thorough step-by-step documentation.'
  );
  const [inputError, setInputError] = useState<string | null>(null);

  const toggleExpand = (item: SubmissionQueueItem) => {
    if (expandedId === item.id) {
      setExpandedId(null);
    } else {
      setExpandedId(item.id);
      // Pre-populate realistic suggested starter values
      setScoreInput('90');
      setFeedbackInput(
        `Good analysis of ${item.assignmentTitle}. Calculations are logically arranged and accurate.`
      );
      setInputError(null);
    }
  };

  const handleSubmit = (submissionId: string) => {
    const num = parseFloat(scoreInput);
    if (isNaN(num) || num < 0 || num > 100) {
      setInputError('Please enter a valid numeric score between 0 and 100.');
      return;
    }
    if (!feedbackInput.trim()) {
      setInputError('Please provide qualitative feedback for the student.');
      return;
    }

    setInputError(null);
    onGradeSubmit(submissionId, num, feedbackInput.trim());

    // Expand next item if available
    const remaining = ungradedItems.filter((s) => s.id !== submissionId);
    if (remaining.length > 0) {
      setExpandedId(remaining[0].id);
      setScoreInput('92');
      setFeedbackInput(
        `Well done on ${remaining[0].assignmentTitle}. Clear methodology shown throughout.`
      );
    } else {
      setExpandedId(null);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Action Item Queue
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/80 tabular-nums">
              {ungradedItems.length} Ungraded
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Student submissions awaiting grading and rubric score
          </p>
        </div>
      </div>

      {ungradedItems.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-slate-200/60 rounded-xl">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-800">
            Grading Queue All Caught Up!
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            All submitted deliverables across your 4 active classes have been evaluated.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ungradedItems.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-xl border transition-all ${
                  isExpanded
                    ? 'border-indigo-400 bg-white ring-2 ring-indigo-50 shadow-sm'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                }`}
              >
                {/* Header row - clickable to toggle */}
                <button
                  type="button"
                  onClick={() => toggleExpand(item)}
                  className="w-full text-left p-3.5 flex items-start justify-between gap-3 focus:outline-none"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {item.studentName}
                      </span>
                      <span className="text-[11px] text-slate-400 tabular-nums">
                        {item.studentId}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-indigo-700 truncate mt-0.5">
                      {item.courseCode} · {item.assignmentTitle}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Submitted {item.submittedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      Needs Grade
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Inline Expanded Grading Panel */}
                {isExpanded && (
                  <div className="px-3.5 pb-4 pt-1 border-t border-slate-100 space-y-3 animate-in fade-in-50">
                    {/* Submission excerpt / work snippet */}
                    {item.submissionSnippet && (
                      <div className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-lg text-xs text-slate-700">
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Student Work Submission Excerpt
                        </span>
                        <p className="font-mono text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200">
                          {item.submissionSnippet}
                        </p>
                      </div>
                    )}

                    {inputError && (
                      <div className="p-2 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-xs text-red-700">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{inputError}</span>
                      </div>
                    )}

                    {/* Numeric Score Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Score (out of 100)
                        </label>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Scale: 0 - 100
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={scoreInput}
                          onChange={(e) => setScoreInput(e.target.value)}
                          placeholder="e.g. 92"
                          className="w-28 px-3 py-1.5 text-xs md:text-sm font-mono font-bold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-slate-900 tabular-nums"
                        />
                        <span className="text-xs text-slate-500">/ 100 pts</span>

                        {/* Quick score buttons */}
                        <div className="flex items-center gap-1 ml-auto">
                          <button
                            type="button"
                            onClick={() => setScoreInput('95')}
                            className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                          >
                            95
                          </button>
                          <button
                            type="button"
                            onClick={() => setScoreInput('90')}
                            className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                          >
                            90
                          </button>
                          <button
                            type="button"
                            onClick={() => setScoreInput('85')}
                            className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                          >
                            85
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Custom Text Feedback Input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Qualitative Faculty Feedback
                      </label>
                      <textarea
                        rows={2}
                        value={feedbackInput}
                        onChange={(e) => setFeedbackInput(e.target.value)}
                        placeholder="Provide detailed feedback on methodology, proofs, or areas for improvement..."
                        className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-slate-800 resize-none leading-relaxed"
                      />
                    </div>

                    {/* Submit Grade Action Button */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setExpandedId(null)}
                        className="text-xs text-slate-500 hover:text-slate-700"
                      >
                        Collapse
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSubmit(item.id)}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Grade & Notify Student</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
