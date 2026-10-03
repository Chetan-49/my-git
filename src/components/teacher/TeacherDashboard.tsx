import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Users,
  Award,
  Sparkles,
  Megaphone,
  BarChart3,
  LayoutGrid,
  ChevronRight,
} from 'lucide-react';
import {
  TeacherClass,
  SubmissionQueueItem,
  Announcement,
} from '../../types/index.ts';
import { ManagedClassesGrid } from './ManagedClassesGrid.tsx';
import { GradingQueue } from './GradingQueue.tsx';
import { TeacherAnalyticsView } from './TeacherAnalyticsView.tsx';

interface TeacherDashboardProps {
  classes: TeacherClass[];
  submissions: SubmissionQueueItem[];
  announcements: Announcement[];
  onGradeSubmit: (
    submissionId: string,
    score: number,
    feedback: string
  ) => void;
  onOpenAnnouncementModal: () => void;
  onOpenCreateAssignmentModal: () => void;
  onSelectClass: (c: TeacherClass) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  classes,
  submissions,
  announcements,
  onGradeSubmit,
  onOpenAnnouncementModal,
  onOpenCreateAssignmentModal,
  onSelectClass,
}) => {
  const [dashboardView, setDashboardView] = useState<'operations' | 'analytics'>('operations');
  const ungradedSubmissions = submissions.filter((s) => s.status === 'ungraded');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 md:p-8 text-white shadow-sm border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Faculty Operations Console · Fall 2026</span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Welcome back, Professor Vance.{' '}
            <span className="text-amber-300 font-semibold tabular-nums">
              {ungradedSubmissions.length}{' '}
              {ungradedSubmissions.length === 1 ? 'assignment requires' : 'assignments require'}
            </span>{' '}
            grading.
          </h1>

          <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed">
            Your cohort in <strong className="text-white">AP Calculus BC (Section 01)</strong> has their next lecture session at 10:15 AM in Hall B-104. 6 new student submissions for Problem Set 7 were received this morning.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-md text-white font-medium">
              <Calendar className="w-3.5 h-3.5 text-indigo-300" />
              Friday, Oct 2, 2026
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-md text-white font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              Next Lecture: 10:15 AM (Hall B-104)
            </span>
          </div>
        </div>

        {/* Decorative subtle background accents */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-indigo-500 to-transparent pointer-events-none" />
      </div>

      {/* Grid Row 1 (KPI Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Average Class Performance */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Average Class Performance
            </span>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              Cohort B+
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold text-slate-900 tabular-nums font-mono">
              84.2%
            </span>
            <span className="text-xs text-slate-400 font-medium">(B+) Mean Score</span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">
            Calculated across all 112 active enrolled students
          </p>
        </div>

        {/* Metric 2: Overall Student Engagement */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Overall Student Engagement
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded tabular-nums">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>+3.2% this month</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold text-slate-900 tabular-nums font-mono">
              91.8%
            </span>
            <span className="text-xs text-slate-400 font-medium">Activity Index</span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">
            Portal logins, timely submissions, and lecture attendance
          </p>
        </div>

        {/* Metric 3: Ungraded Submissions (High Priority Highlight) */}
        <div className="p-5 bg-amber-50/40 border border-amber-200 rounded-xl shadow-xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900">
              Ungraded Submissions
            </span>
            <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
              High Priority
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold text-amber-900 tabular-nums font-mono">
              {ungradedSubmissions.length}
            </span>
            <span className="text-xs text-amber-800 font-medium">Awaiting evaluation</span>
          </div>
          <p className="mt-1.5 text-[11px] text-amber-700">
            {ungradedSubmissions.length > 0
              ? 'Click items in queue below to score & provide feedback'
              : 'All pending submissions have been graded!'}
          </p>
        </div>
      </div>

      {/* View Switcher Tabs within Teacher Dashboard */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDashboardView('operations')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none ${
              dashboardView === 'operations'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Class Operations & Queue</span>
          </button>

          <button
            onClick={() => setDashboardView('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none ${
              dashboardView === 'analytics'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Teacher Analytics (Completion vs. Scores)</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline">
          {dashboardView === 'operations'
            ? 'Viewing managed classes & grading queue'
            : 'Viewing class-wide completion rates vs. average scores'}
        </span>
      </div>

      {/* Conditional Dashboard Views */}
      {dashboardView === 'analytics' ? (
        <TeacherAnalyticsView
          classes={classes}
          onOpenAnnouncementModal={onOpenAnnouncementModal}
          onOpenCreateAssignmentModal={onOpenCreateAssignmentModal}
        />
      ) : (
        /* Standard Grid Row 2 (Main Workspace: 70% / 30% split) */
        <div className="space-y-6">
          {/* Teaser Banner to Teacher Analytics */}
          <div className="p-4 bg-gradient-to-r from-indigo-50/90 to-blue-50/60 border border-indigo-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Teacher Analytics: Assignment Completion vs. Average Scores
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  View interactive bar charts comparing deliverable turn-in velocity against student grade marks.
                </p>
              </div>
            </div>

            <button
              onClick={() => setDashboardView('analytics')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors shrink-0 self-start sm:self-auto"
            >
              <span>Explore Analytics Chart</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (70% ~ 8 cols on lg) */}
            <div className="lg:col-span-8 space-y-6">
              <ManagedClassesGrid
                classes={classes}
                onOpenAnnouncementModal={onOpenAnnouncementModal}
                onOpenCreateAssignmentModal={onOpenCreateAssignmentModal}
                onSelectClass={onSelectClass}
              />

              {/* Recent Broadcast Announcements */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Published Class Announcements
                    </h3>
                  </div>
                  <button
                    onClick={onOpenAnnouncementModal}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    + New Announcement
                  </button>
                </div>

                <div className="space-y-3">
                  {announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 hover:bg-white transition-all text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-indigo-700">
                          {ann.className}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {ann.postedAt}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900 text-xs mb-1">
                        {ann.title}
                      </h4>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {ann.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (30% ~ 4 cols on lg) */}
            <div className="lg:col-span-4">
              <GradingQueue
                submissions={submissions}
                onGradeSubmit={onGradeSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
