const express = require('express');
const {
  enrollInCourse,
  getMyCourses,
  updateProgress,
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/enroll', protect, authorize('student', 'admin'), enrollInCourse);
router.get('/my-courses', protect, authorize('student', 'admin'), getMyCourses);
router.put('/:id/progress', protect, authorize('student', 'admin'), updateProgress);

module.exports = router;
