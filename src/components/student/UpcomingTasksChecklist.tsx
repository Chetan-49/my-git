import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Clock,
  Plus,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { StudentTask } from '../../types/index.ts';

interface UpcomingTasksChecklistProps {
  tasks: StudentTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (newTask: Omit<StudentTask, 'id' | 'completed'>) => void;
}

export const UpcomingTasksChecklist: React.FC<UpcomingTasksChecklistProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
}) => {
  const [filter, setFilter] = useState<'all' | 'dueToday' | 'pending' | 'completed'>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('MATH 241');
  const [newDueDate, setNewDueDate] = useState('Today, 11:59 PM');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('high');

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'dueToday') return task.isDueToday;
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      courseCode: newCourse,
      courseName:
        newCourse === 'MATH 241'
          ? 'AP Calculus BC'
          : newCourse === 'PHYS 101'
          ? 'Physics 101'
          : 'Data Structures',
      dueDate: newDueDate,
      isDueToday: newDueDate.toLowerCase().includes('today'),
      priority: newPriority,
    });

    setNewTitle('');
    setIsAddingTask(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Upcoming Tasks & Checklist
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/60 tabular-nums">
              {pendingCount} remaining
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any checkbox to mark completed or update status
          </p>
        </div>

        {/* Interactive Filter Controls & Add Task Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/80">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'pending'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('dueToday')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'dueToday'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Due Today
            </button>
          </div>

          <button
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors focus:outline-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Inline Add Task Form */}
      {isAddingTask && (
        <form
          onSubmit={handleCreateTask}
          className="mb-4 p-3.5 bg-slate-50 border border-indigo-200 rounded-xl space-y-3 animate-in fade-in-50"
        >
          <div className="text-xs font-bold text-slate-800">
            New Academic Task
          </div>
          <div>
            <input
              type="text"
              placeholder="Task description (e.g. Read Chapter 10, Complete Practice Exam 3)..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Course
              </label>
              <select
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
              >
                <option value="MATH 241">MATH 241 (AP Calculus)</option>
                <option value="PHYS 101">PHYS 101 (Physics)</option>
                <option value="CS 201">CS 201 (Data Structures)</option>
                <option value="CHEM 110">CHEM 110 (Organic Chem)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Due Date / Time
              </label>
              <input
                type="text"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Task Checklist Items */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-slate-200/60 rounded-xl text-slate-500 text-xs">
            No tasks found in this view.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                task.completed
                  ? 'bg-slate-50/60 border-slate-200/60 text-slate-400'
                  : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
              }`}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleTask(task.id);
                }}
                className="mt-0.5 text-slate-400 hover:text-indigo-600 focus:outline-none transition-colors"
                aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
              >
                {task.completed ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-xs md:text-sm font-medium transition-all ${
                      task.completed
                        ? 'line-through text-slate-400'
                        : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </p>
                </div>

                {/* Clean unboxed metadata with dot separators */}
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="font-semibold text-indigo-700">
                    {task.courseCode}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span
                      className={
                        task.isDueToday && !task.completed
                          ? 'text-amber-700 font-semibold'
                          : ''
                      }
                    >
                      {task.dueDate}
                    </span>
                  </span>
                  {task.isDueToday && !task.completed && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-700 font-semibold">
                        Due Today
                      </span>
                    </>
                  )}
                  {task.completed && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-600 font-medium">
                        Completed
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
