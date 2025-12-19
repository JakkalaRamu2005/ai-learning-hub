/**
 * Course-related TypeScript types and interfaces
 */

export interface CourseModule {
    moduleId: string;
    title: string;
    description: string;
    videoLink?: string;
    duration: number;
    order: number;
    resources?: string[];
}

export interface Course {
    _id: string;
    title: string;
    description: string;
    category: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    thumbnail?: string;
    modules: CourseModule[];
    totalDuration: number;
    prerequisites?: string[];
    learningOutcomes: string[];
    instructor?: string;
    publishStatus: "draft" | "published" | "archived";
    enrollmentCount: number;
    completionCount: number;
    createdBy?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ModuleProgress {
    moduleId: string;
    completed: boolean;
    completedAt?: string;
    timeSpent: number;
    lastAccessedAt: string;
}

export interface Enrollment {
    _id: string;
    userId: string;
    courseId: string;
    enrolledAt: string;
    progress: ModuleProgress[];
    overallProgress: number;
    completedModules: number;
    totalModules: number;
    isCompleted: boolean;
    completedAt?: string;
    totalTimeSpent: number;
    lastAccessedAt: string;
    certificateIssued: boolean;
    certificateId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface EnrollmentWithCourse extends Enrollment {
    course: Course;
}

export interface CourseWithEnrollment extends Course {
    enrollment?: Enrollment;
    isEnrolled: boolean;
}

// API Request/Response types
export interface EnrollCourseRequest {
    courseId: string;
}

export interface UpdateProgressRequest {
    courseId: string;
    moduleId: string;
    completed: boolean;
    timeSpent?: number;
}

export interface CourseFilters {
    category?: string;
    difficulty?: string;
    search?: string;
    publishStatus?: "draft" | "published" | "archived";
}

export interface LearningStats {
    totalEnrolled: number;
    totalCompleted: number;
    totalTimeSpent: number;
    learningStreak: number;
    recentCourses: EnrollmentWithCourse[];
    completionRate: number;
}
