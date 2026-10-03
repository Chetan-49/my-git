import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  Sparkles,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  Target,
  Layers,
} from 'lucide-react';
import {
  StudentCourse,
  StudentTask,
  StudentGradeItem,
} from '../../types/index.ts';
import { ActiveCoursesGrid } from './ActiveCoursesGrid.tsx';
import { UpcomingTasksChecklist } from './UpcomingTasksChecklist.tsx';
import { GradesFeedbackFeed } from './GradesFeedbackFeed.tsx';

interface StudentDashboardProps {
  courses: StudentCourse[];
  tasks: StudentTask[];
  grades: StudentGradeItem[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (newTask: Omit<StudentTask, 'id' | 'completed'>) => void;
  onOpenCourseModal: (course: StudentCourse) => void;
  focusMode?: boolean;
  onToggleFocusMode?: (active: boolean) => void;
  studentName?: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  courses,
  tasks,
  grades,
  onToggleTask,
  onAddTask,
  onOpenCourseModal,
  focusMode = false,
  onToggleFocusMode,
  studentName = 'Alex Rivera',
}) => {
  const pendingTasks = tasks.filter((t) => !t.completed);
  const dueTodayTasks = tasks.filter((t) => !t.completed && t.isDueToday);

  // Focus Mode Pomodoro Timer state
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (focusMode && timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [focusMode, timerRunning, timerSeconds]);

  // Keyboard shortcut: Press Escape to exit focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && focusMode && onToggleFocusMode) {
        onToggleFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusMode, onToggleFocusMode]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(25 * 60);
  };

  return (
    <div className={`space-y-6 ${focusMode ? 'max-w-6xl mx-auto py-2' : ''}`}>
      {/* FOCUS MODE ACTIVE AMBIENT BAR */}
      {focusMode ? (
        <div className="p-4 bg-slate-900 text-white rounded-2xl border border-indigo-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in-50 slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
              <Target className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Focus Mode Active
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] text-slate-400">
                  Sidebar &amp; Analytics Hidden · Full Workspace
                </span>
              </div>
              <h2 className="text-sm font-bold text-white mt-0.5">
                Deep Study Session · {pendingTasks.length} Deliverables in Queue
              </h2>
            </div>
          </div>

          {/* Pomodoro Timer and Exit Button */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* Focus Timer */}
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-xl">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold font-mono tabular-nums text-white min-w-12 text-center">
                {formatTimer(timerSeconds)}
              </span>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="p-1 text-slate-300 hover:text-white rounded focus:outline-none transition-colors"
                title={timerRunning ? 'Pause timer' : 'Start focus timer'}
              >
                {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleResetTimer}
                className="p-1 text-slate-400 hover:text-slate-200 rounded focus:outline-none transition-colors"
                title="Reset to 25 minutes"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Exit Focus Mode Button */}
            <button
              onClick={() => onToggleFocusMode && onToggleFocusMode(false)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors focus:outline-none shadow-xs"
              title="Exit focus mode (Press Esc)"
            >
              <Minimize2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Exit Focus Mode</span>
              <span className="text-[10px] text-slate-400 ml-0.5 border border-slate-600 px-1 py-0.2 rounded font-mono">
                Esc
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* STANDARD WELCOME BANNER */
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 md:p-8 text-white shadow-sm border border-slate-800">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Fall Semester 2026 · Week 7</span>
              </div>

              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Good morning, {studentName}! You have {dueTodayTasks.length}{' '}
                {dueTodayTasks.length === 1 ? 'assignment' : 'assignments'} due today.
              </h1>

              <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed">
                Your next session is <strong className="text-white">AP Calculus BC</strong> with Prof. Vance at 10:15 AM in Hall B. You have achieved an average assignment completion score of 92.8% this month.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-md text-white font-medium">
                  <Calendar className="w-3.5 h-3.5 text-indigo-300" />
                  Friday, Oct 2, 2026
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-md text-white font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  Calculus PS7 due in 7h 25m
                </span>
              </div>
            </div>

            {/* Focus Mode CTA Button */}
            {onToggleFocusMode && (
              <div className="shrink-0">
                <button
                  onClick={() => onToggleFocusMode(true)}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-900/30 transition-all focus:outline-none hover:scale-102"
                  title="Expand to distraction-free study mode"
                >
                  <Maximize2 className="w-4 h-4 text-indigo-200" />
                  <span>Enter Focus Mode</span>
                </button>
                <span className="block text-[10px] text-slate-400 mt-1.5 text-center">
                  Hides sidebar &amp; analytics
                </span>
              </div>
            )}
          </div>

          {/* Subtle decorative background motif */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-400 via-blue-500 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Grid Row 1 (KPI Metrics - HIDDEN in Focus Mode to eliminate distraction) */}
      {!focusMode && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Metric 1: Current GPA */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Current GPA
              </span>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded tabular-nums">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>+0.08 vs Term 3</span>
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-bold text-slate-900 tabular-nums font-mono">
                3.85
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 4.00 Scale</span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">
              Dean&apos;s Honor Roll candidate · 54 credits completed
            </p>
          </div>

          {/* Metric 2: Attendance Rate */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Attendance Rate
              </span>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                High Standing
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-bold text-slate-900 tabular-nums font-mono">
                96.4%
              </span>
              <span className="text-xs text-slate-400 font-medium">Semester avg</span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">
              27 of 28 lecture sessions attended across 4 modules
            </p>
          </div>

          {/* Metric 3: Pending Assignments */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Pending Assignments
              </span>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded tabular-nums">
                {dueTodayTasks.length} Due Today
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-bold text-slate-900 tabular-nums font-mono">
                {pendingTasks.length}
              </span>
              <span className="text-xs text-slate-400 font-medium">Active deliverables</span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">
              Next deliverable: Optics Lab Report (05:00 PM)
            </p>
          </div>
        </div>
      )}

      {/* Grid Row 2 (Main Workspace: Expanded to 100% full-width in Focus Mode, 70/30 in standard mode) */}
      <div
        className={
          focusMode
            ? 'space-y-6 w-full'
            : 'grid grid-cols-1 lg:grid-cols-12 gap-6'
        }
      >
        {/* Main Work Area: Active Courses + Upcoming Tasks */}
        <div
          className={
            focusMode
              ? 'space-y-6 w-full'
              : 'lg:col-span-8 space-y-6'
          }
        >
          <UpcomingTasksChecklist
            tasks={tasks}
            onToggleTask={onToggleTask}
            onAddTask={onAddTask}
          />
          <ActiveCoursesGrid
            courses={courses}
            onOpenCourseModal={onOpenCourseModal}
          />
        </div>

        {/* Right Column: Grades & Feedback feed (HIDDEN in Focus Mode to eliminate distraction) */}
        {!focusMode && (
          <div className="lg:col-span-4">
            <GradesFeedbackFeed grades={grades} />
          </div>
        )}
      </div>
    </div>
  );
};
