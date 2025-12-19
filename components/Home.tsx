"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import "./style/home.css"

interface Stats {
  resources: number;
  videos: number;
  tools: number;
}



export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    resources: 0,
    videos: 0,
    tools: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchHomeData = async () => {
    try {
      setTimeout(() => {
        setStats({
          resources: 250,
          videos: 180,
          tools: 120,
        });



        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching home data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData(); // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  const learningPaths = [
    {
      id: "student",
      title: "I'm a Student",
      description: "Perfect for college students wanting to learn AI skills",
      icon: "🎓",
      link: "/learn#ai-for-students",
      color: "blue",
    },
    {
      id: "professional",
      title: "I'm a Professional",
      description: "Switch your career to AI and machine learning",
      icon: "💼",
      link: "/learn#business-ai-automation",
      color: "purple",
    },
    {
      id: "developer",
      title: "I'm a Developer",
      description: "Deep dive into AI engineering and development",
      icon: "👨‍💻",
      link: "/learn#ai-developer-track",
      color: "green",
    },
    {
      id: "quick",
      title: "I want Quick Skills",
      description: "Master prompt engineering in days, not months",
      icon: "⚡",
      link: "/learn#prompt-engineering-mastery",
      color: "orange",
    },
  ];



  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading AI Learning Hub...</p>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Learn AI Free. Master Prompt Engineering.
            <span className="highlight"> Build Real Projects.</span>
          </h1>
          <p className="hero-subtext">
            Structured learning paths from zero to expert. No credit card needed.
          </p>
          <div className="cta-buttons">
            <Link href="/learn" className="btn btn-primary">
              Start Learning (Free)
            </Link>
            <Link href="/tools" className="btn btn-secondary">
              Explore AI Tools
            </Link>
          </div>

          {/* Animated Stats Counter */}
          <div className="stats-counter">
            <div className="stat-item">
              <span className="stat-number">
                {stats.resources.toLocaleString()}+
              </span>
              <span className="stat-label">Free Resources</span>
            </div>
            <div className="stat-divider">|</div>
            <div className="stat-item">
              <span className="stat-number">
                {stats.videos.toLocaleString()}+
              </span>
              <span className="stat-label">YouTube Videos</span>
            </div>
            <div className="stat-divider">|</div>
            <div className="stat-item">
              <span className="stat-number">
                {stats.tools.toLocaleString()}+
              </span>
              <span className="stat-label">AI Tools</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Path Selector */}
      <section className="path-selector">
        <h2 className="section-title">Choose Your Learning Path</h2>
        <p className="section-subtitle">
          Select the path that matches your goals and get started today
        </p>

        <div className="path-grid">
          {learningPaths.map((path) => (
            <Link
              key={path.id}
              href={path.link}
              className={`path-card path-card-${path.color}`}
            >
              <div className="path-icon">{path.icon}</div>
              <h3 className="path-title">{path.title}</h3>
              <p className="path-description">{path.description}</p>
              <div className="path-arrow">→</div>
            </Link>
          ))}
        </div>
      </section>




    </div>
  );
}
