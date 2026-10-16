# CourseDesk

Final project (Batch 3) — simple LMS with React + Node + MongoDB.

Students can look at courses and enroll. Instructors add/edit/delete courses. Admin can see users and some counts.

## Folders

- `backend` — Express API
- `frontend` — React (Vite)

## How to run

Need a MongoDB Atlas URI in `backend/.env` (copy from `.env.example`).

```
cd backend
npm install
npm run seed
npm run dev
```

```
cd frontend
npm install
npm run dev
```

Backend: http://localhost:5000  
Frontend: http://localhost:5173

## Demo logins (after seed)

- admin@coursedesk.com / admin123
- instructor@coursedesk.com / teach123
- student@coursedesk.com / student123

## APIs used

register, login, courses CRUD, enroll, my-courses  
admin also has users + analytics

## Tech

React, React Router, Axios, Bootstrap, Express, MongoDB/Mongoose, JWT, bcrypt
