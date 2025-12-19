"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { Course } from "@/types";
import "./courses.css";

export default function CoursesPage() {
    const router = useRouter();
    const { data: session } = useSession();

    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDifficulty, setSelectedDifficulty] = useState("All");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await fetch("/api/courses");
            const data = await res.json();

            if (data.success) {
                setCourses(data.courses || []);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter courses
    const filteredCourses = courses.filter((course) => {
        const matchesSearch =
            searchText === "" ||
            course.title.toLowerCase().includes(searchText.toLowerCase()) ||
            course.description.toLowerCase().includes(searchText.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" || course.category === selectedCategory;

        const matchesDifficulty =
            selectedDifficulty === "All" || course.difficulty === selectedDifficulty;

        return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Pagination
    const indexOfLastCourse = currentPage * itemsPerPage;
    const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
    const currentCourses = filteredCourses.slice(
        indexOfFirstCourse,
        indexOfLastCourse
    );
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Get unique categories and difficulties
    const categories = ["All", ...Array.from(new Set(courses.map((c) => c.category)))];
    const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    if (loading) {
        return (
            <div className="courses-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="courses-container">
            <header className="courses-header">
                <h1 className="courses-title">AI Courses</h1>
                <p className="courses-subtitle">
                    Structured learning paths to master AI from beginner to expert
                </p>
            </header>

            {/* Filters */}
            <div className="filter-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="search-input"
                    />
                </div>

                <div className="category-filter">
                    <label className="filter-label">Category:</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="category-select"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="category-filter">
                    <label className="filter-label">Difficulty:</label>
                    <select
                        value={selectedDifficulty}
                        onChange={(e) => {
                            setSelectedDifficulty(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="category-select"
                    >
                        {difficulties.map((diff) => (
                            <option key={diff} value={diff}>
                                {diff}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <p className="results-count">
                {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}{" "}
                found
            </p>

            {/* Courses Grid */}
            {filteredCourses.length === 0 ? (
                <div className="no-results">
                    <p>No courses found matching your criteria.</p>
                </div>
            ) : (
                <>
                    <div className="courses-grid">
                        {currentCourses.map((course) => (
                            <div key={course._id} className="course-card">
                                <div className="course-header">
                                    <span
                                        className={`difficulty-badge ${course.difficulty.toLowerCase()}`}
                                    >
                                        {course.difficulty}
                                    </span>
                                    <span className="module-count">
                                        {course.modules.length} modules
                                    </span>
                                </div>

                                <h3 className="course-title">{course.title}</h3>
                                <p className="course-description">{course.description}</p>

                                <div className="course-meta">
                                    <span className="course-category">📚 {course.category}</span>
                                    <span className="course-duration">
                                        ⏱️ {formatDuration(course.totalDuration)}
                                    </span>
                                </div>

                                <div className="course-stats">
                                    <span>👥 {course.enrollmentCount} enrolled</span>
                                    <span>✅ {course.completionCount} completed</span>
                                </div>

                                <Link
                                    href={`/courses/${course._id}`}
                                    className="view-course-btn"
                                >
                                    View Course →
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination-container">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                (number) => (
                                    <button
                                        key={number}
                                        onClick={() => handlePageChange(number)}
                                        className={`pagination-btn ${currentPage === number ? "active" : ""
                                            }`}
                                    >
                                        {number}
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
