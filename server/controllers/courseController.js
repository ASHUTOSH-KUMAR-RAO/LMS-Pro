import Course from "../models/Course.js";

/**
 * 📚 Get all published courses
 * Returns courses without courseContent and enrolledStudents data
 * @route GET /api/courses
 * @access Public
 */
export const getAllCourses = async (req, res) => {
  try {
    // 🔍 Find all published courses and exclude sensitive data
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"]) // ➖ Exclude courseContent & enrolledStudents from response
      .populate({
        path: "educator",
      });

    // ✅ Success response
    res.json({
      success: true,
      courses,
      message: "📚 Courses fetched successfully!",
    });
  } catch (error) {
    // ❌ Error response
    res.json({
      success: false,
      message: `⚠️ Error fetching courses: ${error.message}`,
    });
  }
};

/**
 * 🎯 Get course by ID
 * Returns complete course data with populated educator info
 * Filters lecture URLs for non-preview content
 * @route GET /api/courses/:id
 * @access Public
 */
export const getCourseId = async (req, res) => {
  const { id } = req.params;

  try {
    // 🔍 Find course by ID and populate educator details
    const courseData = await Course.findById(id).populate({
      path: "educator",
    });

    // 🚫 Check if course exists
    if (!courseData) {
      return res.json({
        success: false,
        message: "❌ Course not found!",
      });
    }

    // 🔒 Filter lecture URLs for non-preview content
    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = ""; // 🔐 Hide premium content URL
        }
      });
    });

    // ✅ Success response
    res.json({
      success: true,
      courseData,
      message: "🎯 Course details fetched successfully!",
    });
  } catch (error) {
    // ❌ Error response
    res.json({
      success: false,
      message: `⚠️ Error fetching course: ${error.message}`,
    });
  }
};
