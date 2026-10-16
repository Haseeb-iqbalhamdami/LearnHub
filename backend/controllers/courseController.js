const Course = require('../models/Course');

const getCourses = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = { isPublished: true };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(filter)
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    next(error);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, price, level, lessons, thumbnail } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description and category are required.' });
    }

    const course = await Course.create({
      title,
      description,
      category,
      price: Number(price) || 0,
      level: level || 'Beginner',
      lessons: lessons || [],
      thumbnail: thumbnail || '',
      instructor: req.user._id,
    });

    const populated = await course.populate('instructor', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const isOwner = course.instructor.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only edit your own courses.' });
    }

    const fields = ['title', 'description', 'category', 'price', 'level', 'lessons', 'thumbnail', 'isPublished'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        course[field] = req.body[field];
      }
    });

    const updated = await course.save();
    const populated = await updated.populate('instructor', 'name email');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const isOwner = course.instructor.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete your own courses.' });
    }

    await course.deleteOne();
    res.json({ message: 'Course deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

const getInstructorCourses = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { instructor: req.user._id };
    const courses = await Course.find(filter)
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
};
