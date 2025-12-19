"use client"
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import "./style/navbar.css"

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [theme, setTheme] = useState("light");
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);

        // Initialize theme
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute("data-theme", savedTheme);
        } else if (prefersDark) {
            setTheme("dark");
            document.documentElement.setAttribute("data-theme", "dark");
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false); // eslint-disable-line
        setIsProfileOpen(false);
    }, [pathname]);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMenuOpen]);

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/logout", {
                method: "POST",
            });

            if (res.ok) {
                router.push("/login");
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const isActive = (path: string) => pathname === path;

    return (
        <>
            <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
                <div className="navbar-container">
                    <Link href="/" className="navbar-logo">
                        <span className="logo-icon">🤖</span>
                        <h2>AI Learning Hub</h2>
                    </Link>

                    <button
                        className="menu-toggle"
                        onClick={toggleMenu}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMenuOpen}
                    >
                        <span className={`hamburger ${isMenuOpen ? "active" : ""}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </button>

                    <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
                        <Link
                            href="/"
                            className={`nav-link ${isActive("/") ? "active" : ""}`}
                        >
                            <span className="link-icon">🏠</span>
                            <span>Home</span>
                        </Link>
                        <Link
                            href="/tools"
                            className={`nav-link ${isActive("/tools") ? "active" : ""}`}
                        >
                            <span className="link-icon">🛠️</span>
                            <span>AI Tools</span>
                        </Link>
                        <Link
                            href="/learn"
                            className={`nav-link ${isActive("/learn") ? "active" : ""}`}
                        >
                            <span className="link-icon">📚</span>
                            <span>Learn</span>
                        </Link>
                        <Link
                            href="/resources"
                            className={`nav-link ${isActive("/resources") ? "active" : ""}`}
                        >
                            <span className="link-icon">🗂️</span>
                            <span>Resources</span>
                        </Link>
                        <button
                            onClick={toggleTheme}
                            className="theme-toggle"
                            aria-label="Toggle theme"
                        >
                            {theme === "light" ? "🌙" : "☀️"}
                        </button>

                        {session ? (
                            <div className="profile-dropdown-container" ref={profileRef}>
                                <button
                                    className="profile-btn"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                >
                                    {session.user?.image ? (
                                        <img
                                            src={session.user.image}
                                            alt="Profile"
                                            className="profile-avatar"
                                        />
                                    ) : (
                                        <div className="profile-initials">
                                            {session.user?.name?.charAt(0) || "U"}
                                        </div>
                                    )}
                                    <span className="profile-name">{session.user?.name}</span>
                                    <span className="dropdown-arrow">▼</span>
                                </button>
                                {isProfileOpen && (
                                    <div className="profile-dropdown-menu">
                                        <div className="profile-header-mobile">
                                            <p className="user-email">{session.user?.email}</p>
                                        </div>
                                        <Link href="/profile" className="dropdown-item">
                                            <span>👤</span> Your Profile
                                        </Link>
                                        <button onClick={() => signOut()} className="dropdown-item logout-item">
                                            <span>Sign out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="login-nav-btn">
                                <span>Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Overlay for mobile menu */}
            {isMenuOpen && <div className="navbar-overlay" onClick={toggleMenu}></div>}

            {/* Spacer to prevent content jump */}
            <div className="navbar-spacer"></div>
        </>
    );
}
