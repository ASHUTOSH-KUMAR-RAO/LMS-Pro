import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Calendar, BookOpen, Search } from "lucide-react";

// Dummy data for demo
const dummyStudentEnrolled = [
  {
    student: {
      name: "Rahul Kumar",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    courseTitle: "React.js Complete Course",
    purchaseDate: "2024-01-15",
  },
  {
    student: {
      name: "Priya Singh",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    courseTitle: "JavaScript Fundamentals",
    purchaseDate: "2024-01-14",
  },
  {
    student: {
      name: "Amit Sharma",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    courseTitle: "Node.js Backend Development",
    purchaseDate: "2024-01-13",
  },
  {
    student: {
      name: "Sneha Patel",
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    courseTitle: "Python Data Science",
    purchaseDate: "2024-01-12",
  },
  {
    student: {
      name: "Vikash Gupta",
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    courseTitle: "UI/UX Design Masterclass",
    purchaseDate: "2024-01-11",
  },
];

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center space-y-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
      />
      <p className="text-slate-600 font-medium">Loading enrolled students...</p>
    </motion.div>
  </div>
);

const StudentEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  const fetchEnrolledStudents = async () => {
    // Simulate API call delay
    setTimeout(() => {
      setEnrolledStudents(dummyStudentEnrolled);
      setFilteredStudents(dummyStudentEnrolled);
    }, 1500);
  };

  useEffect(() => {
    fetchEnrolledStudents();
  }, []);

  useEffect(() => {
    if (enrolledStudents) {
      const filtered = enrolledStudents.filter(
        (item) =>
          item.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, enrolledStudents]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    hover: {
      scale: 1.01,
      backgroundColor: "rgba(59, 130, 246, 0.05)",
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {enrolledStudents ? (
        <motion.div
          key="content"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
          className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4 md:p-8"
        >
          {/* Header Section */}
          <motion.div variants={cardVariants} className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">
                Enrolled Students
              </h1>
            </div>
            <p className="text-slate-600">
              Track and manage student enrollments
            </p>
          </motion.div>

          {/* Search and Stats */}
          <motion.div
            variants={cardVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {/* Search Bar */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students or courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all duration-200 text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Stats Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg shadow-blue-500/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Enrolled
                  </p>
                  <p className="text-2xl font-bold">
                    {filteredStudents.length}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-200" />
              </div>
            </motion.div>
          </motion.div>

          {/* Main Table Card */}
          <motion.div
            variants={cardVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/60">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 hidden sm:table-cell">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Course
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 hidden md:table-cell">
                      Enrolled Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredStudents.map((item, index) => (
                      <motion.tr
                        key={index}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        whileHover="hover"
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-slate-200/40 cursor-pointer"
                      >
                        <td className="px-6 py-4 text-slate-500 font-medium hidden sm:table-cell">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="relative"
                            >
                              <img
                                src={item.student.imageUrl}
                                alt={item.student.name}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                              />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                            </motion.div>
                            <div>
                              <p className="font-semibold text-slate-800">
                                {item.student.name}
                              </p>
                              <p className="text-sm text-slate-500">
                                Active Student
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-slate-700 font-medium">
                              {item.courseTitle}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="flex items-center space-x-2 text-slate-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(item.purchaseDate).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && searchTerm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-lg font-medium">
                  No students found
                </p>
                <p className="text-slate-400">
                  Try adjusting your search terms
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Footer Stats */}
          <motion.div
            variants={cardVariants}
            className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/40">
              <p className="text-slate-600 text-sm">This Month</p>
              <p className="text-xl font-bold text-slate-800">12 Enrollments</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/40">
              <p className="text-slate-600 text-sm">Active Courses</p>
              <p className="text-xl font-bold text-slate-800">5 Courses</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/40">
              <p className="text-slate-600 text-sm">Completion Rate</p>
              <p className="text-xl font-bold text-green-600">87%</p>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <Loading key="loading" />
      )}
    </AnimatePresence>
  );
};

export default StudentEnrolled;
