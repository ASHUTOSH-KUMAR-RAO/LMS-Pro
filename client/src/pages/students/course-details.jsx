import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/app-context";
import Loading from "../../components/students/loading";
import { assets } from "../../assets/assets";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Footer from "../../components/students/footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import humanizeDuration from "humanize-duration";
import Youtube from "react-youtube";

gsap.registerPlugin(ScrollTrigger);

const CourseDetails = ({ course }) => {
  const starsRef = useRef([]);
  const heroRef = useRef(null);
  const cardRef = useRef(null);
  const sectionsRef = useRef([]);
  const floatingElementsRef = useRef([]);
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState('structure');

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const {
    allCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLecture,
    currency,
  } = useContext(AppContext);

  const fetchCourseData = async () => {
    const findCourse = allCourses.find((course) => course._id === id);
    setCourseData(findCourse);
  };

  useEffect(() => {
    fetchCourseData();
  }, [id, allCourses]);

  // Advanced GSAP animations
  useEffect(() => {
    if (courseData && heroRef.current && cardRef.current) {
      // Hero section entrance animation
      const tl = gsap.timeline();
      
      tl.fromTo(heroRef.current.querySelector('.hero-content'),
        { opacity: 0, y: 100, rotationX: 90 },
        { opacity: 1, y: 0, rotationX: 0, duration: 1.2, ease: "power3.out" }
      )
      .fromTo(cardRef.current,
        { opacity: 0, x: 100, rotationY: -45, scale: 0.8 },
        { opacity: 1, x: 0, rotationY: 0, scale: 1, duration: 1, ease: "power3.out" },
        "-=0.8"
      );

      // Floating elements animation
      floatingElementsRef.current.forEach((el, i) => {
        if (el) {
          gsap.to(el, {
            y: "random(-20, 20)",
            x: "random(-10, 10)",
            rotation: "random(-15, 15)",
            duration: "random(2, 4)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.2
          });
        }
      });

      // Course sections scroll-triggered animations
      sectionsRef.current.forEach((section, i) => {
        if (section) {
          gsap.fromTo(section,
            { opacity: 0, y: 50, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });

      // Parallax effect for background
      gsap.to(".parallax-bg", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }, [courseData]);

  // Enhanced star animations
  useEffect(() => {
    if (courseData && starsRef.current.length > 0) {
      // Cascade entrance with magnetic effect
      gsap.fromTo(
        starsRef.current,
        { 
          opacity: 0, 
          scale: 0, 
          rotation: -360,
          transformOrigin: "center center"
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1.2,
          stagger: {
            each: 0.15,
            from: "random"
          },
          ease: "elastic.out(1.2, 0.3)",
        }
      );
    }
  }, [courseData]);

  const handleStarHover = (index) => {
    // Advanced star hover with ripple effect
    gsap.timeline()
      .to(starsRef.current[index], {
        rotation: 720,
        scale: 1.4,
        duration: 0.6,
        ease: "power2.out",
      })
      .to(starsRef.current[index], {
        boxShadow: "0 0 20px #FCD34D, 0 0 40px #FCD34D, 0 0 60px #FCD34D",
        duration: 0.3,
      }, "-=0.3");
  };

  const handleStarLeave = (index) => {
    gsap.to(starsRef.current[index], {
      rotation: 0,
      scale: 1,
      boxShadow: "none",
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
    
    // Animate section toggle with smooth accordion effect
    const section = sectionsRef.current[index];
    if (section) {
      const content = section.querySelector('.section-content');
      if (openSections[index]) {
        gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut"
        });
      } else {
        gsap.set(content, { height: 'auto' });
        const height = content.offsetHeight;
        gsap.fromTo(content, 
          { height: 0, opacity: 0 },
          { height: height, opacity: 1, duration: 0.4, ease: "power2.inOut" }
        );
      }
    }
  };

  const handlePreviewClick = (lectureUrl) => {
    setPlayerData({
      videoId: lectureUrl.split("/").pop(),
    });
    
    // Smooth transition animation for video player
    gsap.fromTo(".video-container",
      { scale: 0.8, opacity: 0, rotationY: 45 },
      { scale: 1, opacity: 1, rotationY: 0, duration: 0.8, ease: "power3.out" }
    );
  };

  const handleEnrollHover = () => {
    gsap.to(".enroll-btn", {
      scale: 1.05,
      boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleEnrollLeave = () => {
    gsap.to(".enroll-btn", {
      scale: 1,
      boxShadow: "0 10px 25px rgba(59, 130, 246, 0.2)",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  // Floating elements for background decoration
  const floatingElements = Array.from({ length: 8 }, (_, i) => (
    <div
      key={i}
      ref={el => floatingElementsRef.current[i] = el}
      className={`absolute w-${4 + (i % 3) * 2} h-${4 + (i % 3) * 2} 
        ${i % 2 === 0 ? 'bg-blue-200/20' : 'bg-purple-200/20'} 
        rounded-full blur-sm`}
      style={{
        left: `${10 + (i * 12)}%`,
        top: `${20 + (i * 8)}%`,
        zIndex: -1
      }}
    />
  ));

  return courseData ? (
    <>
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Floating Background Elements */}
        {floatingElements}
        
        {/* Parallax Background */}
        <motion.div 
          className="parallax-bg absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30"
          style={{ y: backgroundY }}
        />

        <div ref={heroRef} className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20">
          
          {/* Left Column - Enhanced */}
          <motion.div 
            className="hero-content max-w-xl z-10 text-gray-500"
            style={{ y: textY }}
          >
            <motion.h1 
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mb-4 text-5xl md:text-6xl leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              {courseData.courseTitle}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative p-6 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 mb-8"
            >
              <motion.p
                dangerouslySetInnerHTML={{
                  __html: courseData.courseDescription.slice(0, 400) + "...",
                }}
                className="text-gray-700 leading-relaxed text-base"
                whileHover={{ scale: 1.01 }}
              />
              <motion.div 
                className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Read more indicator */}
              <motion.div 
                className="mt-3 text-sm text-blue-600 font-medium cursor-pointer flex items-center gap-1"
                whileHover={{ x: 5 }}
              >
                <span>Continue reading below</span>
                <motion.span 
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ↓
                </motion.span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center flex-wrap gap-4 mb-8 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/50"
            >
              <motion.span
                className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                {calculateRating(courseData)} ★
              </motion.span>

              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <motion.img
                    key={i}
                    ref={(el) => (starsRef.current[i] = el)}
                    className="w-6 h-6 cursor-pointer filter drop-shadow-md"
                    src={
                      i < Math.floor(calculateRating(courseData))
                        ? assets.star
                        : assets.star_blank
                    }
                    alt="star"
                    onMouseEnter={() => handleStarHover(i)}
                    onMouseLeave={() => handleStarLeave(i)}
                    whileHover={{
                      filter: "drop-shadow(0 0 12px #FCD34D) brightness(1.2)",
                    }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>

              <motion.div 
                className="flex items-center gap-4 text-sm font-medium"
                whileHover={{ scale: 1.05 }}
              >
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {courseData.courseRatings.length} reviews
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  {courseData.enrolledStudents.length} students
                </span>
              </motion.div>
            </motion.div>

            {/* Course Structure Section - Always Visible */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-3xl">📚</span>
                Course Structure
              </h2>
              
              <div className="space-y-3">
                {courseData.courseContent.map((chapter, index) => (
                  <motion.div
                    key={index}
                    ref={el => sectionsRef.current[index] = el}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                    }}
                  >
                    <motion.div
                      className="flex items-center justify-between px-6 py-4 cursor-pointer select-none bg-gradient-to-r from-transparent to-blue-50/50"
                      onClick={() => toggleSection(index)}
                      whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.img
                          className="w-5 h-5"
                          src={assets.down_arrow_icon}
                          alt="arrow"
                          animate={{ 
                            rotate: openSections[index] ? 180 : 0 
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        />
                        <p className="font-semibold text-gray-800">
                          {chapter.chapterTitle}
                        </p>
                      </div>
                      <motion.div 
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                        whileHover={{ scale: 1.1 }}
                      >
                        {chapter.chapterContent.length} lectures • {calculateChapterTime(chapter)}
                      </motion.div>
                    </motion.div>
                    
                    <AnimatePresence>
                      {openSections[index] && (
                        <motion.div
                          className="section-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                          <div className="px-6 py-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-transparent">
                            {chapter.chapterContent.map((lecture, i) => (
                              <motion.div
                                key={i}
                                className="flex items-center justify-between py-3 hover:bg-white/50 rounded-lg px-3 transition-all duration-200"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                              >
                                <div className="flex items-center gap-3">
                                  <motion.img
                                    src={assets.play_icon}
                                    alt="play"
                                    className="w-4 h-4"
                                    whileHover={{ scale: 1.2, rotate: 360 }}
                                    transition={{ duration: 0.3 }}
                                  />
                                  <p className="text-gray-700 font-medium">{lecture.lectureTitle}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  {lecture.isPreviewFree && (
                                    <motion.button
                                      onClick={() => handlePreviewClick(lecture.lectureUrl)}
                                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      Preview
                                    </motion.button>
                                  )}
                                  <span className="text-sm text-gray-500 font-medium">
                                    {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"] })}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Course Description Section - Always Visible */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                <span className="text-3xl">📝</span> 
                Course Description
              </h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: courseData.courseDescription,
                }}
                className="prose prose-blue max-w-none text-gray-700 leading-relaxed"
              />
            </motion.div>
          </motion.div>

          {/* Right Column - Enhanced Sticky Card */}
          <motion.div 
            ref={cardRef}
            className="sticky top-20 max-w-[420px] z-10 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-xl min-w-[300px] sm:min-w-[420px] shadow-2xl border border-white/50"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ 
              y: -10,
              boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Video Player with Enhanced Animation */}
            <div className="video-container relative overflow-hidden">
              {playerData ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Youtube
                    videoId={playerData.videoId}
                    opts={{ playerVars: { autoplay: 1 } }}
                    iframeClassName="w-full aspect-video"
                  />
                </motion.div>
              ) : (
                <motion.div 
                  className="relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={courseData.courseThumbnail} 
                    alt="Course Thumbnail"
                    className="w-full aspect-video object-cover transition-all duration-500 group-hover:brightness-110"
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </motion.div>
              )}
            </div>

            <div className="p-6">
              {/* Price Timer with Pulsing Effect */}
              <motion.div 
                className="flex items-center gap-2 mb-4 p-3 bg-red-50 rounded-xl border border-red-100"
                animate={{ 
                  boxShadow: isHovered ? "0 0 20px rgba(239, 68, 68, 0.2)" : "none"
                }}
              >
                <motion.img
                  className="w-4 h-4"
                  src={assets.time_left_clock_icon}
                  alt="timer"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-red-600 font-semibold">
                  <motion.span 
                    className="font-bold"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    5 days
                  </motion.span> left at this price!
                </p>
              </motion.div>

              {/* Enhanced Price Section */}
              <motion.div 
                className="flex gap-3 items-center mb-6"
                whileHover={{ scale: 1.02 }}
              >
                <motion.p 
                  className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0%", "100%", "0%"]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                >
                  {currency}
                  {(courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(3)}
                </motion.p>
                <p className="text-xl text-gray-500 line-through">
                  {currency}{courseData.coursePrice}
                </p>
                <motion.span 
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold"
                  whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
                >
                  {courseData.discount}% OFF
                </motion.span>
              </motion.div>

              {/* Stats with Hover Effects */}
              <motion.div 
                className="flex items-center justify-between text-sm gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
                whileHover={{ scale: 1.02 }}
              >
                {[
                  { icon: assets.star, text: calculateRating(courseData), color: "text-yellow-600" },
                  { icon: assets.time_clock_icon, text: calculateCourseDuration(courseData), color: "text-blue-600" },
                  { icon: assets.lesson_icon, text: `${calculateNoOfLecture(courseData)} lessons`, color: "text-purple-600" }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-2"
                    whileHover={{ 
                      scale: 1.1,
                      y: -2
                    }}
                  >
                    <motion.img 
                      src={stat.icon} 
                      alt="icon" 
                      className="w-4 h-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    />
                    <p className={`font-semibold ${stat.color}`}>{stat.text}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Enhanced Enroll Button */}
              <motion.button 
                className="enroll-btn w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-lg border-0 cursor-pointer relative overflow-hidden"
                onMouseEnter={handleEnrollHover}
                onMouseLeave={handleEnrollLeave}
                whileHover={{ 
                  backgroundPosition: "right center",
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
                style={{
                  backgroundSize: "200% auto",
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">
                  {isAlreadyEnrolled ? "✨ Already Enrolled" : "🚀 Enroll Now"}
                </span>
              </motion.button>

              {/* Enhanced Features List */}
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">✨</span> What's Included
                </h4>
                <div className="space-y-3">
                  {[
                    { icon: "♾️", text: "Lifetime access with free updates" },
                    { icon: "🎯", text: "Step-by-step, Hand's-on Project Guidance" },
                    { icon: "📚", text: "Easy to Download Resources and Code" },
                    { icon: "🏆", text: "Certificate of Completion" }
                  ].map((feature, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                      whileHover={{ 
                        x: 10,
                        backgroundColor: "rgba(59, 130, 246, 0.05)"
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + (index * 0.1), duration: 0.4 }}
                    >
                      <span className="text-xl">{feature.icon}</span>
                      <p className="text-gray-700 font-medium">{feature.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;