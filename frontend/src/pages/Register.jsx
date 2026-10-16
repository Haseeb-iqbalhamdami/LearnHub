import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertBox from '../components/AlertBox';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [error, setError] = useState('');

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="section">
      <div className="container narrow">
        <div className="auth-card">
          <h1>Create your account</h1>
          <p className="muted">Students and instructors can register for this demo.</p>

          <AlertBox type="error">{error}</AlertBox>

          <form onSubmit={onSubmit} className="form-stack">
            <label>
              Full name
              <input name="name" required minLength={2} value={form.name} onChange={onChange} />
            </label>
            <label>
              Email
              <input type="email" name="email" required value={form.email} onChange={onChange} />
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
              />
            </label>
            <label>
              I am joining as
              <select name="role" value={form.role} onChange={onChange}>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </label>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Register'}
            </button>
          </form>

          <p className="form-foot">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
