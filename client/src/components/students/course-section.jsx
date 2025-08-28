import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AppContext } from "../../context/app-context";
import CourseCard from "./course-card";

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    rest: {
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    hover: {
      scale: 1.05,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <motion.div
      className="py-16 md:py-20 px-4 md:px-8 lg:px-40 bg-gradient-to-b from-white to-gray-50"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated Heading */}
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
          variants={itemVariants}
        >
          Learn From The{" "}
          <motion.span
            className="text-blue-600"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Best
          </motion.span>
        </motion.h2>

        {/* Animated Description */}
        <motion.p
          className="text-base md:text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Discover our top-rated courses across various categories. From coding
          and design to business and wellness, our courses are crafted to
          deliver exceptional learning experiences.
        </motion.p>

        {/* Animated CTA Button */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 md:px-0 md:py-16 my-4 gap-4">
          {allCourses.slice(0, 4).map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>

        <motion.div variants={itemVariants}>
          <motion.div
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="inline-block"
          >
            <Link
              to="/course-list"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg group"
            >
              Show All Courses
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ x: 0 }}
                animate={{ x: [0, 4, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </motion.svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CoursesSection;
