import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AlertBox from '../../components/AlertBox';

const emptyForm = {
  title: '',
  description: '',
  category: 'Web Development',
  price: 0,
  level: 'Beginner',
  lessonTitle: '',
};

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    const { data } = await api.get('/courses/mine/list');
    setCourses(data);
  };

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      price: Number(form.price) || 0,
      level: form.level,
    };

    if (form.lessonTitle) {
      payload.lessons = [
        {
          title: form.lessonTitle,
          content: 'Lesson added from instructor dashboard.',
          durationMinutes: 15,
          order: 1,
        },
      ];
    }

    try {
      if (editingId) {
        await api.put(`/courses/${editingId}`, payload);
        setSuccess('Course updated.');
      } else {
        await api.post('/courses', payload);
        setSuccess('Course created.');
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (course) => {
    setEditingId(course._id);
    setForm({
      title: course.title,
      description: course.description,
      category: course.category,
      price: course.price,
      level: course.level || 'Beginner',
      lessonTitle: '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await api.delete(`/courses/${id}`);
      setSuccess('Course deleted.');
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
            <p className="eyebrow">Instructor dashboard</p>
            <h1>{user.name}</h1>
            <p className="muted">Create courses, tweak details, or remove ones you no longer teach.</p>
          </div>
        </div>

        <AlertBox type="error" onClose={() => setError('')}>
          {error}
        </AlertBox>
        <AlertBox type="success" onClose={() => setSuccess('')}>
          {success}
        </AlertBox>

        <div className="dash-grid">
          <form className="panel form-stack" onSubmit={onSubmit}>
            <h2>{editingId ? 'Edit course' : 'New course'}</h2>
            <label>
              Title
              <input name="title" required value={form.title} onChange={onChange} />
            </label>
            <label>
              Description
              <textarea name="description" required rows={4} value={form.description} onChange={onChange} />
            </label>
            <div className="form-row">
              <label>
                Category
                <select name="category" value={form.category} onChange={onChange}>
                  <option>Web Development</option>
                  <option>Backend</option>
                  <option>Database</option>
                  <option>Security</option>
                </select>
              </label>
              <label>
                Level
                <select name="level" value={form.level} onChange={onChange}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </label>
              <label>
                Price ($)
                <input type="number" min="0" name="price" value={form.price} onChange={onChange} />
              </label>
            </div>
            <label>
              First lesson title (optional)
              <input name="lessonTitle" value={form.lessonTitle} onChange={onChange} />
            </label>
            <div className="hero-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Save changes' : 'Publish course'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-ghost" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="panel">
            <h2>Your courses ({courses.length})</h2>
            {courses.length === 0 ? (
              <p className="muted">No courses yet — publish your first one on the left.</p>
            ) : (
              <ul className="manage-list">
                {courses.map((course) => (
                  <li key={course._id}>
                    <div>
                      <strong>{course.title}</strong>
                      <span className="muted">
                        {course.category} · {Number(course.price) === 0 ? 'Free' : `$${course.price}`}
                      </span>
                    </div>
                    <div className="row-actions">
                      <button type="button" className="btn btn-ghost" onClick={() => startEdit(course)}>
                        Edit
                      </button>
                      <button type="button" className="btn btn-danger" onClick={() => removeCourse(course._id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
