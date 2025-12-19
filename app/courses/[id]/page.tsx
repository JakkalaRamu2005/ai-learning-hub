"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { Course, Enrollment, CourseModule } from "@/types";
import "./course-detail.css";

export default function CourseDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [course, setCourse] = useState<Course | null>(null);
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchCourseData();
    }, [params.id, session]);

    const fetchCourseData = async () => {
        try {
            // Fetch course details
            const courseRes = await fetch(`/api/courses/${params.id}`);
            const courseData = await courseRes.json();

            if (courseData.success) {
                setCourse(courseData.course);
            }

            // Fetch enrollment if user is logged in
            if (session) {
                const enrollmentRes = await fetch(
                    `/api/courses/my-courses?courseId=${params.id}`
                );
                const enrollmentData = await enrollmentRes.json();

                if (enrollmentData.success && enrollmentData.enrollments.length > 0) {
                    setEnrollment(enrollmentData.enrollments[0]);
                }
            }
        } catch (error) {
            console.error("Error fetching course data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        if (!session) {
            router.push("/login");
            return;
        }

        setEnrolling(true);
        setMessage("");

        try {
            const res = await fetch("/api/courses/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId: params.id }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage("✅ " + data.message);
                setEnrollment(data.enrollment);
                // Refresh course data to update enrollment count
                fetchCourseData();
            } else {
                setMessage("❌ " + data.message);
            }
        } catch (error) {
            setMessage("❌ Failed to enroll in course");
        } finally {
            setEnrolling(false);
        }
    };

    const handleModuleToggle = async (moduleId: string, currentStatus: boolean) => {
        if (!enrollment) return;

        try {
            const res = await fetch("/api/courses/progress", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    courseId: params.id,
                    moduleId,
                    completed: !currentStatus,
                    timeSpent: 5, // Add 5 minutes for each module completion
                }),
            });

            const data = await res.json();

            if (data.success) {
                setEnrollment(data.enrollment);
                setMessage(data.message);

                // Clear message after 3 seconds
                setTimeout(() => setMessage(""), 3000);
            }
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    };

    const getModuleProgress = (moduleId: string) => {
        if (!enrollment) return { completed: false, timeSpent: 0 };

        const progress = enrollment.progress.find((p) => p.moduleId === moduleId);
        return progress || { completed: false, timeSpent: 0 };
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    if (loading) {
        return (
            <div className="course-detail-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading course...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="course-detail-container">
                <div className="error-container">
                    <h2>Course not found</h2>
                    <Link href="/courses" className="back-btn">
                        ← Back to Courses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="course-detail-container">
            {/* Course Header */}
            <div className="course-hero">
                <Link href="/courses" className="back-link">
                    ← Back to Courses
                </Link>

                <div className="course-hero-content">
                    <div className="course-badges">
                        <span className={`difficulty-badge ${course.difficulty.toLowerCase()}`}>
                            {course.difficulty}
                        </span>
                        <span className="category-badge">{course.category}</span>
                    </div>

                    <h1 className="course-hero-title">{course.title}</h1>
                    <p className="course-hero-description">{course.description}</p>

                    <div className="course-hero-meta">
                        <span>📚 {course.modules.length} modules</span>
                        <span>⏱️ {formatDuration(course.totalDuration)}</span>
                        <span>👥 {course.enrollmentCount} enrolled</span>
                        <span>✅ {course.completionCount} completed</span>
                    </div>

                    {enrollment ? (
                        <div className="progress-section">
                            <div className="progress-header">
                                <span>Your Progress</span>
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
                            <p className="progress-text">
                                {enrollment.completedModules} of {enrollment.totalModules}{" "}
                                modules completed
                            </p>
                        </div>
                    ) : (
                        <button
                            onClick={handleEnroll}
                            disabled={enrolling || status === "loading"}
                            className="enroll-btn"
                        >
                            {enrolling
                                ? "Enrolling..."
                                : status === "unauthenticated"
                                    ? "Login to Enroll"
                                    : "Enroll Now (Free)"}
                        </button>
                    )}

                    {message && <div className="message-box">{message}</div>}
                </div>
            </div>

            {/* Learning Outcomes */}
            {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                <div className="section">
                    <h2 className="section-title">What You'll Learn</h2>
                    <ul className="outcomes-list">
                        {course.learningOutcomes.map((outcome, index) => (
                            <li key={index} className="outcome-item">
                                ✓ {outcome}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Course Modules */}
            <div className="section">
                <h2 className="section-title">Course Modules</h2>
                <div className="modules-list">
                    {course.modules
                        .sort((a, b) => a.order - b.order)
                        .map((module, index) => {
                            const progress = getModuleProgress(module.moduleId);
                            const isCompleted = progress.completed;

                            return (
                                <div
                                    key={module.moduleId}
                                    className={`module-item ${isCompleted ? "completed" : ""}`}
                                >
                                    <div className="module-header">
                                        <div className="module-info">
                                            {enrollment && (
                                                <input
                                                    type="checkbox"
                                                    checked={isCompleted}
                                                    onChange={() =>
                                                        handleModuleToggle(
                                                            module.moduleId,
                                                            isCompleted
                                                        )
                                                    }
                                                    className="module-checkbox"
                                                />
                                            )}
                                            <div>
                                                <h3 className="module-title">
                                                    {index + 1}. {module.title}
                                                </h3>
                                                <p className="module-description">
                                                    {module.description}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="module-duration">
                                            {formatDuration(module.duration)}
                                        </span>
                                    </div>

                                    {module.videoLink && enrollment && (
                                        <a
                                            href={module.videoLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="watch-video-btn"
                                        >
                                            ▶ Watch Video
                                        </a>
                                    )}
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="section">
                    <h2 className="section-title">Prerequisites</h2>
                    <ul className="prerequisites-list">
                        {course.prerequisites.map((prereq, index) => (
                            <li key={index}>{prereq}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
