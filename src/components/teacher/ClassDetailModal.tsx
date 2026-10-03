import React, { useState } from 'react';
import { X, Users, Mail, CheckCircle2, TrendingUp, Calendar, BookOpen, Clock, AlertTriangle, UserCheck } from 'lucide-react';
import { TeacherClass } from '../../types/index.ts';

interface ClassDetailModalProps {
  cls: TeacherClass | null;
  onClose: () => void;
  onQuickAlert?: (studentName: string) => void;
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
  cls,
  onClose,
  onQuickAlert,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'curriculum'>('roster');

  if (!cls) return null;

  // Realistic enrolled student roster
  const sampleRoster = [
    { name: 'Alex Rivera', id: 'ST-9402', attendance: '98%', currentGrade: '94.2% (A)', status: 'High Standing' },
    { name: 'Jordan Hayes', id: 'ST-8821', attendance: '92%', currentGrade: '88.5% (B+)', status: 'Pending Review' },
    { name: 'Maya Patel', id: 'ST-9034', attendance: '96%', currentGrade: '95.0% (A)', status: 'High Standing' },
    { name: 'Liam O’Connor', id: 'ST-7419', attendance: '90%', currentGrade: '81.4% (B-)', status: 'Active' },
    { name: 'Sophia Zhang', id: 'ST-6512', attendance: '100%', currentGrade: '97.8% (A+)', status: 'High Standing' },
    { name: 'Carlos Gomez', id: 'ST-9281', attendance: '88%', currentGrade: '78.5% (C+)', status: 'Support Check' },
    { name: 'Zoe Washington', id: 'ST-8142', attendance: '94%', currentGrade: '89.0% (B+)', status: 'Active' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
                {cls.code} · {cls.term}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {cls.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Room {cls.room} · {cls.schedule}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Enrolled Cohort</span>
              <span className="font-bold text-slate-900 text-sm block mt-0.5 tabular-nums">
                {cls.studentCount} Students
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Cohort Average</span>
              <span className="font-bold text-emerald-600 text-sm block mt-0.5 tabular-nums">
                {cls.averageScore}% (B+)
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Attendance Rate</span>
              <span className="font-bold text-indigo-700 text-sm block mt-0.5 tabular-nums">
                {cls.attendanceRate}%
              </span>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200">
            <button
              onClick={() => setActiveSubTab('roster')}
              className={`pb-2.5 text-xs font-semibold border-b-2 transition-all ${
                activeSubTab === 'roster'
                  ? 'border-indigo-600 text-indigo-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Enrolled Student Roster ({sampleRoster.length} preview)
            </button>
            <button
              onClick={() => setActiveSubTab('curriculum')}
              className={`pb-2.5 text-xs font-semibold border-b-2 transition-all ${
                activeSubTab === 'curriculum'
                  ? 'border-indigo-600 text-indigo-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Course Overview & Description
            </button>
          </div>

          {activeSubTab === 'roster' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                    <th className="pb-2">Student Name</th>
                    <th className="pb-2">ID</th>
                    <th className="pb-2">Attendance</th>
                    <th className="pb-2">Grade</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sampleRoster.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 font-semibold text-slate-900">
                        {st.name}
                      </td>
                      <td className="py-2.5 text-slate-500 font-mono text-[11px] tabular-nums">
                        {st.id}
                      </td>
                      <td className="py-2.5 text-slate-700 font-mono tabular-nums">
                        {st.attendance}
                      </td>
                      <td className="py-2.5 font-semibold text-slate-800 tabular-nums">
                        {st.currentGrade}
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => onQuickAlert && onQuickAlert(st.name)}
                          className="px-2.5 py-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                        >
                          Send Note
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-3 text-xs text-slate-600">
              <p className="leading-relaxed">{cls.description}</p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <span className="font-bold text-slate-800 block text-xs">
                  Next Scheduled Class Session
                </span>
                <p className="text-slate-600">
                  {cls.nextSession} in {cls.room}. Lecture Topic: Stokes’ Theorem Manifold Boundary Integrals and Green&apos;s Theorem Generalization.
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
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
