import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AlertBox from '../components/AlertBox';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get(`/courses/${id}`)
      .then((res) => setCourse(res.data))
      .catch((err) => setError(err.message));
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    if (user.role !== 'student' && user.role !== 'admin') {
      setError('Only students can enroll in courses.');
      return;
    }

    setBusy(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/enroll', { courseId: id });
      setSuccess('Enrolled! Open your dashboard to see progress.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!course && !error) {
    return (
      <section className="section">
        <div className="container muted">Loading course...</div>
      </section>
    );
  }

  if (!course) {
    return (
      <section className="section">
        <div className="container">
          <AlertBox type="error">{error}</AlertBox>
          <Link to="/courses">Back to courses</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container detail-layout">
        <div>
          <p className="eyebrow">{course.category}</p>
          <h1>{course.title}</h1>
          <p className="hero-lead">{course.description}</p>

          <div className="detail-meta">
            <span>Instructor: {course.instructor?.name}</span>
            <span>Level: {course.level}</span>
            <span>{Number(course.price) === 0 ? 'Free' : `$${course.price}`}</span>
          </div>

          <AlertBox type="error" onClose={() => setError('')}>
            {error}
          </AlertBox>
          <AlertBox type="success" onClose={() => setSuccess('')}>
            {success}
          </AlertBox>

          <div className="hero-actions" style={{ marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-primary" onClick={handleEnroll} disabled={busy}>
              {busy ? 'Enrolling...' : 'Enroll now'}
            </button>
            <Link to="/courses" className="btn btn-ghost">
              Back to list
            </Link>
          </div>
        </div>

        <aside className="lesson-panel">
          <h2>Lessons</h2>
          {course.lessons?.length ? (
            <ol className="lesson-list">
              {course.lessons
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((lesson) => (
                  <li key={lesson._id || lesson.title}>
                    <strong>{lesson.title}</strong>
                    <span className="muted">{lesson.durationMinutes} min</span>
                  </li>
                ))}
            </ol>
          ) : (
            <p className="muted">Lessons will show up here once the instructor adds them.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
