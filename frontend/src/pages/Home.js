import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentCourses, setRecentCourses] = useState([]);

  useEffect(() => {
    fetchRecentCourses();
  }, []);

  const fetchRecentCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch("http://localhost:3001/courses/recent", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setRecentCourses(data.courses);
      }
    } catch (err) {
      console.error("Error fetching recent courses:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (prompt.trim().split(/\s+/).length < 5) {
      setError("Please describe the course in at least 5 words.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth/login');
        return;
      }

      const res = await fetch("http://localhost:3001/courses/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const result = await res.json();
      navigate("/course", { state: { courseData: result } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <Sidebar />
      <main className="home-content">
        <section className="hero-section">
          <h1 className="hero-title">What do you want to learn today?</h1>
          <p className="hero-subtitle">Describe any topic, and our AI will build a comprehensive course just for you.</p>

          <Card className="prompt-card">
            <form onSubmit={handleSubmit}>
              <textarea
                className="prompt-textarea"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Master React Hooks and Context API from scratch with real-world examples..."
              />
              {error && <div className="error-text" style={{ marginTop: '10px' }}>{error}</div>}
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '160px' }}>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Course'}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </section>

        {recentCourses.length > 0 && (
          <section className="recent-section">
            <h2 className="section-title">Jump Back In</h2>
            <div className="courses-grid">
              {recentCourses.map((course) => (
                <Card key={course.courseId} className="course-card" onClick={() => navigate(`/course?id=${course.courseId}`)}>
                  <h3 className="course-title">{course.courseTitle}</h3>
                  <p className="course-desc">
                    {course.courseDescription?.length > 120
                      ? course.courseDescription.substring(0, 120) + '...'
                      : course.courseDescription}
                  </p>
                  <div className="course-meta">
                    <span className="course-date">Last accessed: Just now</span>
                    <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.875rem' }}>Continue →</span>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;