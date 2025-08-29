import { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/app-context";
import { Link } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const CourseCard = ({ course, index }) => {
  const { currency, calculateRating } = useContext(AppContext);
  const [isHovered, setIsHovered] = useState(false);

  // Refs for GSAP animations
  const cardRef = useRef(null);
  const priceRef = useRef(null);
  const titleRef = useRef(null);
  const educatorRef = useRef(null);
  const starsRef = useRef([]);
  const imageRef = useRef(null);

  // Framer Motion controls
  const controls = useAnimation();
  const isInView = useInView(cardRef, { once: true, threshold: 0.2 });

  useEffect(() => {
    if (isInView) {
      // Advanced GSAP Timeline for entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // Card entrance with morphing effect
      tl.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 80,
          rotationX: 45,
          transformOrigin: "bottom center",
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          delay: index * 0.1,
        }
      )
        // Title animation with character splitting effect
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.5"
        )
        // Educator name slide in
        .fromTo(
          educatorRef.current,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        )
        // Stars cascade animation
        .fromTo(
          starsRef.current,
          { opacity: 0, scale: 0, rotation: -180 },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "elastic.out(1, 0.5)",
          },
          "-=0.3"
        );

      // Advanced price counting with morphing numbers
      const coursePrice = course.coursePrice || 0;
      const discount = course.discount || 0;
      const finalPrice = (coursePrice - (discount * coursePrice) / 100).toFixed(
        2
      );

      gsap.fromTo(
        priceRef.current,
        { textContent: 0 },
        {
          textContent: finalPrice,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 0.01 },
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 75%",
          },
          onUpdate: function () {
            // Add pulsing effect during counting
            gsap.to(priceRef.current, {
              scale: 1.1,
              duration: 0.1,
              yoyo: true,
              repeat: 1,
              ease: "power2.inOut",
            });
          },
        }
      );
    }
  }, [course, index, isInView]);

  // Advanced hover animations
  const handleMouseEnter = () => {
    setIsHovered(true);

    // Image parallax zoom with tilt
    gsap.to(imageRef.current, {
      scale: 1.15,
      rotationY: 5,
      rotationX: 2,
      duration: 0.6,
      ease: "power2.out",
    });

    // Title glow effect
    gsap.to(titleRef.current, {
      textShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
      duration: 0.3,
    });

    // Stars sparkle animation
    starsRef.current.forEach((star, i) => {
      gsap.to(star, {
        rotation: 360,
        scale: 1.3,
        duration: 0.8,
        delay: i * 0.05,
        ease: "elastic.out(1, 0.3)",
      });
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    // Reset image
    gsap.to(imageRef.current, {
      scale: 1,
      rotationY: 0,
      rotationX: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });

    // Reset title glow
    gsap.to(titleRef.current, {
      textShadow: "0 0 0px rgba(59, 130, 246, 0)",
      duration: 0.3,
    });

    // Reset stars
    starsRef.current.forEach((star) => {
      gsap.to(star, {
        rotation: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    });
  };

  // Framer Motion variants
  const cardVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
    hover: {
      y: -15,
      boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  const glowVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: isHovered ? 1 : 0,
      scale: isHovered ? 1.1 : 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative rounded-2xl bg-white border border-gray-200 overflow-hidden will-change-transform group w-full max-w-sm mx-auto"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradient overlay for modern look */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none"
        variants={glowVariants}
        initial="initial"
        animate="animate"
      />

      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          boxShadow: isHovered
            ? "inset 0 0 0 1px rgba(59, 130, 246, 0.3)"
            : "inset 0 0 0 1px transparent",
        }}
        transition={{ duration: 0.3 }}
      />

      <Link to={"/course/" + course._id} onClick={() => scrollTo(0, 0)}>
        {/* Enhanced Image Container */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <motion.img
            ref={imageRef}
            src={course.courseThumbnail}
            alt=""
            className="w-full h-36 sm:h-40 md:h-44 lg:h-48 object-cover will-change-transform"
          />

          {/* Image overlay with gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Floating price tag */}
          <motion.div
            className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs sm:text-sm font-semibold"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: index * 0.1 + 0.5,
              type: "spring",
              stiffness: 200,
            }}
          >
            {(course.discount || 0) > 0 && (
              <span className="text-green-600">-{course.discount || 0}%</span>
            )}
          </motion.div>
        </div>

        {/* Enhanced Content */}
        <div className="p-3 sm:p-4 md:p-5 text-left space-y-2 sm:space-y-3">
          {/* Title with advanced typography */}
          <motion.h3
            ref={titleRef}
            className="text-sm sm:text-base md:text-lg font-bold text-gray-900 line-clamp-2 leading-tight"
            whileHover={{
              color: "#3B82F6",
              transition: { duration: 0.2 },
            }}
          >
            {course.courseTitle || "Course Title"}
          </motion.h3>

          {/* Educator with icon */}
          <motion.div
            ref={educatorRef}
            className="flex items-center space-x-2"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {course.educator?.name?.charAt(0) || "T"}
            </div>
            <p className="text-sm sm:text-base text-gray-600 font-medium truncate">
              {course.educator?.name || "Teacher"}
            </p>
          </motion.div>

          {/* Enhanced Rating Section */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            <span className="text-base sm:text-lg font-bold text-yellow-500">
              {calculateRating(course)}
            </span>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <motion.img
                  key={i}
                  ref={(el) => (starsRef.current[i] = el)}
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  src={
                    i < Math.floor(calculateRating(course))
                      ? assets.star
                      : assets.star_blank
                  }
                  alt="star"
                  whileHover={{
                    filter: "drop-shadow(0 0 8px #FCD34D)",
                  }}
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-gray-500">
              {course.courseRatings.length}
            </span>
          </div>

          {/* Enhanced Price Section - Simplified without button */}
          <div className="pt-2 border-t border-gray-100">
            <div className="space-y-1">
              {(course.discount || 0) > 0 && (
                <p className="text-xs sm:text-sm text-gray-400 line-through">
                  {currency}
                  {course.coursePrice || 0}
                </p>
              )}
              <motion.p
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                {currency}
                <span ref={priceRef}>0</span>
              </motion.p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
