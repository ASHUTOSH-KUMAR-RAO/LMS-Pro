import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";

// Update user role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID not found",
      });
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: "educator" },
    });

    res.status(200).json({
      success: true,
      message: "You can publish a course now! 🎓",
    });
  } catch (error) {
    console.error("Error updating role to educator:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update role. Please try again.",
    });
  }
};

// Add new course with proper error handling and optimization
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth?.userId;

    // Validation checks
    if (!educatorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Please login first",
      });
    }

    if (!courseData) {
      return res.status(400).json({
        success: false,
        message: "Course data is required",
      });
    }

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Course thumbnail is required ❌",
      });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(imageFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Only JPEG, PNG, and WebP images are allowed",
      });
    }

    // Validate file size (max 5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Image size should be less than 5MB",
      });
    }

    // Parse course data with error handling
    let parsedCourseData;
    try {
      parsedCourseData = JSON.parse(courseData);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: "Invalid course data format",
      });
    }

    // Validate required course fields
    const requiredFields = ["courseTitle", "courseDescription", "coursePrice"];
    for (const field of requiredFields) {
      if (!parsedCourseData[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    // Upload image to cloudinary first (fail fast approach)
    let imageUploadResult;
    try {
      imageUploadResult = await cloudinary.uploader.upload(imageFile.path, {
        folder: "course-thumbnails",
        transformation: [
          { width: 800, height: 450, crop: "fill" },
          { quality: "auto" },
        ],
      });
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return res.status(500).json({
        success: false,
        message: "Failed to upload thumbnail. Please try again.",
      });
    }

    // Prepare course data
    const courseDataToSave = {
      ...parsedCourseData,
      educator: educatorId,
      courseThumbnail: imageUploadResult.secure_url,
      // Set default values if not provided
      isPublished: parsedCourseData.isPublished ?? false,
      discount: parsedCourseData.discount ?? 0,
      courseContent: parsedCourseData.courseContent ?? [],
      courseRating: [],
      enrolledStudents: [],
    };

    // Create course in database
    const newCourse = await Course.create(courseDataToSave);

    // Send success response
    res.status(201).json({
      success: true,
      message: "Course created successfully! ✅",
      data: {
        courseId: newCourse._id,
        courseTitle: newCourse.courseTitle,
        courseThumbnail: newCourse.courseThumbnail,
      },
    });
  } catch (error) {
    console.error("Error creating course:", error);

    // Handle specific MongoDB errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: validationErrors,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Course with this title already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};

// Get all courses by educator
export const getEducatorCourses = async (req, res) => {
  try {
    const educatorId = req.auth?.userId;

    if (!educatorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const courses = await Course.find({ educator: educatorId })
      .select("-courseContent") // Exclude heavy content for listing
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
      count: courses.length,
    });
  } catch (error) {
    console.error("Error fetching educator courses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth?.userId;

    if (!educatorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Find course and check ownership
    const existingCourse = await Course.findOne({
      _id: courseId,
      educator: educatorId,
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found or unauthorized",
      });
    }

    let updateData = {};

    // Parse course data if provided
    if (courseData) {
      try {
        updateData = JSON.parse(courseData);
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: "Invalid course data format",
        });
      }
    }

    // Upload new image if provided
    if (imageFile) {
      try {
        const imageUploadResult = await cloudinary.uploader.upload(
          imageFile.path,
          {
            folder: "course-thumbnails",
            transformation: [
              { width: 800, height: 450, crop: "fill" },
              { quality: "auto" },
            ],
          }
        );
        updateData.courseThumbnail = imageUploadResult.secure_url;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload new thumbnail",
        });
      }
    }

    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Course updated successfully! ✅",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const educatorId = req.auth?.userId;

    if (!educatorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Find and delete course (only if educator owns it)
    const deletedCourse = await Course.findOneAndDelete({
      _id: courseId,
      educator: educatorId,
    });

    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully! 🗑️",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};

// Get Educator Dashboard

export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth?.userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;

    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchases.amount,
      0
    );

    const enrolledStudentsData = [];

    for (const course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name,imageUrl"
      );
      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Enrolled Student Data Purchase Data :-

export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth?.userId;
    const courses = await Course.find({ educator });

    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    }).populate("userId","name,imageUrl").populate('courseId','courseTitle')

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.userId.courseTitle,
      purchaseDate:purchase.createdAt
    }));

    res.json({success:true,enrolledStudents})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
};
