import React from 'react';
import '@/components/style/static-pages.css';

const AboutUs = () => {
    return (
        <div className="static-page">
            <div className="static-container">
                <h1 className="static-title">About Us</h1>
                <p className="static-subtitle">Empowering the next generation of creators with cutting-edge AI knowledge and tools.</p>

                <div className="static-content">
                    <section>
                        <h2>Our Mission</h2>
                        <p>At AI Learning Hub, we believe that Artificial Intelligence is the great equalizer of the 21st century. Our mission is to democratize access to AI education and tools, making it easy for anyone, anywhere, to harness the power of AI in their work and life.</p>
                    </section>

                    <section>
                        <h2>What We Provide</h2>
                        <div className="static-grid">
                            <div className="static-card">
                                <h3>🛠️ AI Tools Directory</h3>
                                <p>A curated collection of the best AI tools organized by category to help you find exactly what you need.</p>
                            </div>
                            <div className="static-card">
                                <h3>📚 Modern Education</h3>
                                <p>Structured learning paths and courses designed to take you from beginner to expert in AI technologies.</p>
                            </div>
                            <div className="static-card">
                                <h3>🗂️ Free Resources</h3>
                                <p>Prompt engineering guides, templates, and datasets to accelerate your AI adoption journey.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2>Our Story</h2>
                        <p>Founded in 2025, AI Learning Hub started as a small project to bookmark useful AI tools. It quickly grew into a comprehensive platform as we realized the massive gap between those who understand AI and those who could benefit from it. Today, we serve thousands of learners and professionals globally.</p>
                    </section>

                    <section>
                        <h2>The Team</h2>
                        <p>We are a diverse group of AI engineers, educators, and design thinkers passionate about the intersection of technology and human potential. Based in India but operating globally, we are dedicated to building the most intuitive AI learning experience on the web.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
