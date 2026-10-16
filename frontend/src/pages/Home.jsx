import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import CourseCard from '../components/CourseCard';

export default function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api
      .get('/courses')
      .then((res) => setCourses(res.data.slice(0, 3)))
      .catch(() => setCourses([]));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">CourseDesk LMS</p>
            <h1>Pick a course. Enroll. Keep going.</h1>
            <p className="hero-lead">
              A small learning platform built with React, Express and MongoDB — browse classes,
              sign in with your role, and track what you enrolled in.
            </p>
            <div className="hero-actions">
              <Link to="/courses" className="btn btn-primary btn-lg">
                Browse courses
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                Create account
              </Link>
            </div>
          </div>
          <div className="hero-panel" aria-hidden="true">
            <div className="hero-stat">
              <strong>3 roles</strong>
              <span>Admin · Instructor · Student</span>
            </div>
            <div className="hero-stat">
              <strong>JWT + bcrypt</strong>
              <span>Protected routes &amp; hashed passwords</span>
            </div>
            <div className="hero-stat">
              <strong>Live CRUD</strong>
              <span>Courses sync from the Express API</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Featured this week</h2>
            <Link to="/courses">View all</Link>
          </div>
          {courses.length === 0 ? (
            <p className="muted">No courses yet — start the API and run the seed script.</p>
          ) : (
            <div className="course-grid">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
