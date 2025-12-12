"use client"
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import "./style/navbar.css"

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false); // eslint-disable-line
    }, [pathname]);

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
                            href="/profile"
                            className={`nav-link ${isActive("/profile") ? "active" : ""}`}
                        >
                            <span className="link-icon">👤</span>
                            <span>Profile</span>
                        </Link>
                        <button onClick={handleLogout} className="logout-btn">
                            <span className="btn-icon">🚪</span>
                            <span>Logout</span>
                        </button>
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
