import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  const instructorName = course.instructor?.name || 'Instructor';

  return (
    <article className="course-card">
      <div className="course-card-top">
        <span className="tag">{course.category}</span>
        <span className="level">{course.level || 'Beginner'}</span>
      </div>
      <h3>
        <Link to={`/courses/${course._id}`}>{course.title}</Link>
      </h3>
      <p className="muted clamp-2">{course.description}</p>
      <div className="course-card-meta">
        <span>by {instructorName}</span>
        <strong>{Number(course.price) === 0 ? 'Free' : `$${course.price}`}</strong>
      </div>
    </article>
  );
}
