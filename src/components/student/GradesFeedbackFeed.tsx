import React, { useState } from 'react';
import { Award, ChevronRight, MessageSquare, TrendingUp, X } from 'lucide-react';
import { StudentGradeItem } from '../../types/index.ts';

interface GradesFeedbackFeedProps {
  grades: StudentGradeItem[];
}

export const GradesFeedbackFeed: React.FC<GradesFeedbackFeedProps> = ({
  grades,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<StudentGradeItem | null>(null);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Grades & Feedback
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Recent evaluations & qualitative faculty commentary
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {grades.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedGrade(item)}
            className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
          >
            {/* Top row: Course code + Score badge */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-indigo-700">
                {item.courseCode} · {item.category}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 tabular-nums font-mono">
                  {item.score}/{item.maxScore}
                </span>
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.2 rounded tabular-nums ${
                    item.score >= 90
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-indigo-700 bg-indigo-50'
                  }`}
                >
                  {item.letterGrade}
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xs md:text-sm font-semibold text-slate-900 group-hover:text-indigo-900 transition-colors line-clamp-1">
              {item.assignmentTitle}
            </h3>

            {/* Qualitative Teacher Note Quote */}
            <div className="mt-2 pl-2.5 border-l-2 border-indigo-400/80 bg-white/70 py-1 pr-1 rounded-r">
              <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-2">
                &ldquo;{item.teacherNote}&rdquo;
              </p>
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>— {item.teacherName}</span>
                <span className="tabular-nums">{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for detailed evaluation */}
      {selectedGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-indigo-700">
                  {selectedGrade.courseCode} · {selectedGrade.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedGrade.assignmentTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedGrade(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div>
                  <span className="text-xs text-slate-500">Official Score</span>
                  <div className="text-xl font-bold text-slate-900 tabular-nums font-mono mt-0.5">
                    {selectedGrade.score} / {selectedGrade.maxScore}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Equated Grade</span>
                  <div className="text-xl font-bold text-emerald-600 tabular-nums mt-0.5">
                    {selectedGrade.letterGrade}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Instructor Evaluation & Rubric
                </h4>
                <div className="p-3.5 bg-indigo-50/40 border border-indigo-100 rounded-xl text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;{selectedGrade.teacherNote}&rdquo;
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 text-right">
                  Evaluated by {selectedGrade.teacherName} on {selectedGrade.date}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedGrade(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
