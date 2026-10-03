import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  Users,
  Clock,
  ArrowUpRight,
  Filter,
  Sparkles,
  Megaphone,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { TeacherClass } from '../../types/index.ts';

export interface CourseAnalyticsMetric {
  id: string;
  courseCode: string;
  courseName: string;
  shortName: string;
  studentCount: number;
  completionRate: number; // e.g. 94.2%
  averageScore: number; // e.g. 86.4%
  submittedAssignments: number;
  totalAssignments: number;
  letterGrade: string;
  attendanceRate: number;
}

export const DEFAULT_COURSE_ANALYTICS: CourseAnalyticsMetric[] = [
  {
    id: 'class-calc-01',
    courseCode: 'MATH 241',
    courseName: 'AP Calculus BC',
    shortName: 'AP Calculus',
    studentCount: 32,
    completionRate: 94.2,
    averageScore: 86.4,
    submittedAssignments: 211,
    totalAssignments: 224,
    letterGrade: 'B+',
    attendanceRate: 94.8,
  },
  {
    id: 'class-phys-02',
    courseCode: 'PHYS 101',
    courseName: 'Physics 101: Mechanics & Optics',
    shortName: 'Physics 101',
    studentCount: 28,
    completionRate: 88.6,
    averageScore: 82.1,
    submittedAssignments: 149,
    totalAssignments: 168,
    letterGrade: 'B',
    attendanceRate: 91.2,
  },
  {
    id: 'class-linalg-04',
    courseCode: 'MATH 310',
    courseName: 'Linear Algebra & Vector Spaces',
    shortName: 'Linear Algebra',
    studentCount: 34,
    completionRate: 91.5,
    averageScore: 84.7,
    submittedAssignments: 187,
    totalAssignments: 204,
    letterGrade: 'B',
    attendanceRate: 92.6,
  },
  {
    id: 'class-diffeq-01',
    courseCode: 'MATH 420',
    courseName: 'Honors Differential Equations',
    shortName: 'Honors DiffEq',
    studentCount: 18,
    completionRate: 96.0,
    averageScore: 89.2,
    submittedAssignments: 121,
    totalAssignments: 126,
    letterGrade: 'B+',
    attendanceRate: 97.5,
  },
];

interface TeacherAnalyticsViewProps {
  classes?: TeacherClass[];
  onOpenAnnouncementModal?: () => void;
  onOpenCreateAssignmentModal?: () => void;
}

// Custom tooltip for the dual-metric BarChart
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data: CourseAnalyticsMetric = payload[0].payload;

    return (
      <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-2xl border border-slate-700 text-xs min-w-56 animate-in fade-in-50">
        <div className="border-b border-slate-800 pb-2 mb-2">
          <span className="font-bold text-indigo-300 text-sm">{data.courseCode}</span>
          <p className="text-[11px] text-slate-300">{data.courseName}</p>
          <span className="text-[10px] text-slate-400">
            Cohort: {data.studentCount} Enrolled Students
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500" />
              <span>Completion Rate:</span>
            </span>
            <span className="font-bold text-white font-mono tabular-nums">
              {data.completionRate}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
              <span>Average Score:</span>
            </span>
            <span className="font-bold text-white font-mono tabular-nums">
              {data.averageScore}% ({data.letterGrade})
            </span>
          </div>

          <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400 flex justify-between">
            <span>Submitted Deliverables:</span>
            <span className="text-slate-200 font-mono">
              {data.submittedAssignments}/{data.totalAssignments}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const TeacherAnalyticsView: React.FC<TeacherAnalyticsViewProps> = ({
  classes,
  onOpenAnnouncementModal,
  onOpenCreateAssignmentModal,
}) => {
  const [selectedSort, setSelectedSort] = useState<'default' | 'completion' | 'score'>('default');

  const sortedData = [...DEFAULT_COURSE_ANALYTICS].sort((a, b) => {
    if (selectedSort === 'completion') return b.completionRate - a.completionRate;
    if (selectedSort === 'score') return b.averageScore - a.averageScore;
    return 0;
  });

  const aggregateCompletion = (
    DEFAULT_COURSE_ANALYTICS.reduce((sum, c) => sum + c.completionRate, 0) /
    DEFAULT_COURSE_ANALYTICS.length
  ).toFixed(1);

  const aggregateScore = (
    DEFAULT_COURSE_ANALYTICS.reduce((sum, c) => sum + c.averageScore, 0) /
    DEFAULT_COURSE_ANALYTICS.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Teacher Analytics: Course Completion vs. Graded Performance
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
              AY 2026-2027
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Class-wide evaluation comparing student assignment submission rates against average scores
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sorter segmented control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/80 text-xs">
            <button
              onClick={() => setSelectedSort('default')}
              className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                selectedSort === 'default'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Default
            </button>
            <button
              onClick={() => setSelectedSort('completion')}
              className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                selectedSort === 'completion'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Highest Completion
            </button>
            <button
              onClick={() => setSelectedSort('score')}
              className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                selectedSort === 'score'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Highest Score
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">
            Mean Assignment Completion
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums font-mono">
              {aggregateCompletion}%
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              High Engagement
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            668 of 722 total deliverables turned in across all cohorts
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">
            Cohort Average Score
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums font-mono">
              {aggregateScore}%
            </span>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              (B+) Performance
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Weighted across homework, problem sets, and laboratory exams
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">
            Velocity Correlation Index
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums font-mono">
              +0.84
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Strong Correlation
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Higher completion rates reliably predict elevated exam outcomes
          </p>
        </div>
      </div>

      {/* Primary Recharts Bar Chart Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Class-Wide Completion Rates vs. Average Scores by Course
            </h3>
            <p className="text-xs text-slate-500">
              Side-by-side grouped bars comparing student deliverable velocity against graded marks
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-indigo-600" />
              <span className="font-medium text-slate-700">Assignment Completion (%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-600" />
              <span className="font-medium text-slate-700">Average Score (%)</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Canvas */}
        <div className="w-full h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
              barGap={6}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2E8F0"
              />
              <XAxis
                dataKey="shortName"
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
              />
              <YAxis
                domain={[60, 100]}
                ticks={[60, 70, 80, 85, 90, 100]}
                tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip content={<CustomBarTooltip />} />

              {/* Department Target Benchmark at 85% */}
              <ReferenceLine
                y={85}
                stroke="#D97706"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: 'Department Standard (85%)',
                  position: 'insideTopRight',
                  fill: '#D97706',
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />

              {/* Bar 1: Completion Rate */}
              <Bar
                dataKey="completionRate"
                name="Assignment Completion Rate"
                fill="#4F46E5"
                radius={[4, 4, 0, 0]}
                maxBarSize={44}
              />

              {/* Bar 2: Average Score */}
              <Bar
                dataKey="averageScore"
                name="Average Score"
                fill="#059669"
                radius={[4, 4, 0, 0]}
                maxBarSize={44}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Explanatory Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>
              <strong>Key Diagnostic:</strong> Honors Differential Equations leads both metrics with 96.0% completion and 89.2% average score.
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Source: EduPulse Automated Gradebook Sync
          </span>
        </div>
      </div>

      {/* Course-by-Course Deep Dive Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Course-by-Course Operational Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Detailed deliverable volume, attendance standing, and completion variance
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                <th className="pb-2.5">Course & Section</th>
                <th className="pb-2.5">Class Size</th>
                <th className="pb-2.5">Completion Rate</th>
                <th className="pb-2.5">Average Score</th>
                <th className="pb-2.5">Attendance</th>
                <th className="pb-2.5 text-right">Faculty Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DEFAULT_COURSE_ANALYTICS.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3">
                    <span className="font-bold text-slate-900 block">
                      {item.courseCode} · {item.courseName}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {item.submittedAssignments} of {item.totalAssignments} tasks evaluated
                    </span>
                  </td>
                  <td className="py-3 text-slate-700 font-mono tabular-nums">
                    {item.studentCount} Students
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${item.completionRate}%` }}
                        />
                      </div>
                      <span className="font-bold text-indigo-700 font-mono tabular-nums">
                        {item.completionRate}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-emerald-700 font-mono tabular-nums">
                      {item.averageScore}%
                    </span>
                    <span className="ml-1 text-[11px] text-slate-500">
                      ({item.letterGrade})
                    </span>
                  </td>
                  <td className="py-3 text-slate-700 font-mono tabular-nums">
                    {item.attendanceRate}%
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={onOpenAnnouncementModal}
                      className="px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                    >
                      Class Reminder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Faculty Intervention Recommendation */}
      <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900 text-xs">
              Curricular Recommendation for Physics 101
            </h4>
            <p className="text-amber-800 text-xs mt-0.5 leading-relaxed">
              Physics 101 exhibits an 88.6% assignment completion rate, currently 5.6% below the cohort average. Submissions for Optics Lab Report 4 show increased turnaround friction. Consider posting supplementary error analysis templates.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCreateAssignmentModal}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shrink-0 transition-colors shadow-xs"
        >
          Post Practice Resource
        </button>
      </div>
    </div>
  );
};
