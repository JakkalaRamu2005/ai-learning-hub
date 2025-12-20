"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import "../admin/admin.css";
import "./instructor.css";

export default function InstructorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isInstructor, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !isInstructor)) {
            router.push("/");
        }
    }, [isInstructor, isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading instructor dashboard...</p>
            </div>
        );
    }

    if (!isInstructor) {
        return null;
    }

    return (
        <div className="admin-layout instructor-layout">
            <aside className="admin-sidebar instructor-sidebar">
                <div className="admin-sidebar-header">
                    <h2>Instructor Panel</h2>
                    <p className="sidebar-subtitle">Manage Your Courses</p>
                </div>

                <nav className="admin-nav">
                    <Link href="/instructor" className="admin-nav-item">
                        <span className="nav-icon">📊</span>
                        Dashboard
                    </Link>

                    <Link href="/instructor/courses" className="admin-nav-item">
                        <span className="nav-icon">📚</span>
                        My Courses
                    </Link>

                    <Link href="/instructor/courses/create" className="admin-nav-item">
                        <span className="nav-icon">➕</span>
                        Create Course
                    </Link>

                    <Link href="/instructor/quizzes" className="admin-nav-item">
                        <span className="nav-icon">📝</span>
                        My Quizzes
                    </Link>

                    <Link href="/instructor/students" className="admin-nav-item">
                        <span className="nav-icon">👥</span>
                        Students
                    </Link>

                    <Link href="/instructor/analytics" className="admin-nav-item">
                        <span className="nav-icon">📈</span>
                        Analytics
                    </Link>

                    <div className="nav-divider"></div>

                    <Link href="/" className="admin-nav-item">
                        <span className="nav-icon">🏠</span>
                        Back to Site
                    </Link>
                </nav>
            </aside>

            <main className="admin-main">{children}</main>
        </div>
    );
}
