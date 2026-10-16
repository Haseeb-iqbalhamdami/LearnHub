import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AlertBox from '../../components/AlertBox';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/my-courses')
      .then((res) => setEnrollments(res.data))
      .catch((err) => setError(err.message));
  }, []);

  const bumpProgress = async (id, current) => {
    const next = Math.min(100, current + 15);
    try {
      const { data } = await api.put(`/${id}/progress`, { progress: next });
      setEnrollments((prev) => prev.map((row) => (row._id === id ? { ...row, progress: data.progress } : row)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Student dashboard</p>
            <h1>Hi {user.name.split(' ')[0]}</h1>
            <p className="muted">Courses you enrolled in show up here with progress.</p>
          </div>
          <Link to="/courses" className="btn btn-primary">
            Find more courses
          </Link>
        </div>

        <AlertBox type="error">{error}</AlertBox>

        {enrollments.length === 0 ? (
          <div className="empty-state">
            <p>You have not enrolled yet.</p>
            <Link to="/courses">Browse the catalog</Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Instructor</th>
                  <th>Progress</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {enrollments.map((row) => (
                  <tr key={row._id}>
                    <td>
                      <Link to={`/courses/${row.course?._id}`}>{row.course?.title}</Link>
                    </td>
                    <td>{row.course?.instructor?.name || '—'}</td>
                    <td>
                      <div className="progress-row">
                        <div className="progress-bar">
                          <span style={{ width: `${row.progress}%` }} />
                        </div>
                        <em>{row.progress}%</em>
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => bumpProgress(row._id, row.progress)}
                        disabled={row.progress >= 100}
                      >
                        +15%
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
