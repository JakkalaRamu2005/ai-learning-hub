"use client";

import { useEffect, useState } from "react";
import "./admin.css";

interface DashboardStats {
    overview: {
        totalUsers: number;
        newUsers: number;
        userGrowthRate: string;
        totalCourses: number;
        publishedCourses: number;
        draftCourses: number;
        totalEnrollments: number;
        newEnrollments: number;
        enrollmentGrowthRate: string;
        completedCourses: number;
        completionRate: string;
    };
    roleDistribution: {
        user: number;
        admin: number;
        instructor: number;
    };
    recentUsers: Array<{
        _id: string;
        name: string;
        email: string;
        role: string;
        createdAt: string;
        isVerified: boolean;
    }>;
    topCourses: Array<{
        _id: string;
        title: string;
        category: string;
        enrollmentCount: number;
        completionCount: number;
        difficulty: string;
    }>;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/stats?range=30");
            const data = await res.json();

            if (data.success) {
                setStats(data.data);
            } else {
                setError(data.error || "Failed to fetch stats");
            }
        } catch (err) {
            setError("Failed to fetch dashboard stats");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-dashboard">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Dashboard</h1>
                <p>Welcome to the admin panel. Here's an overview of your platform.</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Total Users</span>
                        <span className="stat-icon">👥</span>
                    </div>
                    <div className="stat-value">{stats.overview.totalUsers.toLocaleString()}</div>
                    <div className="stat-change positive">
                        +{stats.overview.newUsers} new ({stats.overview.userGrowthRate})
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Total Courses</span>
                        <span className="stat-icon">📚</span>
                    </div>
                    <div className="stat-value">{stats.overview.totalCourses.toLocaleString()}</div>
                    <div className="stat-change neutral">
                        {stats.overview.publishedCourses} published, {stats.overview.draftCourses} draft
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Enrollments</span>
                        <span className="stat-icon">✅</span>
                    </div>
                    <div className="stat-value">{stats.overview.totalEnrollments.toLocaleString()}</div>
                    <div className="stat-change positive">
                        +{stats.overview.newEnrollments} new ({stats.overview.enrollmentGrowthRate})
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Completion Rate</span>
                        <span className="stat-icon">🎯</span>
                    </div>
                    <div className="stat-value">{stats.overview.completionRate}</div>
                    <div className="stat-change neutral">
                        {stats.overview.completedCourses} courses completed
                    </div>
                </div>
            </div>

            {/* Role Distribution */}
            <div className="admin-section">
                <div className="section-header">
                    <h2 className="section-title">User Distribution by Role</h2>
                </div>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Users</div>
                        <div className="stat-value">{stats.roleDistribution.user.toLocaleString()}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Instructors</div>
                        <div className="stat-value">{stats.roleDistribution.instructor.toLocaleString()}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Admins</div>
                        <div className="stat-value">{stats.roleDistribution.admin.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Recent Users */}
            <div className="admin-section">
                <div className="section-header">
                    <h2 className="section-title">Recent Users</h2>
                </div>
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge ${user.role}`}>{user.role}</span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${user.isVerified ? "verified" : "pending"}`}>
                                            {user.isVerified ? "Verified" : "Pending"}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top Courses */}
            <div className="admin-section">
                <div className="section-header">
                    <h2 className="section-title">Top Courses by Enrollment</h2>
                </div>
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Course Title</th>
                                <th>Category</th>
                                <th>Difficulty</th>
                                <th>Enrollments</th>
                                <th>Completions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.topCourses.map((course) => (
                                <tr key={course._id}>
                                    <td>{course.title}</td>
                                    <td>{course.category}</td>
                                    <td>
                                        <span className={`difficulty-badge ${course.difficulty.toLowerCase()}`}>
                                            {course.difficulty}
                                        </span>
                                    </td>
                                    <td>{course.enrollmentCount.toLocaleString()}</td>
                                    <td>{course.completionCount.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
