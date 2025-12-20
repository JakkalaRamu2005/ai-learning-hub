"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import "./admin.css";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAdmin, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !isAdmin)) {
            router.push("/");
        }
    }, [isAdmin, isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading admin panel...</p>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>Admin Panel</h2>
                </div>

                <nav className="admin-nav">
                    <Link href="/admin" className="admin-nav-item">
                        <span className="nav-icon">📊</span>
                        Dashboard
                    </Link>

                    <Link href="/admin/users" className="admin-nav-item">
                        <span className="nav-icon">👥</span>
                        Users
                    </Link>

                    <Link href="/admin/courses" className="admin-nav-item">
                        <span className="nav-icon">📚</span>
                        Courses
                    </Link>

                    <Link href="/admin/quizzes" className="admin-nav-item">
                        <span className="nav-icon">📝</span>
                        Quizzes
                    </Link>

                    <Link href="/admin/resources" className="admin-nav-item">
                        <span className="nav-icon">📖</span>
                        Resources
                    </Link>

                    <Link href="/admin/tools" className="admin-nav-item">
                        <span className="nav-icon">🛠️</span>
                        Tools
                    </Link>

                    <Link href="/admin/analytics" className="admin-nav-item">
                        <span className="nav-icon">📈</span>
                        Analytics
                    </Link>

                    <Link href="/admin/settings" className="admin-nav-item">
                        <span className="nav-icon">⚙️</span>
                        Settings
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
