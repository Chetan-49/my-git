import React, { useState } from 'react';
import {
  Users,
  Clock,
  ClipboardList,
  TrendingUp,
  Megaphone,
  Plus,
  BookOpen,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { TeacherClass } from '../../types/index.ts';

interface ManagedClassesGridProps {
  classes: TeacherClass[];
  onOpenAnnouncementModal: () => void;
  onOpenCreateAssignmentModal: () => void;
  onSelectClass: (c: TeacherClass) => void;
}

export const ManagedClassesGrid: React.FC<ManagedClassesGridProps> = ({
  classes,
  onOpenAnnouncementModal,
  onOpenCreateAssignmentModal,
  onSelectClass,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Managed Classes & Cohorts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational oversight across 4 active course sections · 112 students
          </p>
        </div>

        {/* Global Class Management Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAnnouncementModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors focus:outline-none"
          >
            <Megaphone className="w-3.5 h-3.5 text-indigo-600" />
            <span>Post Announcement</span>
          </button>

          <button
            onClick={onOpenCreateAssignmentModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors focus:outline-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="flex flex-col justify-between p-4 rounded-xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-xs transition-all duration-200 bg-slate-50/50 hover:bg-white group"
          >
            <div>
              {/* Header: Code & Term */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-indigo-700 tracking-wide">
                  {cls.code}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {cls.term}
                </span>
              </div>

              {/* Class Name */}
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-900 transition-colors line-clamp-1">
                {cls.name}
              </h3>

              {/* Quick metrics grid */}
              <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 bg-white rounded-lg border border-slate-200/70 text-xs">
                <div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Cohort Size</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 tabular-nums font-mono block mt-0.5">
                    {cls.studentCount} Students
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
                    <span>Pending Tasks</span>
                  </div>
                  <span
                    className={`text-sm font-bold tabular-nums font-mono block mt-0.5 ${
                      cls.pendingGradingCount > 0
                        ? 'text-amber-700'
                        : 'text-emerald-700'
                    }`}
                  >
                    {cls.pendingGradingCount} Submissions
                  </span>
                </div>
              </div>

              {/* Schedule and Performance */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{cls.nextSession}</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-slate-700">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="tabular-nums font-mono">{cls.averageScore}% avg</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                {cls.attendanceRate}% Attendance
              </span>

              <button
                onClick={() => onSelectClass(cls)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors focus:outline-none"
              >
                <span>Class Roster & Tools</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
