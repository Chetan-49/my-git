import React, { useState } from 'react';
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Plus,
  Filter,
  Search,
  Check,
  FileText,
  User,
  Award,
} from 'lucide-react';
import {
  Role,
  StudentTask,
  StudentGradeItem,
  SubmissionQueueItem,
  TeacherClass,
} from '../../types/index.ts';

interface AssignmentsViewProps {
  role: Role;
  studentTasks: StudentTask[];
  studentGrades: StudentGradeItem[];
  teacherSubmissions: SubmissionQueueItem[];
  teacherClasses: TeacherClass[];
  onToggleStudentTask: (id: string) => void;
  onOpenSubmitModal: (task: StudentTask) => void;
  onGradeSubmit: (id: string, score: number, feedback: string) => void;
  onOpenCreateAssignmentModal: () => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  role,
  studentTasks,
  studentGrades,
  teacherSubmissions,
  teacherClasses,
  onToggleStudentTask,
  onOpenSubmitModal,
  onGradeSubmit,
  onOpenCreateAssignmentModal,
}) => {
  const isStudent = role === 'student';

  // Student filter state
  const [studentFilter, setStudentFilter] = useState<'all' | 'pending' | 'completed' | 'graded'>('all');

  // Teacher filter state
  const [classFilter, setClassFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ungraded' | 'graded'>('ungraded');

  // Inline grading modal state for teacher in this view
  const [gradingSubmission, setGradingSubmission] = useState<SubmissionQueueItem | null>(null);
  const [gradeScore, setGradeScore] = useState<string>('90');
  const [gradeFeedback, setGradeFeedback] = useState<string>('');

  const handleOpenGrading = (sub: SubmissionQueueItem) => {
    setGradingSubmission(sub);
    setGradeScore(sub.score ? sub.score.toString() : '90');
    setGradeFeedback(
      sub.feedback ||
        `Good effort on ${sub.assignmentTitle}. The methodology and proofs are well articulated.`
    );
  };

  const handleSaveGrade = () => {
    if (!gradingSubmission) return;
    const scoreNum = parseFloat(gradeScore);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) return;

    onGradeSubmit(gradingSubmission.id, scoreNum, gradeFeedback);
    setGradingSubmission(null);
  };

  const filteredTeacherSubmissions = teacherSubmissions.filter((sub) => {
    if (classFilter !== 'all' && sub.classId !== classFilter) return false;
    if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {isStudent ? 'Assignments & Submissions' : 'Grading Center & Evaluation Queue'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isStudent
              ? 'Deliverables, problem sets, laboratory write-ups, and recorded evaluation marks'
              : 'Assess submitted student work, assign rubric marks, and return qualitative feedback'}
          </p>
        </div>

        <div>
          {!isStudent ? (
            <button
              onClick={onOpenCreateAssignmentModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Assignment</span>
            </button>
          ) : (
            <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
              4 Active Deadlines Scheduled
            </div>
          )}
        </div>
      </div>

      {isStudent ? (
        /* STUDENT ASSIGNMENTS VIEW */
        <div className="space-y-4">
          {/* Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg w-fit shadow-xs">
            <button
              onClick={() => setStudentFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                studentFilter === 'all'
                  ? 'bg-indigo-50 text-indigo-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Deliverables ({studentTasks.length})
            </button>
            <button
              onClick={() => setStudentFilter('pending')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                studentFilter === 'pending'
                  ? 'bg-indigo-50 text-indigo-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending Work ({studentTasks.filter((t) => !t.completed).length})
            </button>
            <button
              onClick={() => setStudentFilter('completed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                studentFilter === 'completed'
                  ? 'bg-indigo-50 text-indigo-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({studentTasks.filter((t) => t.completed).length})
            </button>
            <button
              onClick={() => setStudentFilter('graded')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                studentFilter === 'graded'
                  ? 'bg-indigo-50 text-indigo-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Graded Archive ({studentGrades.length})
            </button>
          </div>

          {studentFilter !== 'graded' ? (
            <div className="grid grid-cols-1 gap-3">
              {studentTasks
                .filter((t) => {
                  if (studentFilter === 'pending') return !t.completed;
                  if (studentFilter === 'completed') return t.completed;
                  return true;
                })
                .map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        onClick={() => onToggleStudentTask(task.id)}
                        className={`mt-1 w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          task.completed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 hover:border-indigo-600'
                        }`}
                        aria-label="Toggle task completion"
                      >
                        {task.completed && <Check className="w-3.5 h-3.5" />}
                      </button>

                      <div className="min-w-0">
                        <span className="text-xs font-bold text-indigo-700">
                          {task.courseCode} · {task.courseName}
                        </span>
                        <h2
                          className={`text-sm font-semibold mt-0.5 ${
                            task.completed
                              ? 'line-through text-slate-400'
                              : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </h2>
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span
                              className={
                                task.isDueToday && !task.completed
                                  ? 'text-amber-700 font-semibold'
                                  : ''
                              }
                            >
                              Due {task.dueDate}
                            </span>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>Max 100 Points</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {!task.completed ? (
                        <button
                          onClick={() => onOpenSubmitModal(task)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Submit Work</span>
                        </button>
                      ) : (
                        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Submitted & Marked Complete
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {studentGrades.map((grade) => (
                <div
                  key={grade.id}
                  className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-indigo-700">
                        {grade.courseCode} · {grade.category}
                      </span>
                      <h2 className="text-sm font-bold text-slate-900 mt-0.5">
                        {grade.assignmentTitle}
                      </h2>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-slate-900 tabular-nums font-mono">
                        {grade.score} / {grade.maxScore}
                      </span>
                      <span className="block text-xs font-bold text-emerald-600">
                        Grade: {grade.letterGrade}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs">
                    <p className="text-slate-700 italic">
                      &ldquo;{grade.teacherNote}&rdquo;
                    </p>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Evaluated by {grade.teacherName}</span>
                      <span>{grade.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* TEACHER GRADING CENTER VIEW */
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 mr-2">
                  Class Filter:
                </label>
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="all">All Cohorts (4 Classes)</option>
                  {teacherClasses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mr-2">
                  Status:
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="ungraded">Awaiting Review (Ungraded)</option>
                  <option value="graded">Evaluated & Archived (Graded)</option>
                  <option value="all">All Submissions</option>
                </select>
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-500 tabular-nums">
              Showing {filteredTeacherSubmissions.length} of {teacherSubmissions.length} items
            </div>
          </div>

          {/* Submissions Table / Cards */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                    <th className="p-3.5">Student</th>
                    <th className="p-3.5">Course & Deliverable</th>
                    <th className="p-3.5">Submitted</th>
                    <th className="p-3.5">Status / Score</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTeacherSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 text-xs">
                        No submissions match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTeacherSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5">
                          <span className="font-bold text-slate-900 block">
                            {sub.studentName}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                            {sub.studentId}
                          </span>
                        </td>
                        <td className="p-3.5 max-w-xs">
                          <span className="font-semibold text-indigo-700 block">
                            {sub.courseCode}
                          </span>
                          <span className="text-slate-800 line-clamp-1">
                            {sub.assignmentTitle}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500 tabular-nums whitespace-nowrap">
                          {sub.submittedAt}
                        </td>
                        <td className="p-3.5">
                          {sub.status === 'ungraded' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              Ungraded
                            </span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-emerald-700 font-mono tabular-nums">
                                {sub.score}/100
                              </span>
                              <span className="text-[10px] text-slate-400">
                                (Graded)
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleOpenGrading(sub)}
                            className="px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                          >
                            {sub.status === 'ungraded' ? 'Grade Work' : 'Edit Grade'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Grading Dialog */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-indigo-700">
                  {gradingSubmission.courseCode} · Rubric Evaluation
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {gradingSubmission.studentName} ({gradingSubmission.studentId})
                </h3>
                <p className="text-xs text-slate-500">
                  {gradingSubmission.assignmentTitle}
                </p>
              </div>
              <button
                onClick={() => setGradingSubmission(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {gradingSubmission.submissionSnippet && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Student Work Excerpt
                  </span>
                  <p className="font-mono text-slate-700 text-xs">
                    {gradingSubmission.submissionSnippet}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Score (0 - 100)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={gradeScore}
                    onChange={(e) => setGradeScore(e.target.value)}
                    className="w-24 px-3 py-1.5 text-sm font-mono font-bold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-slate-900"
                  />
                  <span className="text-xs text-slate-500">/ 100 points</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Qualitative Feedback & Guidance
                </label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-slate-800 resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setGradingSubmission(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveGrade}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Save & Publish Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
