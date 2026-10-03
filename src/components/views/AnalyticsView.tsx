import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  Mail,
  Sparkles,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { Role } from '../../types/index.ts';
import { TeacherAnalyticsView } from '../teacher/TeacherAnalyticsView.tsx';

interface AnalyticsViewProps {
  role: Role;
  onSendStudentNote?: (student: string) => void;
  onExportCsvReport?: (filename: string) => void;
}

interface GpaDataPoint {
  period: string;
  milestone: string;
  gpa: number;
  credits: number;
  highlight?: boolean;
}

// Custom Tooltip component for Recharts
const CustomGpaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data: GpaDataPoint = payload[0].payload;
    const isHonors = data.gpa >= 3.8;

    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs min-w-44 animate-in fade-in-50">
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
          <span className="font-bold text-indigo-300">{label}</span>
          {data.highlight && (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-medium">
              Current
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-300 mb-1.5 font-medium">{data.milestone}</p>
        <div className="flex items-baseline justify-between text-xs pt-1 border-t border-slate-800/80">
          <span className="text-slate-400">Cumulative GPA:</span>
          <span className="text-base font-bold text-white font-mono tabular-nums">
            {data.gpa.toFixed(2)}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px]">
          <span className="text-slate-400">Dean&apos;s Honor Benchmark:</span>
          <span className={isHonors ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
            {isHonors ? 'Achieved (≥3.80)' : 'Approaching'}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  role,
  onSendStudentNote,
  onExportCsvReport,
}) => {
  const isStudent = role === 'student';

  // Toggle between semester timeline and multi-term view
  const [timelineMode, setTimelineMode] = useState<'semester' | 'multiTerm'>('semester');

  // GPA progression over the last semester (bi-weekly checkpoints and midterm milestones)
  const semesterGpaProgression: GpaDataPoint[] = [
    { period: 'Week 1', milestone: 'Baseline & Diagnostic Tests', gpa: 3.79, credits: 15 },
    { period: 'Week 3', milestone: 'Calculus PS1 & Physics Quiz 1', gpa: 3.81, credits: 15 },
    { period: 'Week 5', milestone: 'Lab Reports & CS BST Benchmarks', gpa: 3.82, credits: 15 },
    { period: 'Week 7', milestone: 'Midterm 1 Evaluations (Current)', gpa: 3.85, credits: 15, highlight: true },
    { period: 'Week 10', milestone: 'Projected PS7 & Optics Lab', gpa: 3.86, credits: 15 },
    { period: 'Week 14', milestone: 'Projected Final Term Standing', gpa: 3.88, credits: 15 },
  ];

  // Historical multi-semester progression
  const multiTermGpaProgression: GpaDataPoint[] = [
    { period: 'Fall 2024', milestone: 'Freshman Fall (16 Credits)', gpa: 3.68, credits: 16 },
    { period: 'Spring 2025', milestone: 'Freshman Spring (16 Credits)', gpa: 3.72, credits: 16 },
    { period: 'Fall 2025', milestone: 'Sophomore Fall (15 Credits)', gpa: 3.77, credits: 15 },
    { period: 'Spring 2026', milestone: 'Sophomore Spring (15 Credits)', gpa: 3.81, credits: 15 },
    { period: 'Fall 2026', milestone: 'Current Semester (Week 7)', gpa: 3.85, credits: 15, highlight: true },
  ];

  const activeGpaData =
    timelineMode === 'semester' ? semesterGpaProgression : multiTermGpaProgression;

  const courseMastery = [
    { course: 'MATH 241: AP Calculus BC', score: 94.2, grade: 'A', median: 86.4, trend: '+3.1%' },
    { course: 'CS 201: Data Structures', score: 92.0, grade: 'A-', median: 84.0, trend: '+4.5%' },
    { course: 'PHYS 101: Physics Mechanics', score: 88.5, grade: 'B+', median: 82.1, trend: '+1.2%' },
    { course: 'CHEM 110: Organic Chemistry', score: 86.0, grade: 'B', median: 81.5, trend: '+0.8%' },
  ];

  // Teacher metrics
  const gradeDistribution = [
    { grade: 'A (90-100%)', count: 38, percentage: 34, color: 'bg-emerald-600' },
    { grade: 'B (80-89%)', count: 54, percentage: 48, color: 'bg-indigo-600' },
    { grade: 'C (70-79%)', count: 16, percentage: 14, color: 'bg-blue-500' },
    { grade: 'D/F (<70%)', count: 4, percentage: 4, color: 'bg-amber-500' },
  ];

  const atRiskStudents = [
    { name: 'Carlos Gomez', class: 'MATH 241', issue: 'Missed Problem Set 6', currentScore: '74.2%', attendance: '82%' },
    { name: 'Devon Vance', class: 'PHYS 101', issue: 'Late Lab 4 Report', currentScore: '71.5%', attendance: '85%' },
    { name: 'Tyler Reed', class: 'MATH 310', issue: 'Low quiz attendance', currentScore: '68.0%', attendance: '78%' },
  ];

  // Export CSV Report Function
  const handleDownloadCsv = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    let csvContent = '';
    let filename = '';

    if (isStudent) {
      filename = `Alex_Rivera_Academic_Performance_${timestamp}.csv`;
      csvContent = [
        'EduPulse Nexus - Student Academic Performance Report',
        `Generated Date,${new Date().toLocaleString()}`,
        'Student Name,Alex Rivera',
        'Student ID,ST-9402',
        'Program,B.S. in Data Science',
        'Current Standing,Dean\'s Honor Roll (Top 5%)',
        'Current Cumulative GPA,3.85 / 4.00',
        'Attendance Rate,96.4%',
        'Degree Credits Completed,54 / 120 (45%)',
        '',
        '--- HISTORICAL GPA PROGRESSION (SEMESTER CHECKPOINTS) ---',
        'Period,Milestone Assessment,Cumulative GPA,Enrolled Credits,Standing',
        ...semesterGpaProgression.map(
          (p) =>
            `"${p.period}","${p.milestone}",${p.gpa.toFixed(2)},${p.credits},"${
              p.gpa >= 3.8 ? "Dean's Honor Roll" : 'Good Standing'
            }"`
        ),
        '',
        '--- MULTI-SEMESTER CUMULATIVE GPA PROGRESSION ---',
        'Semester Term,Milestone Level,Term GPA,Credits Completed',
        ...multiTermGpaProgression.map(
          (p) => `"${p.period}","${p.milestone}",${p.gpa.toFixed(2)},${p.credits}`
        ),
        '',
        '--- ACTIVE COURSE BENCHMARK COMPARISONS ---',
        'Course Title,Student Score (%),Letter Grade,Class Median (%),Differential',
        ...courseMastery.map(
          (c) =>
            `"${c.course}",${c.score},"${c.grade}",${c.median},"${c.trend}"`
        ),
      ].join('\n');
    } else {
      filename = `Faculty_Cohort_Analytics_${timestamp}.csv`;
      csvContent = [
        'EduPulse Nexus - Faculty Operations & Cohort Analytics Report',
        `Generated Date,${new Date().toLocaleString()}`,
        'Lead Faculty,Prof. Marcus Vance',
        'Department,Department of Applied Mathematics',
        'Total Enrolled Cohort,112 Students',
        'Cohort Average Score,84.2% (B+)',
        'Student Engagement Rate,91.8%',
        '',
        '--- SECTION PERFORMANCE MATRIX ---',
        'Course Code,Course Title,Enrolled Students,Average Score (%),Attendance Rate (%)',
        '"MATH 241 (Sec 01)","AP Calculus BC",32,86.4,94.8',
        '"PHYS 101 (Sec 02)","Physics Mechanics & Lab",28,82.1,91.2',
        '"MATH 310 (Sec 04)","Linear Algebra & Vector Spaces",34,84.7,92.6',
        '"MATH 420 (Sec 01)","Honors Differential Equations",18,89.2,97.5',
        '',
        '--- GRADE DISTRIBUTION BREAKDOWN ---',
        'Grade Bracket,Student Count,Cohort Share (%)',
        ...gradeDistribution.map((g) => `"${g.grade}",${g.count},${g.percentage}%`),
        '',
        '--- ACADEMIC INTERVENTION RADAR (AT-RISK) ---',
        'Student Name,Class Section,Flagged Issue,Current Score,Attendance Rate',
        ...atRiskStudents.map(
          (s) =>
            `"${s.name}","${s.class}","${s.issue}","${s.currentScore}","${s.attendance}"`
        ),
      ].join('\n');
    }

    // Trigger browser file download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onExportCsvReport) {
      onExportCsvReport(filename);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {isStudent ? 'Academic Performance & Growth' : 'Cohort Analytics & Diagnostic Insights'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isStudent
              ? 'Historical GPA progression, semester trajectory analysis, and graduation benchmarks'
              : 'Grade distribution, attendance integrity, and student intervention tracking'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Download CSV Button */}
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 rounded-lg transition-colors focus:outline-none shadow-xs"
            title="Download performance metrics as CSV"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export CSV Report</span>
          </button>

          <div className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg hidden sm:block">
            Benchmark: AY 2026-2027
          </div>
        </div>
      </div>

      {isStudent ? (
        /* STUDENT ANALYTICS VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Recharts Line Chart + Benchmark Table */}
          <div className="lg:col-span-8 space-y-6">
            {/* Recharts Line Chart Container */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 tracking-tight">
                      Historical GPA Progression
                    </h2>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded tabular-nums">
                      3.85 Current
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {timelineMode === 'semester'
                      ? 'Detailed bi-weekly tracking and milestone trajectory over the semester'
                      : 'Semester-by-semester cumulative grade point average progression'}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {/* Timeline Mode Switcher Buttons */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/80">
                    <button
                      onClick={() => setTimelineMode('semester')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        timelineMode === 'semester'
                          ? 'bg-white text-indigo-950 font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Semester Timeline
                    </button>
                    <button
                      onClick={() => setTimelineMode('multiTerm')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        timelineMode === 'multiTerm'
                          ? 'bg-white text-indigo-950 font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Multi-Semester
                    </button>
                  </div>

                  {/* Direct Chart CSV Export Icon Button */}
                  <button
                    onClick={handleDownloadCsv}
                    className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200/80 transition-colors focus:outline-none"
                    title="Export GPA timeline data to CSV"
                    aria-label="Export GPA timeline data to CSV"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                  </button>
                </div>
              </div>

              {/* Chart Legend / Summary Info */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-3 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-indigo-600 rounded-full" />
                  <span className="font-medium text-slate-700">Cumulative GPA Curve</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-emerald-500 border-dashed border-t border-emerald-500" />
                  <span className="text-slate-600">3.80 Dean&apos;s Honor Roll Threshold</span>
                </div>
                <div className="ml-auto flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>+0.06 delta over period</span>
                </div>
              </div>

              {/* Recharts Visualization */}
              <div className="w-full h-72 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={activeGpaData}
                    margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E2E8F0"
                    />
                    <XAxis
                      dataKey="period"
                      tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
                      axisLine={{ stroke: '#CBD5E1' }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[3.5, 4.0]}
                      ticks={[3.5, 3.6, 3.7, 3.8, 3.9, 4.0]}
                      tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'monospace' }}
                      axisLine={{ stroke: '#CBD5E1' }}
                      tickLine={false}
                      tickFormatter={(v) => v.toFixed(2)}
                    />
                    <Tooltip content={<CustomGpaTooltip />} />

                    {/* Dean's Honor Roll Benchmark Line at 3.80 */}
                    <ReferenceLine
                      y={3.8}
                      stroke="#059669"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{
                        value: 'Dean’s Honor Line (3.80)',
                        position: 'insideTopRight',
                        fill: '#059669',
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    />

                    {/* Primary GPA Progression Line */}
                    <Line
                      type="monotone"
                      dataKey="gpa"
                      stroke="#4F46E5"
                      strokeWidth={3}
                      dot={{
                        r: 4.5,
                        fill: '#FFFFFF',
                        stroke: '#4F46E5',
                        strokeWidth: 2.5,
                      }}
                      activeDot={{
                        r: 7,
                        fill: '#4F46E5',
                        stroke: '#FFFFFF',
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Key insight note under the chart */}
              <div className="mt-4 p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-slate-600">
                  <strong className="text-slate-800">Academic Standing:</strong> Your GPA consistently exceeds the departmental honors benchmark of 3.80.
                </span>
                <button
                  onClick={handleDownloadCsv}
                  className="text-indigo-700 hover:text-indigo-900 font-semibold text-[11px] flex items-center gap-1 self-start sm:self-auto transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Historical Data (.csv)</span>
                </button>
              </div>
            </div>

            {/* Course Benchmark Comparison Table */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-900">
                  Course Benchmark Comparison
                </h2>
                <button
                  onClick={handleDownloadCsv}
                  className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Table</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-[11px] font-semibold">
                      <th className="pb-2">Course Title</th>
                      <th className="pb-2">Your Score</th>
                      <th className="pb-2">Grade</th>
                      <th className="pb-2">Class Median</th>
                      <th className="pb-2 text-right">Differential</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {courseMastery.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="py-3 font-semibold text-slate-900">
                          {item.course}
                        </td>
                        <td className="py-3 font-mono font-bold text-indigo-700 tabular-nums">
                          {item.score}%
                        </td>
                        <td className="py-3 font-bold text-slate-800">
                          {item.grade}
                        </td>
                        <td className="py-3 text-slate-500 font-mono tabular-nums">
                          {item.median}%
                        </td>
                        <td className="py-3 text-right font-semibold text-emerald-600 tabular-nums">
                          {item.trend}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Graduation Credits & Attendance breakdown */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                Degree Progress
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                B.S. in Data Science (Class of 2028)
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl mb-3 text-center">
                <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
                  54 / 120
                </span>
                <span className="block text-xs text-slate-500 mt-1">
                  Credit Hours Completed (45%)
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>General Education:</span>
                  <span className="font-semibold text-slate-800">28/36 cr</span>
                </div>
                <div className="flex justify-between">
                  <span>Major Core (Math & CS):</span>
                  <span className="font-semibold text-slate-800">22/60 cr</span>
                </div>
                <div className="flex justify-between">
                  <span>Free Electives:</span>
                  <span className="font-semibold text-slate-800">4/24 cr</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                Attendance Standing
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                96.4% semester lecture attendance
              </p>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Meets all departmental high-attendance honors benchmarks.</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* TEACHER ANALYTICS VIEW */
        <div className="space-y-6">
          <TeacherAnalyticsView />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Grade Distribution Histogram & Pass Rates */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Cohort Grade Distribution (112 Students)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Aggregated across AP Calculus, Physics 101, Linear Algebra, and DiffEq
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded">
                  84.2% Mean
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {gradeDistribution.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">
                        {item.grade}
                      </span>
                      <span className="font-bold text-slate-900 tabular-nums font-mono">
                        {item.count} students ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div
                        className={`${item.color} h-3 rounded-full transition-all duration-700`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance & Engagement Matrix */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 mb-3">
                Section Performance Matrix
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800">MATH 241 (Sec 01)</span>
                    <span className="text-emerald-700 font-bold font-mono">86.4% avg</span>
                  </div>
                  <span className="text-[11px] text-slate-500">32 students · 94.8% Attendance</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800">PHYS 101 (Sec 02)</span>
                    <span className="text-indigo-700 font-bold font-mono">82.1% avg</span>
                  </div>
                  <span className="text-[11px] text-slate-500">28 students · 91.2% Attendance</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800">MATH 310 (Sec 04)</span>
                    <span className="text-indigo-700 font-bold font-mono">84.7% avg</span>
                  </div>
                  <span className="text-[11px] text-slate-500">34 students · 92.6% Attendance</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800">MATH 420 (Sec 01)</span>
                    <span className="text-emerald-700 font-bold font-mono">89.2% avg</span>
                  </div>
                  <span className="text-[11px] text-slate-500">18 students · 97.5% Attendance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Early Academic Warning & Interventions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-amber-700 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Intervention Radar (3 Students)</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Students flagged for missing deliverables or low attendance
              </p>

              <div className="space-y-3">
                {atRiskStudents.map((st, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-xl text-xs space-y-1.5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{st.name}</span>
                      <span className="text-amber-800 font-semibold">{st.class}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">{st.issue}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Avg: {st.currentScore}</span>
                      <span>Att: {st.attendance}</span>
                    </div>
                    <button
                      onClick={() => onSendStudentNote && onSendStudentNote(st.name)}
                      className="mt-1 w-full py-1 text-[11px] font-semibold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded flex items-center justify-center gap-1 transition-colors"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Send Academic Check-in</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
