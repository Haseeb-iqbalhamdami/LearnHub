import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AlertBox from '../../components/AlertBox';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    const [analyticsRes, usersRes] = await Promise.all([
      api.get('/users/analytics'),
      api.get('/users'),
    ]);
    setStats(analyticsRes.data);
    setUsers(usersRes.data);
  };

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  const changeRole = async (id, role) => {
    setError('');
    setSuccess('');
    try {
      await api.put(`/users/${id}/role`, { role });
      setSuccess('Role updated.');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Admin dashboard</p>
            <h1>Platform overview</h1>
            <p className="muted">Signed in as {user.email}</p>
          </div>
        </div>

        <AlertBox type="error">{error}</AlertBox>
        <AlertBox type="success">{success}</AlertBox>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <strong>{stats.users}</strong>
              <span>Users</span>
            </div>
            <div className="stat-card">
              <strong>{stats.courses}</strong>
              <span>Courses</span>
            </div>
            <div className="stat-card">
              <strong>{stats.enrollments}</strong>
              <span>Enrollments</span>
            </div>
            <div className="stat-card">
              <strong>{stats.instructors}</strong>
              <span>Instructors</span>
            </div>
            <div className="stat-card">
              <strong>{stats.students}</strong>
              <span>Students</span>
            </div>
          </div>
        )}

        <div className="panel" style={{ marginTop: '1.5rem' }}>
          <h2>Manage users</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Change role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="tag">{u.role}</span>
                    </td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u._id, e.target.value)}
                        disabled={u._id === user._id}
                      >
                        <option value="student">student</option>
                        <option value="instructor">instructor</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
