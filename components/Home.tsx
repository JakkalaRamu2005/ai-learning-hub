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
            <Link href="/tools" className="btn btn-primary">
              Explore AI Tools
            </Link>
            <Link href="/videos" className="btn btn-secondary">
              Watch Videos
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
    </div>
  );
}
