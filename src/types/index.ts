export type Role = 'student' | 'teacher';

export type NavTab = 'dashboard' | 'courses' | 'assignments' | 'analytics' | 'settings';

export interface StudentCourse {
  id: string;
  code: string;
  title: string;
  instructor: string;
  instructorTitle: string;
  nextLecture: string;
  progress: number; // 0 - 100
  schedule: string;
  room: string;
  credits: number;
  currentGrade: string;
  coverImage?: string;
  description: string;
  modulesCount: number;
  completedModules: number;
}

export interface StudentTask {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  dueDate: string;
  isDueToday: boolean;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface StudentGradeItem {
  id: string;
  assignmentTitle: string;
  courseCode: string;
  courseName: string;
  score: number;
  maxScore: number;
  date: string;
  teacherName: string;
  teacherNote: string;
  letterGrade: string;
  category: 'Exam' | 'Lab Report' | 'Problem Set' | 'Project';
}

export interface TeacherClass {
  id: string;
  code: string;
  name: string;
  term: string;
  schedule: string;
  room: string;
  studentCount: number;
  pendingGradingCount: number;
  averageScore: number;
  attendanceRate: number;
  nextSession: string;
  coverImage?: string;
  description: string;
}

export interface SubmissionQueueItem {
  id: string;
  studentName: string;
  studentEmail: string;
  studentId: string;
  classId: string;
  courseCode: string;
  courseName: string;
  assignmentTitle: string;
  submittedAt: string;
  status: 'ungraded' | 'graded';
  score?: number;
  maxScore: number;
  feedback?: string;
  rubricNotes?: string;
  submissionSnippet?: string;
}

export interface Announcement {
  id: string;
  classId: string;
  className: string;
  title: string;
  content: string;
  author: string;
  postedAt: string;
  priority: 'normal' | 'important';
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  targetRole: 'both' | 'student' | 'teacher';
  category: 'grade' | 'assignment' | 'announcement';
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export interface ProfileData {
  displayName: string;
  avatarUrl: string;
  email: string;
  titleOrProgram: string;
}
