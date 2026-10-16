import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <p>CourseDesk — student LMS project for React &amp; Node.js (Batch 3).</p>
          <p className="muted">MERN stack · JWT auth · role-based dashboards</p>
        </div>
      </footer>
    </div>
  );
}
