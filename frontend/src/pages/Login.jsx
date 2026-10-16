import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertBox from '../components/AlertBox';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(form.email, form.password);
      const redirect = location.state?.from || '/dashboard';
      navigate(data.role ? redirect : '/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="section">
      <div className="container narrow">
        <div className="auth-card">
          <h1>Welcome back</h1>
          <p className="muted">Log in to open your role-based dashboard.</p>

          <AlertBox type="error">{error}</AlertBox>

          <form onSubmit={onSubmit} className="form-stack">
            <label>
              Email
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={onChange}
                placeholder="you@email.com"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
              />
            </label>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Log in'}
            </button>
          </form>

          <p className="form-foot">
            New here? <Link to="/register">Create an account</Link>
          </p>

          <div className="demo-box">
            <p>
              <strong>Demo accounts</strong>
            </p>
            <p>admin@coursedesk.com / admin123</p>
            <p>instructor@coursedesk.com / teach123</p>
            <p>student@coursedesk.com / student123</p>
          </div>
        </div>
      </div>
    </section>
  );
}
