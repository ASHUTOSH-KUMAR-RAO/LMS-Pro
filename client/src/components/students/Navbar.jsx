import { assets } from "../../assets/assets";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const isCourseListPage = location.pathname.includes("/courses-list");
  const [isHovered, setIsHovered] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const logoVariants = {
    hover: { 
      scale: 1.05,
      rotate: [0, -1, 1, 0],
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const linkVariants = {
    hover: { 
      y: -2,
      color: "#3b82f6",
      transition: { duration: 0.2 }
    }
  };

  const mobileMenuVariants = {
    hover: { 
      backgroundColor: "rgba(243, 244, 246, 0.5)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className={`flex items-center justify-between px-3 sm:px-6 md:px-10 lg:px-36 border-b border-gray-300 py-3 sm:py-4 backdrop-blur-sm transition-all duration-300 ${
        isCourseListPage 
          ? "bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm" 
          : "bg-gradient-to-r from-cyan-50/80 to-cyan-100/60 shadow-md"
      }`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Logo Section */}
      <motion.div 
        className="flex items-center gap-x-3 sm:gap-x-4 text-xl sm:text-2xl font-bold text-gray-800 cursor-pointer"
        variants={logoVariants}
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.img
          src="/teachUs.png"
          alt="Logo"
          className="w- h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-xl shadow-lg object-cover"
          whileHover={{ rotate: 3 }}
          transition={{ duration: 0.3 }}
        />
        <motion.p 
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-extrabold tracking-tight"
          animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
        >
          <span className="hidden sm:inline">EduSphere</span>
          <span className="sm:hidden">Edu</span>
        </motion.p>
      </motion.div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6 text-gray-600">
        <div className="flex items-center gap-6">
          <motion.button
            className="font-medium hover:text-blue-600 transition-colors duration-200 relative"
            variants={linkVariants}
            whileHover="hover"
          >
            Become Educator
            <motion.div
              className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600"
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          
          <span className="text-gray-400">|</span>
          
          <motion.div
            variants={linkVariants}
            whileHover="hover"
          >
            <Link 
              to="/my-enrollment" 
              className="font-medium hover:text-blue-600 transition-colors duration-200 relative"
            >
              My Enrollments
              <motion.div
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>
        </div>
        
        <motion.button
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <motion.span
            initial={{ opacity: 1 }}
            whileHover={{ opacity: 0.9 }}
          >
            Create An Account
          </motion.span>
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <motion.div 
        className="md:hidden flex items-center gap-2 sm:gap-4 text-gray-600"
        variants={mobileMenuVariants}
        whileHover="hover"
      >
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
          <motion.button
            className="hover:text-blue-600 transition-colors duration-200 px-1 py-1 rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="hidden sm:inline">Become Educator</span>
            <span className="sm:hidden">Teach</span>
          </motion.button>
          <span className="text-gray-400 text-xs">|</span>
          <Link 
            to="/my-enrollment"
            className="hover:text-blue-600 transition-colors duration-200 px-1 py-1 rounded"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <span className="hidden sm:inline">My Enrollments</span>
              <span className="sm:hidden">Enrolled</span>
            </motion.span>
          </Link>
        </div>
        
        <motion.button
          className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200 shadow-sm"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.img 
            src={assets.user_icon} 
            alt="User"
            className="w-5 h-5 sm:w-6 sm:h-6"
            whileHover={{ opacity: 0.8 }}
          />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Navbar;