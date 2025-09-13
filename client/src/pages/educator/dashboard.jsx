import { motion } from "framer-motion";
import { useContext, useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

// Mock data for demo
const assets = {
  patients_icon: "👥",
  appointments_icon: "📚",
  earning_icon: "💰",
};

const dummyDashboardData = {
  enrolledStudentsData: [
    {
      student: {
        name: "Great Stack",
        imageUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      },
      courseTitle: "Introduction to JavaScript",
    },
    {
      student: {
        name: "Great Stack",
        imageUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      },
      courseTitle: "Advanced Python Programming",
    },
    {
      student: {
        name: "Great Stack",
        imageUrl:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      },
      courseTitle: "Web Development Bootcamp",
    },
    {
      student: {
        name: "Great Stack",
        imageUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      },
      courseTitle: "Data Science with Python",
    },
    {
      student: {
        name: "Great Stack",
        imageUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face",
      },
      courseTitle: "Cybersecurity Basics",
    },
  ],
  totalCourses: 8,
  totalEarning: 1250,
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [animatedValues, setAnimatedValues] = useState({
    enrollments: 0,
    courses: 0,
    earnings: 0,
  });
  const currency = "$";

  const statsRef = useRef(null);
  const tableRef = useRef(null);

  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // GSAP animations for numbers
  useEffect(() => {
    if (dashboardData && statsRef.current) {
      const tl = gsap.timeline();

      // Animate stats cards entrance
      tl.fromTo(
        statsRef.current.children,
        { y: 50, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
        }
      );

      // Animate numbers counting up
      gsap.to(animatedValues, {
        enrollments: dashboardData.enrolledStudentsData.length,
        courses: dashboardData.totalCourses,
        earnings: dashboardData.totalEarning,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          setAnimatedValues({ ...animatedValues });
        },
      });
    }
  }, [dashboardData]);

  // Container variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: { duration: 0.2 },
    },
  };

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 pt-32"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Cards */}
        <motion.div
          ref={statsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="relative overflow-hidden bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
            <div className="relative flex items-center space-x-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg"
              >
                {assets.patients_icon}
              </motion.div>
              <div>
                <motion.p
                  className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                  key={animatedValues.enrollments}
                >
                  {Math.round(animatedValues.enrollments)}
                </motion.p>
                <p className="text-sm text-gray-500 font-medium">
                  Total Enrollments
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="relative overflow-hidden bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10" />
            <div className="relative flex items-center space-x-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg"
              >
                {assets.appointments_icon}
              </motion.div>
              <div>
                <motion.p
                  className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                  key={animatedValues.courses}
                >
                  {Math.round(animatedValues.courses)}
                </motion.p>
                <p className="text-sm text-gray-500 font-medium">
                  Total Courses
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="relative overflow-hidden bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10" />
            <div className="relative flex items-center space-x-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg"
              >
                {assets.earning_icon}
              </motion.div>
              <div>
                <motion.p
                  className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                  key={animatedValues.earnings}
                >
                  {currency}
                  {Math.round(animatedValues.earnings)}
                </motion.p>
                <p className="text-sm text-gray-500 font-medium">
                  Total Earning
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Last Enrollment Table */}
        <motion.div variants={itemVariants} className="space-y-4">
          <motion.h2
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-gray-800"
          >
            Last Enrollment
          </motion.h2>

          <motion.div
            ref={tableRef}
            variants={itemVariants}
            className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 hidden sm:table-cell">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                      Student Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                      Course Title
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.enrolledStudentsData.map((item, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{
                        backgroundColor: "rgba(59, 130, 246, 0.05)",
                        transition: { duration: 0.2 },
                      }}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell font-medium">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <motion.img
                            whileHover={{ scale: 1.1 }}
                            src={item.student.imageUrl}
                            alt="profile"
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                          />
                          <span className="text-sm font-medium text-gray-800 truncate">
                            {item.student.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 truncate">
                        {item.courseTitle}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
