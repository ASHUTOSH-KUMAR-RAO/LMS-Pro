import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

// 🌐 Create App Context
export const AppContext = createContext();

export const AppContextProvider = (props) => {
  // 📊 State Management
  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // 🔧 Environment Variables
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;

  // 🛤️ Navigation & Auth Hooks
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();

  // 📚 Fetch All Courses Function
  const fetchAllCourse = async () => {
    try {
      const { data } = await axios.get(backend_url + "/api/course/all");

      if (data.success) {
        setAllCourses(data.courses);
        toast.success("📚 Courses loaded successfully!");
      } else {
        toast.error(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error(`⚠️ Failed to load courses: ${error.message}`);
    }
  };

  // ⭐ Calculate Course Rating with Safety Checks
  const calculateRating = (course) => {
    try {
      // 🛡️ Safety checks to prevent undefined errors
      if (!course) {
        console.warn("⚠️ Course is undefined in calculateRating");
        return 0;
      }

      if (!course.courseRatings) {
        console.warn(
          "⚠️ courseRatings is undefined for course:",
          course.title || course._id
        );
        return 0;
      }

      if (!Array.isArray(course.courseRatings)) {
        console.warn(
          "⚠️ courseRatings is not an array:",
          typeof course.courseRatings
        );
        return 0;
      }

      if (course.courseRatings.length === 0) {
        return 0;
      }

      // 🧮 Calculate average rating
      let totalRating = 0;
      course.courseRatings.forEach((rating) => {
        if (rating && typeof rating.rating === "number") {
          totalRating += rating.rating;
        }
      });

      return Math.round((totalRating / course.courseRatings.length) * 10) / 10; // Round to 1 decimal
    } catch (error) {
      console.error("❌ Error in calculateRating:", error);
      return 0;
    }
  };

  // ⏱️ Calculate Chapter Time Duration
  const calculateChapterTime = (chapter) => {
    try {
      if (!chapter || !Array.isArray(chapter.chapterContent)) {
        console.warn("⚠️ Invalid chapter data in calculateChapterTime");
        return "0m";
      }

      let time = 0;
      chapter.chapterContent.forEach((lecture) => {
        if (lecture && typeof lecture.lectureDuration === "number") {
          time += lecture.lectureDuration;
        }
      });

      return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    } catch (error) {
      console.error("❌ Error in calculateChapterTime:", error);
      return "0m";
    }
  };

  // 📅 Calculate Total Course Duration
  const calculateCourseDuration = (course) => {
    try {
      if (!course || !Array.isArray(course.courseContent)) {
        console.warn("⚠️ Invalid course data in calculateCourseDuration");
        return "0m";
      }

      let time = 0;
      course.courseContent.forEach((chapter) => {
        if (chapter && Array.isArray(chapter.chapterContent)) {
          chapter.chapterContent.forEach((lecture) => {
            if (lecture && typeof lecture.lectureDuration === "number") {
              time += lecture.lectureDuration;
            }
          });
        }
      });

      return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });

      // 💡 humanizeDuration package converts raw time (milliseconds/seconds)
      // into readable format like "1h 34m" instead of "94 minutes"
    } catch (error) {
      console.error("❌ Error in calculateCourseDuration:", error);
      return "0m";
    }
  };

  // 🔢 Calculate Total Number of Lectures
  const calculateNoOfLecture = (course) => {
    try {
      if (!course || !Array.isArray(course.courseContent)) {
        console.warn("⚠️ Invalid course data in calculateNoOfLecture");
        return 0;
      }

      let totalLectures = 0;
      course.courseContent.forEach((chapter) => {
        if (chapter && Array.isArray(chapter.chapterContent)) {
          totalLectures += chapter.chapterContent.length;
        }
      });

      return totalLectures;
    } catch (error) {
      console.error("❌ Error in calculateNoOfLecture:", error);
      return 0;
    }
  };

  // 📖 Fetch User Enrolled Courses
  const fetchUserEnrolledCourses = async () => {
    try {
      // TODO: Replace with actual API call
      setEnrolledCourses(dummyCourses);
      console.log("📖 Enrolled courses loaded");
    } catch (error) {
      console.error("❌ Error fetching enrolled courses:", error);
      toast.error("⚠️ Failed to load enrolled courses");
    }
  };

  // 🔐 Log Authentication Token (for debugging)
  const logToken = async () => {
    try {
      const token = await getToken();
      console.log("🔐 Auth Token:", token);
    } catch (error) {
      console.error("❌ Error getting token:", error);
    }
  };

  // 🚀 Initialize data on component mount
  useEffect(() => {
    console.log("🚀 Initializing App Context...");
    fetchAllCourse();
    fetchUserEnrolledCourses();
  }, []);

  // 👤 Log token when user changes
  useEffect(() => {
    if (user) {
      logToken();
    }
  }, [user]);

  // 📦 Context Value Object
  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLecture,
    enrolledCourses,
    fetchUserEnrolledCourses,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
