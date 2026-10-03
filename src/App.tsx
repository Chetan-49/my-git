/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Role,
  NavTab,
  StudentCourse,
  StudentTask,
  StudentGradeItem,
  TeacherClass,
  SubmissionQueueItem,
  Announcement,
  NotificationItem,
  ToastMessage,
  ProfileData,
} from './types/index.ts';

import {
  INITIAL_STUDENT_COURSES,
  INITIAL_STUDENT_TASKS,
  INITIAL_STUDENT_GRADES,
  INITIAL_TEACHER_CLASSES,
  INITIAL_SUBMISSION_QUEUE,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  alexAvatar,
  marcusAvatar,
} from './data/initialData.ts';

import { TopBar } from './components/layout/TopBar.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { MobileNav } from './components/layout/MobileNav.tsx';
import { StudentDashboard } from './components/student/StudentDashboard.tsx';
import { TeacherDashboard } from './components/teacher/TeacherDashboard.tsx';
import { CourseDetailModal } from './components/student/CourseDetailModal.tsx';
import { ClassDetailModal } from './components/teacher/ClassDetailModal.tsx';
import { AnnouncementModal } from './components/teacher/AnnouncementModal.tsx';
import { CreateAssignmentModal } from './components/teacher/CreateAssignmentModal.tsx';
import { SubmitAssignmentModal } from './components/student/SubmitAssignmentModal.tsx';
import { CoursesView } from './components/views/CoursesView.tsx';
import { AssignmentsView } from './components/views/AssignmentsView.tsx';
import { AnalyticsView } from './components/views/AnalyticsView.tsx';
import { SettingsView } from './components/views/SettingsView.tsx';
import { ToastContainer } from './components/common/Toast.tsx';

export default function App() {
  // Global Dual-Role state: 'student' | 'teacher'
  const [role, setRole] = useState<Role>('student');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dark / Light Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edupulse_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  });

  // Sync theme with document element and CSS variables
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    try {
      localStorage.setItem('edupulse_theme', theme);
    } catch (e) {
      // Local storage fallback
    }
  }, [theme]);

  const handleThemeToggle = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    addToast(
      'Theme Updated',
      newTheme === 'dark'
        ? 'Low-light dark mode enabled. CSS custom properties updated.'
        : 'Standard light campus theme enabled.',
      'info'
    );
  };

  // Student Study Focus Mode State
  const [focusMode, setFocusMode] = useState(false);

  const handleToggleFocusMode = (active: boolean) => {
    setFocusMode(active);
    addToast(
      active ? 'Focus Mode Activated' : 'Focus Mode Deactivated',
      active
        ? 'Sidebar and analytics hidden. Expanded to full-screen workspace.'
        : 'Standard navigation and analytics restored.',
      'info'
    );
  };

  // User Profile State (persisted in localStorage for both Student and Teacher)
  const [studentProfile, setStudentProfile] = useState<ProfileData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edupulse_student_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return {
      displayName: 'Alex Rivera',
      avatarUrl: alexAvatar,
      email: 'a.rivera@edupulse.edu',
      titleOrProgram: 'B.S. in Data Science (Sophomore)',
    };
  });

  const [teacherProfile, setTeacherProfile] = useState<ProfileData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edupulse_teacher_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return {
      displayName: 'Prof. Marcus Vance',
      avatarUrl: marcusAvatar,
      email: 'm.vance@edupulse.edu',
      titleOrProgram: 'Lead Faculty, Department of Applied Mathematics',
    };
  });

  const handleUpdateProfile = (updated: ProfileData) => {
    if (role === 'student') {
      setStudentProfile(updated);
      try {
        localStorage.setItem('edupulse_student_profile', JSON.stringify(updated));
      } catch (e) {}
    } else {
      setTeacherProfile(updated);
      try {
        localStorage.setItem('edupulse_teacher_profile', JSON.stringify(updated));
      } catch (e) {}
    }
    addToast(
      'Profile Updated',
      `${updated.displayName}'s profile information and avatar photo were updated.`,
      'success'
    );
  };

  // Application Data State
  const [courses, setCourses] = useState<StudentCourse[]>(INITIAL_STUDENT_COURSES);
  const [tasks, setTasks] = useState<StudentTask[]>(INITIAL_STUDENT_TASKS);
  const [grades, setGrades] = useState<StudentGradeItem[]>(INITIAL_STUDENT_GRADES);
  const [classes, setClasses] = useState<TeacherClass[]>(INITIAL_TEACHER_CLASSES);
  const [submissions, setSubmissions] = useState<SubmissionQueueItem[]>(INITIAL_SUBMISSION_QUEUE);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Interactive Modals State
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<StudentCourse | null>(null);
  const [selectedClassForModal, setSelectedClassForModal] = useState<TeacherClass | null>(null);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [createAssignmentModalOpen, setCreateAssignmentModalOpen] = useState(false);
  const [submitTaskModalTarget, setSubmitTaskModalTarget] = useState<StudentTask | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Role toggle handler
  const handleRoleToggle = (newRole: Role) => {
    if (newRole === role) return;
    setRole(newRole);
    if (focusMode) setFocusMode(false);
    addToast(
      'Role Switched',
      newRole === 'student'
        ? 'Switched to Alex Rivera (Student Workspace).'
        : 'Switched to Prof. Marcus Vance (Faculty Operations Console).',
      'info'
    );
  };

  // Student Task Handlers
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = !t.completed;
          addToast(
            updated ? 'Task Completed' : 'Task Reopened',
            `"${t.title}" is now marked as ${updated ? 'completed' : 'pending'}.`,
            updated ? 'success' : 'info'
          );
          return { ...t, completed: updated };
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTaskData: Omit<StudentTask, 'id' | 'completed'>) => {
    const newTask: StudentTask = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
    addToast('Task Added', `"${newTask.title}" added to your study checklist.`, 'success');
  };

  const handleSubmitStudentWork = (taskId: string, notes: string) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    // Mark task complete
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
    );

    // Create entry in teacher grading queue
    const newSubmission: SubmissionQueueItem = {
      id: `sub-${Date.now()}`,
      studentName: 'Alex Rivera',
      studentEmail: 'a.rivera@edupulse.edu',
      studentId: 'ST-9402',
      classId: targetTask.courseCode === 'MATH 241' ? 'class-calc-01' : 'class-phys-02',
      courseCode: targetTask.courseCode,
      courseName: targetTask.courseName,
      assignmentTitle: targetTask.title,
      submittedAt: 'Just now',
      status: 'ungraded',
      maxScore: 100,
      submissionSnippet: notes || 'Student submitted solution draft and proof diagrams.',
    };

    setSubmissions((prev) => [newSubmission, ...prev]);

    // Update pending count in class
    setClasses((prev) =>
      prev.map((cls) =>
        cls.code === targetTask.courseCode
          ? { ...cls, pendingGradingCount: cls.pendingGradingCount + 1 }
          : cls
      )
    );

    addToast(
      'Work Submitted Successfully',
      `"${targetTask.title}" has been submitted to the faculty evaluation queue.`,
      'success'
    );
  };

  // Teacher Grading Handler
  const handleGradeSubmit = (submissionId: string, score: number, feedback: string) => {
    const targetSub = submissions.find((s) => s.id === submissionId);
    if (!targetSub) return;

    // Update submission in teacher queue
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: 'graded',
              score,
              feedback,
            }
          : s
      )
    );

    // Decrement pending count for the class
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === targetSub.classId
          ? {
              ...cls,
              pendingGradingCount: Math.max(0, cls.pendingGradingCount - 1),
            }
          : cls
      )
    );

    // Add to student grade history
    const letter =
      score >= 93 ? 'A' : score >= 90 ? 'A-' : score >= 87 ? 'B+' : score >= 83 ? 'B' : 'C';

    const newGrade: StudentGradeItem = {
      id: `grade-${Date.now()}`,
      assignmentTitle: targetSub.assignmentTitle,
      courseCode: targetSub.courseCode,
      courseName: targetSub.courseName,
      score,
      maxScore: 100,
      date: 'Today',
      teacherName: 'Prof. Marcus Vance',
      teacherNote: feedback,
      letterGrade: letter,
      category: targetSub.assignmentTitle.toLowerCase().includes('lab')
        ? 'Lab Report'
        : targetSub.assignmentTitle.toLowerCase().includes('exam')
        ? 'Exam'
        : 'Problem Set',
    };

    setGrades((prev) => [newGrade, ...prev]);

    // Send notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Grade Published',
      description: `${targetSub.studentName} received ${score}/100 on ${targetSub.assignmentTitle}.`,
      timestamp: 'Just now',
      unread: true,
      targetRole: 'both',
      category: 'grade',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast(
      'Grade Published',
      `Assigned ${score}/100 to ${targetSub.studentName}. Grade metrics updated.`,
      'success'
    );
  };

  // Teacher Post Announcement Handler
  const handlePostAnnouncement = (data: Omit<Announcement, 'id' | 'postedAt'>) => {
    const newAnn: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      postedAt: 'Just now',
    };
    setAnnouncements((prev) => [newAnn, ...prev]);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Class Announcement: ${newAnn.title}`,
      description: `${newAnn.className} - ${newAnn.content}`,
      timestamp: 'Just now',
      unread: true,
      targetRole: 'student',
      category: 'announcement',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast(
      'Announcement Broadcasted',
      `Posted "${newAnn.title}" to ${newAnn.className}.`,
      'success'
    );
  };

  // Teacher Create Assignment Handler
  const handleCreateAssignment = (data: {
    title: string;
    classId: string;
    courseCode: string;
    dueDate: string;
    maxPoints: number;
    description: string;
  }) => {
    const newTask: StudentTask = {
      id: `task-${Date.now()}`,
      title: data.title,
      courseCode: data.courseCode,
      courseName: data.courseCode === 'MATH 241' ? 'AP Calculus BC' : 'Physics 101',
      dueDate: data.dueDate,
      isDueToday: data.dueDate.toLowerCase().includes('today'),
      completed: false,
      priority: 'high',
    };

    setTasks((prev) => [newTask, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Assignment Available',
      description: `New deliverable published: ${data.title} (Due ${data.dueDate}).`,
      timestamp: 'Just now',
      unread: true,
      targetRole: 'student',
      category: 'assignment',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast(
      'Assignment Published',
      `"${data.title}" has been added to the syllabus and student checklists.`,
      'success'
    );
  };

  // Notification handlers
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleClearNotifications = () => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.targetRole === 'both' || n.targetRole === role
          ? { ...n, unread: false }
          : n
      )
    );
    addToast('Notifications Cleared', 'All unread alerts marked as read.', 'info');
  };

  const handleDownloadSyllabus = () => {
    addToast(
      'Syllabus Downloaded',
      'The comprehensive syllabus and reading guide has been saved to your downloads folder.',
      'info'
    );
  };

  const handleQuickStudentAlert = (studentName: string) => {
    addToast(
      'Academic Note Sent',
      `Dispatched an academic check-in notification to ${studentName}.`,
      'info'
    );
  };

  // Derived counts
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const ungradedSubmissionsCount = submissions.filter((s) => s.status === 'ungraded').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Toast notifications container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Sidebar Navigation - Hidden during Focus Mode */}
      {!focusMode && (
        <Sidebar
          role={role}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          studentAvatar={studentProfile.avatarUrl}
          teacherAvatar={teacherProfile.avatarUrl}
          studentName={studentProfile.displayName}
          teacherName={teacherProfile.displayName}
          studentTitle={studentProfile.titleOrProgram}
          teacherTitle={teacherProfile.titleOrProgram}
          pendingTasksCount={pendingTasksCount}
          ungradedSubmissionsCount={ungradedSubmissionsCount}
          onRoleToggle={handleRoleToggle}
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Top Utility Bar */}
        <TopBar
          role={role}
          onRoleToggle={handleRoleToggle}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onClearNotifications={handleClearNotifications}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          mobileMenuOpen={mobileMenuOpen}
          onSearchResultSelect={(type, title) => {
            addToast('Search Selection', `Viewing details for ${title}.`, 'info');
          }}
          theme={theme}
          onThemeToggle={handleThemeToggle}
          focusMode={focusMode}
          onToggleFocusMode={handleToggleFocusMode}
        />

        {/* Dynamic Main Workspace Content */}
        <main className={`flex-1 p-4 md:p-8 w-full mx-auto animate-in fade-in-50 duration-200 ${focusMode ? 'max-w-6xl' : 'max-w-7xl'}`}>
          {activeTab === 'dashboard' && (
            role === 'student' ? (
              <StudentDashboard
                courses={courses}
                tasks={tasks}
                grades={grades}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onOpenCourseModal={setSelectedCourseForModal}
                focusMode={focusMode}
                onToggleFocusMode={handleToggleFocusMode}
                studentName={studentProfile.displayName}
              />
            ) : (
              <TeacherDashboard
                classes={classes}
                submissions={submissions}
                announcements={announcements}
                onGradeSubmit={handleGradeSubmit}
                onOpenAnnouncementModal={() => setAnnouncementModalOpen(true)}
                onOpenCreateAssignmentModal={() => setCreateAssignmentModalOpen(true)}
                onSelectClass={setSelectedClassForModal}
              />
            )
          )}

          {activeTab === 'courses' && (
            <CoursesView
              role={role}
              courses={courses}
              classes={classes}
              onOpenCourseModal={setSelectedCourseForModal}
              onSelectClass={setSelectedClassForModal}
              onOpenAnnouncementModal={() => setAnnouncementModalOpen(true)}
              onOpenCreateAssignmentModal={() => setCreateAssignmentModalOpen(true)}
            />
          )}

          {activeTab === 'assignments' && (
            <AssignmentsView
              role={role}
              studentTasks={tasks}
              studentGrades={grades}
              teacherSubmissions={submissions}
              teacherClasses={classes}
              onToggleStudentTask={handleToggleTask}
              onOpenSubmitModal={setSubmitTaskModalTarget}
              onGradeSubmit={handleGradeSubmit}
              onOpenCreateAssignmentModal={() => setCreateAssignmentModalOpen(true)}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              role={role}
              onSendStudentNote={handleQuickStudentAlert}
              onExportCsvReport={(filename) =>
                addToast(
                  'Report Exported',
                  `${filename} generated and saved to downloads.`,
                  'success'
                )
              }
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              role={role}
              onSavePreferences={(msg) => addToast('Settings Saved', msg, 'success')}
              onRoleToggle={handleRoleToggle}
              theme={theme}
              onThemeToggle={handleThemeToggle}
              profile={role === 'student' ? studentProfile : teacherProfile}
              onUpdateProfile={handleUpdateProfile}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation - Hidden in Focus Mode */}
        {!focusMode && (
          <MobileNav
            role={role}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            pendingTasksCount={pendingTasksCount}
            ungradedSubmissionsCount={ungradedSubmissionsCount}
          />
        )}
      </div>

      {/* Global Interactive Modals */}
      <CourseDetailModal
        course={selectedCourseForModal}
        onClose={() => setSelectedCourseForModal(null)}
        onDownloadSyllabus={handleDownloadSyllabus}
      />

      <ClassDetailModal
        cls={selectedClassForModal}
        onClose={() => setSelectedClassForModal(null)}
        onQuickAlert={handleQuickStudentAlert}
      />

      <AnnouncementModal
        classes={classes}
        isOpen={announcementModalOpen}
        onClose={() => setAnnouncementModalOpen(false)}
        onPostAnnouncement={handlePostAnnouncement}
      />

      <CreateAssignmentModal
        classes={classes}
        isOpen={createAssignmentModalOpen}
        onClose={() => setCreateAssignmentModalOpen(false)}
        onCreateAssignment={handleCreateAssignment}
      />

      <SubmitAssignmentModal
        task={submitTaskModalTarget}
        isOpen={Boolean(submitTaskModalTarget)}
        onClose={() => setSubmitTaskModalTarget(null)}
        onSubmitWork={handleSubmitStudentWork}
      />
    </div>
  );
}
