"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import "../admin/admin.css";
import "./instructor.css";

export default function InstructorDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalCourses: 0,
        publishedCourses: 0,
        draftCourses: 0,
        totalStudents: 0,
        totalQuizzes: 0,
    });

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Welcome back, {user?.name}! 👋</h1>
                <p>Here's an overview of your teaching activity</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Total Courses</span>
                        <span className="stat-icon">📚</span>
                    </div>
                    <div className="stat-value">{stats.totalCourses}</div>
                    <div className="stat-change neutral">
                        {stats.publishedCourses} published, {stats.draftCourses} draft
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Total Students</span>
                        <span className="stat-icon">👥</span>
                    </div>
                    <div className="stat-value">{stats.totalStudents}</div>
                    <div className="stat-change neutral">Across all courses</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Quizzes Created</span>
                        <span className="stat-icon">📝</span>
                    </div>
                    <div className="stat-value">{stats.totalQuizzes}</div>
                    <div className="stat-change neutral">Active assessments</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Avg. Completion</span>
                        <span className="stat-icon">🎯</span>
                    </div>
                    <div className="stat-value">0%</div>
                    <div className="stat-change neutral">Course completion rate</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="admin-section">
                <div className="section-header">
                    <h2 className="section-title">Quick Actions</h2>
                </div>
                <div className="quick-actions-grid">
                    <Link href="/instructor/courses/create" className="quick-action-card">
                        <span className="action-icon">➕</span>
                        <h3>Create New Course</h3>
                        <p>Start building a new course</p>
                    </Link>

                    <Link href="/instructor/quizzes/create" className="quick-action-card">
                        <span className="action-icon">📝</span>
                        <h3>Create Quiz</h3>
                        <p>Add assessments to your courses</p>
                    </Link>

                    <Link href="/instructor/courses" className="quick-action-card">
                        <span className="action-icon">📚</span>
                        <h3>Manage Courses</h3>
                        <p>Edit and update your courses</p>
                    </Link>

                    <Link href="/instructor/analytics" className="quick-action-card">
                        <span className="action-icon">📈</span>
                        <h3>View Analytics</h3>
                        <p>Track student progress</p>
                    </Link>
                </div>
            </div>

            {/* Getting Started */}
            <div className="admin-section">
                <div className="section-header">
                    <h2 className="section-title">Getting Started</h2>
                </div>
                <div className="getting-started-content">
                    <div className="info-box">
                        <h3>👋 Welcome to the Instructor Panel!</h3>
                        <p>
                            As an instructor, you can create and manage courses, create quizzes,
                            track student progress, and more.
                        </p>
                        <ul className="feature-list">
                            <li>✅ Create engaging courses with multiple modules</li>
                            <li>✅ Add quizzes and assessments</li>
                            <li>✅ Track student enrollment and progress</li>
                            <li>✅ View detailed analytics</li>
                            <li>✅ Manage course content and resources</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
