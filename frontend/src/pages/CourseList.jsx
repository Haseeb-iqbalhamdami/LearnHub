import { useEffect, useState } from 'react';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import AlertBox from '../components/AlertBox';

const CATEGORIES = ['all', 'Web Development', 'Backend', 'Database', 'Security'];

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/courses', {
          params: {
            category: category === 'all' ? undefined : category,
            search: search || undefined,
          },
        });
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(fetchCourses, 250);
    return () => clearTimeout(t);
  }, [category, search]);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h1>Course catalog</h1>
            <p className="muted">Filter by topic or search by title.</p>
          </div>
        </div>

        <div className="filters">
          <input
            type="search"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="filter-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={category === cat ? 'pill active' : 'pill'}
                onClick={() => setCategory(cat)}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        <AlertBox type="error">{error}</AlertBox>

        {loading ? (
          <p className="muted">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="muted">No courses matched your filters.</p>
        ) : (
          <div className="course-grid">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
