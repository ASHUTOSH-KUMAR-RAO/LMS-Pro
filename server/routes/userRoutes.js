import express from "express";
import {
  userEnrolledCourses,
  getUserData,
  purchaseCourse,
  updateUserCourseProgress,
  getUserCourseProgress,
  addUserRating,
} from "../controllers/userContoller.js";

// 🛤️ Create Express Router instance
const userRouter = express.Router();

// 👤 User Data Routes
/**
 * 📋 Get user profile data
 * @route GET /api/user/data
 * @access Private (requires authentication)
 */
userRouter.get("/data", getUserData);

/**
 * 📚 Get user enrolled courses
 * @route GET /api/user/enrolled-courses
 * @access Private (requires authentication)
 */
userRouter.get("/enrolled-courses", userEnrolledCourses);

// 💳 Purchase & Progress Routes
/**
 * 💰 Purchase a course
 * @route POST /api/user/purchase
 * @access Private (requires authentication)
 */
userRouter.post("/purchase", purchaseCourse);

/**
 * 📈 Update course progress for user
 * @route POST /api/user/update-course-progress
 * @access Private (requires authentication)
 */
userRouter.post("/update-course-progress", updateUserCourseProgress);

/**
 * 📊 Get user's course progress
 * @route POST /api/user/get-course-progress
 * @access Private (requires authentication)
 */
userRouter.post("/get-course-progress", getUserCourseProgress);

// ⭐ Rating & Review Routes
/**
 * ⭐ Add rating/review for a course
 * @route POST /api/user/add-rating
 * @access Private (requires authentication)
 */
userRouter.post("/add-rating", addUserRating);

// 📤 Export router
export default userRouter;
