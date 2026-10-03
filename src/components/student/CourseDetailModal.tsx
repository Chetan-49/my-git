import React from 'react';
import { X, Calendar, Clock, MapPin, User, BookOpen, CheckCircle, FileText, Download } from 'lucide-react';
import { StudentCourse } from '../../types/index.ts';

interface CourseDetailModalProps {
  course: StudentCourse | null;
  onClose: () => void;
  onDownloadSyllabus?: () => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
  onDownloadSyllabus,
}) => {
  if (!course) return null;

  const syllabusModules = [
    { number: 1, title: 'Foundational Theory & Notation Standards', status: 'completed' },
    { number: 2, title: 'Parametric Geometry & Vector Differential Operators', status: 'completed' },
    { number: 3, title: 'Line Integrals along Vector Fields & Path Independence', status: 'completed' },
    { number: 4, title: "Green's Theorem in the Plane & Curl/Divergence", status: 'in-progress' },
    { number: 5, title: "Surface Integrals & Stokes' Theorem in R3", status: 'upcoming' },
    { number: 6, title: "Gauss' Divergence Theorem & Physical Flux Applications", status: 'upcoming' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
        {/* Header Cover / Banner */}
        <div className="relative h-32 bg-slate-900 overflow-hidden rounded-t-2xl">
          {course.coverImage ? (
            <img
              src={course.coverImage}
              alt={course.title}
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-6 right-6">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              {course.code} · {course.credits} Credits
            </span>
            <h2 className="text-lg font-bold text-white truncate">
              {course.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Key Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Instructor</span>
              <span className="font-semibold text-slate-900 block truncate mt-0.5">
                {course.instructor}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Current Grade</span>
              <span className="font-semibold text-emerald-600 block mt-0.5">
                {course.currentGrade}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Next Session</span>
              <span className="font-semibold text-slate-900 block truncate mt-0.5">
                {course.nextLecture}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Classroom</span>
              <span className="font-semibold text-slate-900 block truncate mt-0.5">
                {course.room}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Course Description
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Syllabus Curriculum Modules */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Curriculum Modules ({course.completedModules}/{course.modulesCount} complete)
              </h3>
              <span className="text-xs font-bold text-indigo-700 tabular-nums">
                {course.progress}%
              </span>
            </div>

            <div className="space-y-2">
              {syllabusModules.map((mod) => (
                <div
                  key={mod.number}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
                    mod.status === 'completed'
                      ? 'bg-slate-50 border-slate-200/60 text-slate-600'
                      : mod.status === 'in-progress'
                      ? 'bg-indigo-50/50 border-indigo-200 text-indigo-950 font-medium'
                      : 'bg-white border-slate-200/80 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-400 tabular-nums w-4">
                      {mod.number}.
                    </span>
                    <span>{mod.title}</span>
                  </div>

                  <span className="text-[11px] font-semibold capitalize shrink-0">
                    {mod.status === 'completed' && (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Done
                      </span>
                    )}
                    {mod.status === 'in-progress' && (
                      <span className="text-indigo-600">Current Unit</span>
                    )}
                    {mod.status === 'upcoming' && (
                      <span className="text-slate-400">Scheduled</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={onDownloadSyllabus}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Full Syllabus PDF</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
