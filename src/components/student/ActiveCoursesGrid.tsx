import React, { useState } from 'react';
import {
  Clock,
  User,
  MapPin,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Award,
  ChevronRight,
  X,
  ExternalLink,
} from 'lucide-react';
import { StudentCourse } from '../../types/index.ts';

interface ActiveCoursesGridProps {
  courses: StudentCourse[];
  onOpenCourseModal: (course: StudentCourse) => void;
}

export const ActiveCoursesGrid: React.FC<ActiveCoursesGridProps> = ({
  courses,
  onOpenCourseModal,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Active Courses
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Current semester enrollment · 4 registered modules
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.slice(0, 4).map((course) => (
          <div
            key={course.id}
            className="flex flex-col justify-between p-4 rounded-xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-sm transition-all duration-200 bg-slate-50/50 hover:bg-white group"
          >
            <div>
              {/* Header info: Code & Grade */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-indigo-700 tracking-wide">
                  {course.code}
                </span>
                <span className="text-xs font-semibold text-slate-700 tabular-nums">
                  {course.currentGrade}
                </span>
              </div>

              {/* Course Title */}
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-900 transition-colors line-clamp-1">
                {course.title}
              </h3>

              {/* Instructor & Location info */}
              <div className="mt-2.5 space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{course.instructor}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate text-slate-600 font-medium">
                    {course.nextLecture}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mt-4 pt-3 border-t border-slate-200/60">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500 text-[11px]">Syllabus Progress</span>
                <span className="font-semibold text-slate-800 text-[11px] tabular-nums font-mono">
                  {course.progress}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${course.progress}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {course.completedModules}/{course.modulesCount} modules
                </span>
                <button
                  onClick={() => onOpenCourseModal(course)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors focus:outline-none"
                >
                  <span>Course Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
