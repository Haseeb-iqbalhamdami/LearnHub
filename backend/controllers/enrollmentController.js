const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

const enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: 'courseId is required.' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const already = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (already) {
      return res.status(400).json({ message: 'You are already enrolled in this course.' });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      progress: 0,
    });

    const populated = await enrollment.populate([
      { path: 'course', populate: { path: 'instructor', select: 'name email' } },
      { path: 'student', select: 'name email' },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

const getMyCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name email' },
      })
      .sort({ createdAt: -1 });

    res.json(enrollments);
  } catch (error) {
    next(error);
  }
};

const updateProgress = async (req, res, next) => {
  try {
    const { progress } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found.' });
    }

    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed.' });
    }

    enrollment.progress = Math.max(0, Math.min(100, Number(progress) || 0));
    await enrollment.save();

    res.json(enrollment);
  } catch (error) {
    next(error);
  }
};

module.exports = { enrollInCourse, getMyCourses, updateProgress };
