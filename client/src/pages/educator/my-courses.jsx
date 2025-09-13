import { useContext, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { AppContext } from "../../context/app-context";
import Loading from "../../components/students/loading";

const MyCourses = () => {
  const { currency, allCourses } = useContext(AppContext);
  const [courses, setCourses] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sortBy, setSortBy] = useState("title");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const headerRef = useRef(null);
  const tableRef = useRef(null);
  const statsRef = useRef(null);

  const fetchEducatorCourses = async () => {
    setCourses(allCourses);
  };

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetchEducatorCourses();
  }, [allCourses]);

  // GSAP Animations
  useEffect(() => {
    if (courses) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      gsap.fromTo(
        tableRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.2, ease: "power2.out" }
      );

      gsap.fromTo(
        ".stat-card",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.4,
          ease: "power2.out",
        }
      );
    }
  }, [courses]);

  // Filter and sort courses
  const filteredCourses = courses
    ? courses
        .filter((course) =>
          course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          switch (sortBy) {
            case "title":
              return a.courseTitle.localeCompare(b.courseTitle);
            case "earning":
              return (
                b.enrolledStudents.length *
                  (b.coursePrice - (b.discount * b.coursePrice) / 100) -
                a.enrolledStudents.length *
                  (a.coursePrice - (a.discount * a.coursePrice) / 100)
              );
            case "students":
              return b.enrolledStudents.length - a.enrolledStudents.length;
            case "date":
              return new Date(b.createdAt) - new Date(a.createdAt);
            default:
              return 0;
          }
        })
    : [];

  // Calculate total stats
  const totalEarnings = filteredCourses.reduce(
    (sum, course) =>
      sum +
      course.enrolledStudents.length *
        (course.coursePrice - (course.discount * course.coursePrice) / 100),
    0
  );
  const totalStudents = filteredCourses.reduce(
    (sum, course) => sum + course.enrolledStudents.length,
    0
  );

  const handleRowHover = (courseId) => {
    if (!isMobile) {
      setHoveredRow(courseId);
      gsap.to(`.row-${courseId}`, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleRowLeave = (courseId) => {
    if (!isMobile) {
      setHoveredRow(null);
      gsap.to(`.row-${courseId}`, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  // Mobile Card Component
  const MobileCourseCard = ({ course, index }) => (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedCourse(course)}
    >
      <div className="flex items-start space-x-4">
        <motion.div
          className="relative overflow-hidden rounded-lg flex-shrink-0"
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={course.courseThumbnail}
            alt="course thumbnail"
            className="w-20 h-16 object-cover rounded-lg shadow-md"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
        </motion.div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
            {course.courseTitle}
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            {course.category || "Programming"}
          </p>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-green-600 font-bold">
                {currency}{" "}
                {Math.floor(
                  course.enrolledStudents.length *
                    (course.coursePrice -
                      (course.discount * course.coursePrice) / 100)
                )}
              </div>
              <div className="text-gray-500 mt-1">Earning</div>
            </div>

            <div className="text-center">
              <div className="text-blue-600 font-bold">
                {course.enrolledStudents.length}
              </div>
              <div className="text-gray-500 mt-1">Students</div>
            </div>

            <div className="text-center">
              <div className="text-purple-600 font-bold text-xs">
                {new Date(course.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="text-gray-500 mt-1">Published</div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <motion.button
            className="text-gray-400 hover:text-blue-500 p-1"
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-lg">→</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  if (!courses) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-2 sm:p-4 lg:p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          ref={headerRef}
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col space-y-4 sm:space-y-6">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                My Courses
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage and track your course performance
              </p>
            </div>

            {/* Search and Filter - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="relative flex-1"
              >
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 sm:py-2 pl-10 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <motion.div
                  className="absolute left-3 top-3 sm:top-2.5 text-gray-400"
                  animate={{ rotate: searchTerm ? 360 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span>🔍</span>
                </motion.div>
              </motion.div>

              <motion.select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-w-0 sm:min-w-[150px]"
                whileFocus={{ scale: 1.02 }}
              >
                <option value="title">Sort by Title</option>
                <option value="earning">Sort by Earnings</option>
                <option value="students">Sort by Students</option>
                <option value="date">Sort by Date</option>
              </motion.select>
            </div>
          </div>

          {/* Stats Cards - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <motion.div
              className="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-xl shadow-lg"
              whileHover={{ y: isMobile ? 0 : -5, scale: isMobile ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1 text-sm">Total Courses</p>
                  <motion.p
                    className="text-xl sm:text-2xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {filteredCourses.length}
                  </motion.p>
                </div>
                <div className="text-2xl sm:text-3xl opacity-80">
                  <span>📚</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="stat-card bg-gradient-to-br from-green-500 to-green-600 text-white p-4 sm:p-6 rounded-xl shadow-lg"
              whileHover={{ y: isMobile ? 0 : -5, scale: isMobile ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1 text-sm">Total Earnings</p>
                  <motion.p
                    className="text-xl sm:text-2xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {currency} {Math.floor(totalEarnings)}
                  </motion.p>
                </div>
                <div className="text-2xl sm:text-3xl opacity-80">
                  <span>💰</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="stat-card bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 sm:p-6 rounded-xl shadow-lg sm:col-span-2 lg:col-span-1"
              whileHover={{ y: isMobile ? 0 : -5, scale: isMobile ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1 text-sm">Total Students</p>
                  <motion.p
                    className="text-xl sm:text-2xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    {totalStudents}
                  </motion.p>
                </div>
                <div className="text-2xl sm:text-3xl opacity-80">
                  <span>👥</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Courses Section - Mobile vs Desktop */}
        {isMobile ? (
          /* Mobile Card Layout */
          <motion.div
            ref={tableRef}
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AnimatePresence>
              {filteredCourses.map((course, index) => (
                <MobileCourseCard
                  key={course._id}
                  course={course}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Desktop Table Layout */
          <motion.div
            ref={tableRef}
            className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <motion.th
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                      whileHover={{ scale: 1.05 }}
                    >
                      Course Details
                    </motion.th>
                    <motion.th
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                      whileHover={{ scale: 1.05 }}
                    >
                      Earning
                    </motion.th>
                    <motion.th
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                      whileHover={{ scale: 1.05 }}
                    >
                      Students
                    </motion.th>
                    <motion.th
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                      whileHover={{ scale: 1.05 }}
                    >
                      Published On
                    </motion.th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredCourses.map((course, index) => (
                      <motion.tr
                        key={course._id}
                        className={`row-${
                          course._id
                        } border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 cursor-pointer ${
                          hoveredRow === course._id ? "shadow-lg" : ""
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        onMouseEnter={() => handleRowHover(course._id)}
                        onMouseLeave={() => handleRowLeave(course._id)}
                        onClick={() => setSelectedCourse(course)}
                        whileHover={{
                          backgroundColor: "rgba(59, 130, 246, 0.05)",
                        }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <motion.div
                              className="relative overflow-hidden rounded-lg"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <img
                                src={course.courseThumbnail}
                                alt="course thumbnail"
                                className="w-16 h-12 object-cover rounded-lg shadow-md"
                              />
                              <motion.div
                                className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                                whileHover={{ opacity: 1 }}
                              >
                                <span className="text-white text-xs">👁</span>
                              </motion.div>
                            </motion.div>
                            <div>
                              <motion.h3
                                className="font-semibold text-gray-900 max-w-xs truncate"
                                whileHover={{ color: "#3b82f6" }}
                              >
                                {course.courseTitle}
                              </motion.h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {course.category || "Programming"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="flex items-center space-x-1"
                          >
                            <span className="text-lg font-bold text-green-600">
                              {currency}
                            </span>
                            <motion.span
                              className="text-lg font-bold text-green-600"
                              whileHover={{ scale: 1.1 }}
                            >
                              {Math.floor(
                                course.enrolledStudents.length *
                                  (course.coursePrice -
                                    (course.discount * course.coursePrice) /
                                      100)
                              )}
                            </motion.span>
                          </motion.div>
                        </td>
                        <td className="px-6 py-4">
                          <motion.div
                            className="flex items-center space-x-2"
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm">
                                {course.enrolledStudents.length}
                              </span>
                            </div>
                            <span className="text-gray-600">students</span>
                          </motion.div>
                        </td>
                        <td className="px-6 py-4">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="text-gray-600"
                          >
                            {new Date(course.createdAt).toLocaleDateString()}
                          </motion.div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Course Detail Modal - Mobile Optimized */}
        <AnimatePresence>
          {selectedCourse && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
            >
              <motion.div
                className="bg-white rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 pr-4">
                    {selectedCourse.courseTitle}
                  </h2>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl flex-shrink-0 p-1"
                  >
                    ×
                  </button>
                </div>
                <img
                  src={selectedCourse.courseThumbnail}
                  alt="course thumbnail"
                  className="w-full h-32 sm:h-40 object-cover rounded-lg mb-4"
                />
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Students:</span>
                    <span className="font-semibold">
                      {selectedCourse.enrolledStudents.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Earnings:</span>
                    <span className="font-semibold text-green-600">
                      {currency}{" "}
                      {Math.floor(
                        selectedCourse.enrolledStudents.length *
                          (selectedCourse.coursePrice -
                            (selectedCourse.discount *
                              selectedCourse.coursePrice) /
                              100)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">Published:</span>
                    <span className="font-semibold">
                      {new Date(selectedCourse.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State - Mobile Optimized */}
        {filteredCourses.length === 0 && (
          <motion.div
            className="text-center py-8 sm:py-12 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-4xl sm:text-6xl mb-4">
              <span>📚</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {searchTerm
                ? "Try adjusting your search term"
                : "Start creating your first course"}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MyCourses;
