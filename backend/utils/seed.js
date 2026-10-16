const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

dotenv.config();

const seed = async () => {
  await connectDB();

  await Promise.all([User.deleteMany(), Course.deleteMany(), Enrollment.deleteMany()]);

  const admin = await User.create({
    name: 'Ayesha Admin',
    email: 'admin@coursedesk.com',
    password: 'admin123',
    role: 'admin',
  });

  const instructor = await User.create({
    name: 'Bilal Instructor',
    email: 'instructor@coursedesk.com',
    password: 'teach123',
    role: 'instructor',
  });

  const instructor2 = await User.create({
    name: 'Sana Malik',
    email: 'sana@coursedesk.com',
    password: 'teach123',
    role: 'instructor',
  });

  const student = await User.create({
    name: 'Hassan Student',
    email: 'student@coursedesk.com',
    password: 'student123',
    role: 'student',
  });

  const courses = await Course.insertMany([
    {
      title: 'React Fundamentals for Beginners',
      description:
        'Build interactive UIs with components, props, state and hooks. Plenty of small exercises so the concepts stick.',
      instructor: instructor._id,
      category: 'Web Development',
      price: 29,
      level: 'Beginner',
      lessons: [
        { title: 'JSX and components', content: 'How React turns UI into components.', durationMinutes: 18, order: 1 },
        { title: 'State with useState', content: 'Track data that changes over time.', durationMinutes: 22, order: 2 },
        { title: 'Effects and data fetching', content: 'useEffect patterns that avoid common bugs.', durationMinutes: 25, order: 3 },
      ],
    },
    {
      title: 'Node.js & Express REST APIs',
      description:
        'Create a clean Express server, connect MongoDB with Mongoose, and ship CRUD endpoints you can call from React.',
      instructor: instructor._id,
      category: 'Backend',
      price: 35,
      level: 'Intermediate',
      lessons: [
        { title: 'Express routing', content: 'Organize routes and middleware.', durationMinutes: 20, order: 1 },
        { title: 'Mongoose models', content: 'Schemas, validation and references.', durationMinutes: 24, order: 2 },
        { title: 'Error handling', content: 'Return clear API error messages.', durationMinutes: 15, order: 3 },
      ],
    },
    {
      title: 'MongoDB Essentials',
      description:
        'Documents, collections, queries and indexes explained with practical examples for student projects.',
      instructor: instructor2._id,
      category: 'Database',
      price: 19,
      level: 'Beginner',
      lessons: [
        { title: 'Collections and documents', content: 'How MongoDB stores data.', durationMinutes: 16, order: 1 },
        { title: 'Find, update, delete', content: 'Everyday query patterns.', durationMinutes: 21, order: 2 },
      ],
    },
    {
      title: 'JWT Auth in MERN Apps',
      description:
        'Register/login flows, bcrypt password hashing, protected routes and role checks for admin, instructor and student.',
      instructor: instructor2._id,
      category: 'Security',
      price: 0,
      level: 'Intermediate',
      lessons: [
        { title: 'Hashing passwords', content: 'Why we never store plain text passwords.', durationMinutes: 14, order: 1 },
        { title: 'Issuing JWTs', content: 'Sign tokens and verify them in middleware.', durationMinutes: 19, order: 2 },
        { title: 'Role-based access', content: 'Restrict actions by user role.', durationMinutes: 17, order: 3 },
      ],
    },
  ]);

  await Enrollment.create({
    student: student._id,
    course: courses[0]._id,
    progress: 35,
  });

  console.log('Seed complete.');
  console.log('Demo logins:');
  console.log('  Admin      -> admin@coursedesk.com / admin123');
  console.log('  Instructor -> instructor@coursedesk.com / teach123');
  console.log('  Student    -> student@coursedesk.com / student123');
  console.log(`Created ${courses.length} courses. Admin id: ${admin._id}`);

  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
