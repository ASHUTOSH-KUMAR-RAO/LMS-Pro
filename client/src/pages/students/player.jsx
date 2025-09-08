import { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../../context/app-context";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Youtube from "react-youtube";
import Footer from "../../components/students/footer";
import Rating from "../../components/students/rating";

const Player = () => {
  const { enrolledCourses, calculateChapterTime } = useContext(AppContext);
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const sectionsRef = useRef([]);
  const containerRef = useRef();
  const headerRef = useRef();
  const playerRef = useRef();

  // Enhanced loading animation
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          y: 50,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }
  }, [courseData]);

  const getCourseData = () => {
    setIsLoading(true);

    const actualCourseId = courseId.startsWith("courseId")
      ? courseId.replace("courseId", "")
      : courseId;

    const foundCourse = enrolledCourses.find(
      (course) => course._id === actualCourseId
    );

    if (foundCourse) {
      setCourseData(foundCourse);
      // Animate course load
      gsap.to(".course-content", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
      });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (
      enrolledCourses &&
      enrolledCourses.length > 0 &&
      courseId &&
      enrolledCourses.some((course) => course._id || course.id)
    ) {
      getCourseData();
    }
  }, [enrolledCourses, courseId]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));

    // Enhanced accordion animation
    const section = sectionsRef.current[index];
    if (section) {
      const content = section.querySelector(".section-content");
      const arrow = section.querySelector(".arrow-icon");

      if (content && arrow) {
        if (openSections[index]) {
          // Closing animation
          gsap.to(content, {
            height: 0,
            opacity: 0,
            duration: 0.5,
            ease: "power3.inOut",
          });
          gsap.to(arrow, {
            rotation: 0,
            duration: 0.3,
            ease: "back.inOut(1.7)",
          });
        } else {
          // Opening animation
          gsap.set(content, { height: "auto" });
          const height = content.offsetHeight;
          gsap.fromTo(
            content,
            { height: 0, opacity: 0 },
            {
              height: height,
              opacity: 1,
              duration: 0.6,
              ease: "power3.out",
              onComplete: () => {
                // Animate individual lecture items
                const lectureItems = content.querySelectorAll(".lecture-item");
                gsap.fromTo(
                  lectureItems,
                  { x: -30, opacity: 0 },
                  {
                    x: 0,
                    opacity: 1,
                    duration: 0.4,
                    stagger: 0.08,
                    ease: "power2.out",
                  }
                );
              },
            }
          );
          gsap.to(arrow, {
            rotation: 180,
            duration: 0.4,
            ease: "back.out(1.7)",
          });
        }
      }
    }
  };

  // Enhanced player selection animation
  const handlePlayerSelection = (lecture, chapterIndex, lectureIndex) => {
    // First, animate out current player if exists
    if (playerRef.current) {
      gsap.to(playerRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setPlayerData({
            ...lecture,
            chapter: chapterIndex + 1,
            lecture: lectureIndex + 1,
          });

          // Then animate in new player
          gsap.fromTo(
            playerRef.current,
            { scale: 0.8, opacity: 0, rotationY: 90 },
            {
              scale: 1,
              opacity: 1,
              rotationY: 0,
              duration: 0.6,
              ease: "back.out(1.7)",
            }
          );
        },
      });
    } else {
      setPlayerData({
        ...lecture,
        chapter: chapterIndex + 1,
        lecture: lectureIndex + 1,
      });
    }
  };

  // Loading component with modern animation
  if (isLoading || !courseData) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            className="text-gray-600 text-lg font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading your amazing course...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        ref={containerRef}
        className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Left Column - Course Structure */}
        <motion.div
          className="text-gray-800 course-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.h2
            ref={headerRef}
            className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Course Structure
          </motion.h2>

          <div className="space-y-4">
            {courseData.courseContent?.map((chapter, index) => (
              <motion.div
                key={index}
                ref={(el) => (sectionsRef.current[index] = el)}
                className="bg-white/90 backdrop-blur-lg rounded-3xl overflow-hidden shadow-xl border border-white/60 hover:shadow-2xl transition-all duration-500 course-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.6 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                  borderColor: "rgba(59, 130, 246, 0.3)",
                }}
              >
                <motion.div
                  className="flex items-center justify-between px-8 py-6 cursor-pointer select-none bg-gradient-to-r from-transparent via-blue-50/30 to-purple-50/30 hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300"
                  onClick={() => toggleSection(index)}
                  whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <motion.img
                      className="w-6 h-6 arrow-icon"
                      src={assets.down_arrow_icon}
                      alt="arrow"
                      whileHover={{ scale: 1.2 }}
                    />
                    <p className="font-bold text-gray-800 text-lg">
                      {chapter.chapterTitle}
                    </p>
                  </div>
                  <motion.div
                    className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-bold shadow-lg"
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 10px 20px rgba(59, 130, 246, 0.3)",
                    }}
                  >
                    {chapter.chapterContent?.length || 0} lectures •{" "}
                    {calculateChapterTime(chapter)}
                  </motion.div>
                </motion.div>

                <AnimatePresence>
                  {openSections[index] && (
                    <motion.div
                      className="section-content overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      <div className="px-8 py-6 border-t border-gradient-to-r from-gray-200/50 to-blue-200/50 bg-gradient-to-br from-gray-50/80 via-white/50 to-blue-50/80">
                        {chapter.chapterContent?.map((lecture, i) => (
                          <motion.div
                            key={i}
                            className="lecture-item flex items-center justify-between py-4 hover:bg-white/80 rounded-xl px-4 transition-all duration-300 group"
                            whileHover={{
                              scale: 1.02,
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                              boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                            }}
                          >
                            <div className="flex items-center gap-4">
                              <motion.img
                                src={assets.play_icon}
                                alt="play"
                                className="w-5 h-5"
                                whileHover={{
                                  scale: 1.3,
                                  rotate: 360,
                                  filter:
                                    "drop-shadow(0 4px 8px rgba(59, 130, 246, 0.4))",
                                }}
                                transition={{ duration: 0.4 }}
                              />
                              <p className="text-gray-700 font-semibold group-hover:text-blue-600 transition-colors">
                                {lecture.lectureTitle}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              {lecture.lectureUrl && (
                                <motion.button
                                  onClick={() =>
                                    handlePlayerSelection(lecture, index, i)
                                  }
                                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                                  whileHover={{
                                    scale: 1.05,
                                    boxShadow:
                                      "0 12px 24px rgba(34, 197, 94, 0.4)",
                                  }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Watch Now
                                </motion.button>
                              )}
                              <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                                {humanizeDuration(
                                  (lecture.lectureDuration || 0) * 60 * 1000,
                                  { units: ["h", "m"] }
                                )}
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

          {/* Rating Section with enhanced styling */}
          <motion.div
            className="flex items-center gap-4 py-6 mt-12 bg-white/80 backdrop-blur-lg rounded-2xl px-8 shadow-xl border border-white/60"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          >
            <motion.h1
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              Rate This Course
            </motion.h1>
            <Rating initialRating={0} />
          </motion.div>
        </motion.div>

        {/* Right Column - Video Player */}
        <motion.div
          className="md:mt-10"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {playerData ? (
            <motion.div
              ref={playerRef}
              className="bg-white/90 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-white/60"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "back.out(1.7)" }}
            >
              <div className="relative">
                <Youtube
                  videoId={playerData.lectureUrl.split("/").pop()}
                  iframeClassName="w-full aspect-video rounded-t-3xl"
                />
                <motion.div
                  className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Chapter {playerData.chapter}.{playerData.lecture}
                </motion.div>
              </div>
              <div className="flex justify-between items-center p-6 bg-gradient-to-r from-white/90 to-blue-50/90">
                <motion.p
                  className="font-bold text-gray-800 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {playerData.lectureTitle}
                </motion.p>
                <motion.button
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 12px 24px rgba(59, 130, 246, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {false ? "Completed ✓" : "Mark Complete"}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="relative rounded-3xl overflow-hidden shadow-2xl group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={courseData?.courseThumbnail || ""}
                alt="Course Thumbnail"
                className="w-full h-auto rounded-3xl"
              />
              <motion.div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              <motion.div
                className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ y: 20 }}
                whileHover={{ y: 0 }}
              >
                <p className="text-xl font-bold mb-2">Start Learning!</p>
                <p className="text-sm opacity-90">
                  Select a lecture to begin your journey
                </p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      <Footer />
    </>
  );
};

export default Player;
