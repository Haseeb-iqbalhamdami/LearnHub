import { useAuth } from '../context/AuthContext';
import StudentDashboard from './dashboards/StudentDashboard';
import InstructorDashboard from './dashboards/InstructorDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (user.role === 'admin') return <AdminDashboard />;
  if (user.role === 'instructor') return <InstructorDashboard />;
  return <StudentDashboard />;
}
