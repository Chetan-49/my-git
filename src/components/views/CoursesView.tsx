import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Award,
  ChevronRight,
  Download,
  Plus,
  Megaphone,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { Role, StudentCourse, TeacherClass } from '../../types/index.ts';

interface CoursesViewProps {
  role: Role;
  courses: StudentCourse[];
  classes: TeacherClass[];
  onOpenCourseModal: (course: StudentCourse) => void;
  onSelectClass: (c: TeacherClass) => void;
  onOpenAnnouncementModal: () => void;
  onOpenCreateAssignmentModal: () => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  role,
  courses,
  classes,
  onOpenCourseModal,
  onSelectClass,
  onOpenAnnouncementModal,
  onOpenCreateAssignmentModal,
}) => {
  const isStudent = role === 'student';
  const [filterTerm, setFilterTerm] = useState('Fall 2026');

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {isStudent ? 'Courses & Academic Curricula' : 'Managed Course Sections'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isStudent
              ? 'Enrolled university coursework, weekly lecture slots & syllabus progress'
              : 'Assigned teaching faculties, enrolled cohorts, and grading allocations'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isStudent && (
            <>
              <button
                onClick={onOpenAnnouncementModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Megaphone className="w-3.5 h-3.5 text-indigo-600" />
                <span>Post Announcement</span>
              </button>
              <button
                onClick={onOpenCreateAssignmentModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Assignment</span>
              </button>
            </>
          )}
          {isStudent && (
            <div className="text-xs font-semibold text-slate-700 px-3 py-1.5 bg-slate-100 rounded-lg">
              Term: Fall 2026 (15 Credits)
            </div>
          )}
        </div>
      </div>

      {/* Grid of Courses / Classes */}
      {isStudent ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-indigo-300 transition-all group"
            >
              <div>
                {/* Visual Header / Cover */}
                <div className="relative h-28 bg-slate-900 overflow-hidden">
                  {course.coverImage ? (
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-900 to-indigo-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-white">
                    <span className="text-xs font-bold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded">
                      {course.code}
                    </span>
                    <span className="text-xs font-semibold tabular-nums bg-indigo-600/80 px-2 py-0.5 rounded">
                      Grade: {course.currentGrade}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-4 right-4 text-white">
                    <h2 className="text-sm font-bold truncate">{course.title}</h2>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-800">
                        {course.instructor}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{course.schedule}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{course.room}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[11px] text-slate-500">
                        Syllabus Progress
                      </span>
                      <span className="text-xs font-bold text-indigo-700 font-mono tabular-nums">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom footer button */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => onOpenCourseModal(course)}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors focus:outline-none"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>View Syllabus Modules & Schedule</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-indigo-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-indigo-700">
                    {cls.code} · {cls.term}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 font-mono tabular-nums">
                    Avg: {cls.averageScore}%
                  </span>
                </div>

                <h2 className="text-base font-bold text-slate-900 mb-1">
                  {cls.name}
                </h2>
                <p className="text-xs text-slate-500 mb-4">{cls.description}</p>

                <div className="grid grid-cols-3 gap-2.5 p-3 bg-slate-50 border border-slate-200/70 rounded-xl text-xs mb-4">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Enrolled</span>
                    <span className="font-bold text-slate-900 block mt-0.5 tabular-nums">
                      {cls.studentCount} Students
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">To Grade</span>
                    <span
                      className={`font-bold block mt-0.5 tabular-nums ${
                        cls.pendingGradingCount > 0
                          ? 'text-amber-700'
                          : 'text-emerald-700'
                      }`}
                    >
                      {cls.pendingGradingCount} Submissions
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Attendance</span>
                    <span className="font-bold text-indigo-700 block mt-0.5 tabular-nums">
                      {cls.attendanceRate}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cls.schedule}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Room {cls.room}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onSelectClass(cls)}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Open Student Roster</span>
                </button>

                <button
                  onClick={onOpenAnnouncementModal}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Post to Class
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
