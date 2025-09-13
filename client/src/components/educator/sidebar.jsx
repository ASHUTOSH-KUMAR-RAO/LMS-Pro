import { useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/app-context";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const sidebarRef = useRef(null);
  const logoRef = useRef(null);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/educator",
      icon: assets.home_icon,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-gradient-to-r from-blue-50 to-indigo-50",
    },
    {
      name: "Add Course",
      path: "/educator/add-course",
      icon: assets.add_icon,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
    },
    {
      name: "My Courses",
      path: "/educator/my-courses",
      icon: assets.my_course_icon,
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-gradient-to-r from-purple-50 to-violet-50",
    },
    {
      name: "Student Enrolled",
      path: "/educator/student-enrolled",
      icon: assets.person_tick_icon,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-gradient-to-r from-orange-50 to-red-50",
    },
  ];

  // GSAP Animations
  useEffect(() => {
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
      );
    }

    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 1,
          ease: "elastic.out(1, 0.3)",
          delay: 0.3,
        }
      );
    }
  }, [isEducator]);

  const handleMouseEnter = () => {
    setIsExpanded(true);
    gsap.to(sidebarRef.current, {
      width: "16rem",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
    gsap.to(sidebarRef.current, {
      width: window.innerWidth >= 768 ? "4rem" : "4rem",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  if (!isEducator) return null;

  return (
    <motion.div
      ref={sidebarRef}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative h-screen w-16 md:w-16 bg-white shadow-2xl border-r border-gray-200/50 backdrop-blur-xl z-50 overflow-hidden group hover:w-64 transition-all duration-300 flex-shrink-0"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
      }}
    >
      {/* Logo Section */}
      <motion.div
        ref={logoRef}
        className="flex items-center justify-center py-6 border-b border-gray-200/30"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">E</span>
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              EduSpher
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Navigation Menu */}
      <nav className="mt-8 px-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <NavLink
              to={item.path}
              end={item.path === "/educator"}
              className={({ isActive }) =>
                `group relative flex items-center py-3 px-3 mx-2 my-1 rounded-xl transition-all duration-300 ${
                  isActive
                    ? `${item.bgColor} shadow-lg transform scale-105`
                    : "hover:bg-gray-50/80 hover:shadow-md hover:transform hover:scale-102"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${item.color} rounded-full`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Icon Container */}
                  <motion.div
                    className={`relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} shadow-lg`
                        : "bg-gray-100/50"
                    }`}
                    whileHover={{
                      scale: 1.1,
                      rotate: hoveredItem === item.name ? 10 : 0,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={item.icon}
                      alt={item.name}
                      className={`w-5 h-5 transition-all duration-300 ${
                        isActive
                          ? "filter brightness-0 invert"
                          : "opacity-70 group-hover:opacity-100"
                      }`}
                    />

                    {/* Pulse effect for active item */}
                    {isActive && (
                      <motion.div
                        className={`absolute inset-0 rounded-lg bg-gradient-to-r ${item.color} opacity-30`}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>

                  {/* Text Label */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className={`ml-3 text-sm font-medium transition-all duration-300 ${
                          isActive
                            ? `bg-gradient-to-r ${item.color} bg-clip-text text-transparent font-semibold`
                            : "text-gray-600 group-hover:text-gray-900"
                        }`}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Hover Tooltip for collapsed state */}
                  {!isExpanded && hoveredItem === item.name && (
                    <motion.div
                      initial={{ opacity: 0, x: -10, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -10, scale: 0.8 }}
                      className="absolute left-16 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl z-50"
                      style={{ pointerEvents: "none" }}
                    >
                      {item.name}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </motion.div>
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Bottom Decoration */}
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-8 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full opacity-50"></div>
      </motion.div>

      {/* Expanded State Background Blur */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-b from-indigo-50/20 to-purple-50/20 -z-10"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Sidebar;
