import { assets, dummyEducatorData } from "../../assets/assets";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link, Navigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const Navbar = () => {
  const educatorData = dummyEducatorData;
  const { user } = useUser();
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const userSectionRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { scrollY } = useScroll();
  const navbarOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const navbarBlur = useTransform(scrollY, [0, 100], [0, 10]);

  // GSAP animations on mount
  useEffect(() => {
    const tl = gsap.timeline();

    // Initial animations
    tl.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    )
      .fromTo(
        logoRef.current,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.4"
      )
      .fromTo(
        titleRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        userSectionRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );

    // Scroll effect
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);

      if (scrolled) {
        gsap.to(navRef.current, {
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(navRef.current, {
          backdropFilter: "blur(0px)",
          backgroundColor: "rgba(255, 255, 255, 1)",
          boxShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logo hover animation with infinite rotation
  const handleLogoHover = (isEntering) => {
    if (isEntering) {
      // Start infinite rotation on hover
      gsap.to(logoRef.current, {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(logoRef.current, {
        rotation: "+=360",
        duration: 1,
        repeat: -1,
        ease: "none",
      });
    } else {
      // Stop rotation and reset on hover out
      gsap.killTweensOf(logoRef.current);
      gsap.to(logoRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  // Title letter animation
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const profileVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay: 0.6,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: [0, 0.5, 0],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      ref={navRef}
      style={{
        opacity: navbarOpacity,
        backdropFilter: `blur(${navbarBlur}px)`,
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 shadow-xl border-b border-gray-200/50"
          : "bg-white border-b border-gray-200"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-3 max-w-7xl mx-auto">
        {/* Logo and Title Section */}
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Link to="/" className="relative group">
            {/* Outer rotating ring */}
            <motion.div
              className="absolute inset-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16"
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <div className="w-full h-full border-2 border-dashed border-blue-400/40 rounded-full"></div>
            </motion.div>

            {/* Middle pulsing ring */}
            <motion.div
              className="absolute inset-0 w-11 h-11 sm:w-13 sm:h-13 lg:w-15 lg:h-15 top-0.5 left-0.5"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-full h-full border border-purple-500/50 rounded-full"></div>
            </motion.div>

            {/* Inner rotating particles */}
            <motion.div
              className="absolute inset-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16"
              animate={{ rotate: -360 }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[0, 60, 120, 180, 240, 300].map((angle, index) => (
                <motion.div
                  key={index}
                  className="absolute w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-20px)`,
                  }}
                  animate={{
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.1,
                  }}
                />
              ))}
            </motion.div>

            {/* Glow effect behind logo */}
            <motion.div
              className="absolute inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur-md"
              variants={glowVariants}
              initial="initial"
              animate="animate"
            />

            {/* Hover effect ring */}
            <motion.div
              className="absolute inset-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 border-2 border-transparent rounded-full"
              whileHover={{
                borderColor: "#3B82F6",
                scale: 1.1,
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
              }}
              transition={{ duration: 0.3 }}
            />

            <motion.img
              ref={logoRef}
              src="/teachUs.png"
              alt="EduSphere Logo"
              className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl shadow-lg object-cover ring-2 ring-white/80 z-10"
              onMouseEnter={() => handleLogoHover(true)}
              onMouseLeave={() => handleLogoHover(false)}
              whileHover={{
                rotateY: 15,
                shadow: "0 20px 40px rgba(0,0,0,0.2)",
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
            />

            {/* Orbital elements */}
            <motion.div
              className="absolute inset-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <motion.div
                className="absolute w-2 h-2 bg-blue-500 rounded-full opacity-60"
                style={{
                  top: "10%",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute w-1.5 h-1.5 bg-purple-500 rounded-full opacity-60"
                style={{
                  top: "50%",
                  right: "10%",
                  transform: "translateY(-50%)",
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
            </motion.div>
          </Link>

          {/* Animated Title */}
          <motion.div
            ref={titleRef}
            className="hidden sm:block"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              {"EduSphere".split("").map((letter, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="inline-block hover:scale-110 transition-transform cursor-pointer"
                  whileHover={{
                    color: "#3B82F6",
                    y: -2,
                    transition: { duration: 0.2 },
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.h1>
            <motion.div
              className="h-0.5 bg-gradient-to-r from-blue-400 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>
        </motion.div>

        {/* User Section */}
        <motion.div
          ref={userSectionRef}
          className="flex items-center gap-3"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Greeting Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-right hidden sm:block"
          >
            <motion.p
              className="text-sm text-gray-600 font-medium"
              animate={{
                color: isHovered ? "#3B82F6" : "#6B7280",
              }}
              transition={{ duration: 0.3 }}
            >
              Welcome back!
            </motion.p>
            <motion.p
              className="text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              {user ? user.fullName : "Developer"}
            </motion.p>
          </motion.div>

          {/* Profile Section */}
          <motion.div
            variants={profileVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="relative"
          >
            {user ? (
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated ring around UserButton */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                  animate={{
                    rotate: isHovered ? 360 : 0,
                    scale: isHovered ? 1.1 : 1,
                  }}
                  transition={{
                    rotate: {
                      duration: 2,
                      ease: "linear",
                      repeat: isHovered ? Infinity : 0,
                    },
                    scale: { duration: 0.3, ease: "easeOut" },
                  }}
                  style={{ padding: "2px" }}
                />
                <div className="relative bg-white rounded-full">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-10 h-10 ring-2 ring-white",
                      },
                    }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-sm opacity-75"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.75, 0.5, 0.75],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <img
                  src={assets.profile_img}
                  className="relative w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-lg"
                  alt="Profile"
                />
              </motion.div>
            )}

            {/* Status indicator */}
            <motion.div
              className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full ring-2 ring-white"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Mobile greeting */}
          <motion.p
            className="text-sm text-gray-600 sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Hi! {user ? user.firstName : "Dev"}
          </motion.p>
        </motion.div>
      </div>

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600"
        style={{
          scaleX: useTransform(scrollY, [0, 1000], [0, 1]),
          transformOrigin: "left",
        }}
      />
    </motion.div>
  );
};

export default Navbar;
