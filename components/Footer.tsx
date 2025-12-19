"use client";
import Link from "next/link";
import "./style/footer.css";
import { FaGithub, FaTwitter, FaYoutube, FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    {/* Brand/Main Column */}
                    <div className="footer-column">
                        <h3 className="footer-heading">Main</h3>
                        <ul className="footer-links">
                            <li>
                                <Link href="/" className="footer-link">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="footer-link">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="footer-link">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools" className="footer-link">
                                    AI Tools Hub
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Learn Column */}
                    <div className="footer-column">
                        <h3 className="footer-heading">Learn</h3>
                        <ul className="footer-links">
                            <li>
                                <Link href="/learn" className="footer-link">
                                    Courses
                                </Link>
                            </li>
                            <li>
                                <Link href="/resources" className="footer-link">
                                    Free Resources
                                </Link>
                            </li>
                            <li>
                                <Link href="/learn#tutorials" className="footer-link">
                                    Tutorials
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="footer-link">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div className="footer-column">
                        <h3 className="footer-heading">Legal</h3>
                        <ul className="footer-links">
                            <li>
                                <Link href="/privacy" className="footer-link">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="footer-link">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookie" className="footer-link">
                                    Cookie Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social Column */}
                    <div className="footer-column">
                        <h3 className="footer-heading">Social</h3>
                        <ul className="footer-links">
                            <li>
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer-link"
                                >
                                    <FaGithub /> GitHub
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer-link"
                                >
                                    <FaTwitter /> Twitter (X)
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://youtube.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer-link"
                                >
                                    <FaYoutube /> YouTube
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer-link"
                                >
                                    <FaFacebook /> Facebook
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p>
                        &copy; {currentYear} Smart Dharani. All rights reserved.
                    </p>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.8 }}>
                        Made with <span className="heart-icon">❤️</span> in India
                    </p>
                </div>
            </div>
        </footer>
    );
}
