"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { EnrollmentWithCourse } from "@/types";
import "./my-courses.css";

export default function MyCoursesPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
    const [stats, setStats] = useState({
        totalEnrolled: 0,
        totalCompleted: 0,
        totalInProgress: 0,
        totalTimeSpent: 0,
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (status === "authenticated") {
            fetchMyCourses();
        }
    }, [status, filter]);

    const fetchMyCourses = async () => {
        try {
            const statusParam = filter === "all" ? "" : `?status=${filter}`;
            const res = await fetch(`/api/courses/my-courses${statusParam}`);
            const data = await res.json();

            if (data.success) {
                setEnrollments(data.enrollments || []);
                setStats(data.stats || {});
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const formatTimeSpent = (minutes: number) => {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m`;
    };

    if (status === "loading" || loading) {
        return (
            <div className="my-courses-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-courses-container">
            <header className="my-courses-header">
                <h1 className="page-title">My Learning Dashboard</h1>
                <p className="page-subtitle">
                    Track your progress and continue your learning journey
                </p>
            </header>

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-content">
                        <h3 className="stat-value">{stats.totalEnrolled}</h3>
                        <p className="stat-label">Enrolled Courses</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <h3 className="stat-value">{stats.totalCompleted}</h3>
                        <p className="stat-label">Completed</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-content">
                        <h3 className="stat-value">{stats.totalInProgress}</h3>
                        <p className="stat-label">In Progress</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-content">
                        <h3 className="stat-value">{formatTimeSpent(stats.totalTimeSpent)}</h3>
                        <p className="stat-label">Time Spent</p>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                <button
                    onClick={() => setFilter("all")}
                    className={`filter-tab ${filter === "all" ? "active" : ""}`}
                >
                    All Courses ({stats.totalEnrolled})
                </button>
                <button
                    onClick={() => setFilter("active")}
                    className={`filter-tab ${filter === "active" ? "active" : ""}`}
                >
                    In Progress ({stats.totalInProgress})
                </button>
                <button
                    onClick={() => setFilter("completed")}
                    className={`filter-tab ${filter === "completed" ? "active" : ""}`}
                >
                    Completed ({stats.totalCompleted})
                </button>
            </div>

            {/* Courses List */}
            {enrollments.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📚</div>
                    <h2>No courses yet</h2>
                    <p>
                        {filter === "completed"
                            ? "You haven't completed any courses yet. Keep learning!"
                            : "Start your learning journey by enrolling in a course"}
                    </p>
                    <Link href="/courses" className="browse-courses-btn">
                        Browse Courses
                    </Link>
                </div>
            ) : (
                <div className="courses-list">
                    {enrollments.map((enrollment) => {
                        const course = enrollment.course;
                        if (!course) return null;

                        return (
                            <div
                                key={enrollment._id}
                                className={`course-card ${enrollment.isCompleted ? "completed" : ""
                                    }`}
                            >
                                <div className="course-card-header">
                                    <div className="course-info">
                                        <h3 className="course-title">{course.title}</h3>
                                        <p className="course-meta">
                                            {course.category} • {course.difficulty} •{" "}
                                            {course.modules.length} modules
                                        </p>
                                    </div>
                                    {enrollment.isCompleted && (
                                        <div className="completion-badge">
                                            <span className="badge-icon">🎉</span>
                                            <span>Completed</span>
                                        </div>
                                    )}
                                </div>

                                <div className="progress-section">
                                    <div className="progress-header">
                                        <span className="progress-label">Progress</span>
                                        <span className="progress-percentage">
                                            {enrollment.overallProgress}%
                                        </span>
                                    </div>
                                    <div className="progress-bar-container">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${enrollment.overallProgress}%` }}
                                        ></div>
                                    </div>
                                    <div className="progress-details">
                                        <span>
                                            {enrollment.completedModules} / {enrollment.totalModules}{" "}
                                            modules
                                        </span>
                                        <span>
                                            Time spent: {formatTimeSpent(enrollment.totalTimeSpent)}
                                        </span>
                                    </div>
                                </div>

                                <div className="course-actions">
                                    <Link
                                        href={`/courses/${course._id}`}
                                        className="continue-btn"
                                    >
                                        {enrollment.isCompleted
                                            ? "Review Course"
                                            : enrollment.overallProgress > 0
                                                ? "Continue Learning →"
                                                : "Start Course →"}
                                    </Link>
                                    <span className="last-accessed">
                                        Last accessed:{" "}
                                        {new Date(enrollment.lastAccessedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
