export type UserRole = "admin" | "profesor" | "estudiante"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  createdAt: string
  status: "active" | "inactive" | "suspended"
}

export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  teacherId: string
  teacherName: string
  category: string
  price: number
  duration: string
  level: "principiante" | "intermedio" | "avanzado"
  rating: number
  studentsCount: number
  lessonsCount: number
  status: "draft" | "published" | "archived"
  createdAt: string
  updatedAt: string
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  description: string
  videoUrl: string
  duration: string
  order: number
  isCompleted?: boolean
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  progress: number
  enrolledAt: string
  completedAt?: string
  lastAccessedAt: string
}

export interface Certificate {
  id: string
  userId: string
  courseId: string
  courseName: string
  issuedAt: string
  certificateUrl: string
}

export interface Stats {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  revenue: number
  activeStudents: number
  completionRate: number
}

export interface TeacherStats {
  totalStudents: number
  totalCourses: number
  totalRevenue: number
  averageRating: number
  completionRate: number
}

export interface StudentStats {
  enrolledCourses: number
  completedCourses: number
  hoursLearned: number
  certificates: number
  currentStreak: number
}
