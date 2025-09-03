import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/app-context";
import Loading from "../../components/students/loading";
import { assets } from "../../assets/assets";
import { motion } from "framer-motion";
import Footer from "../../components/students/footer";
import gsap from "gsap";
import humanizeDuration from "humanize-duration";
import Youtube from "react-youtube";

const CourseDetails = ({ course }) => {
  const starsRef = useRef([]);
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

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
  }, []);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Stars animation effect (same as CourseCard)
  useEffect(() => {
    if (courseData) {
      // Stars cascade animation
      gsap.fromTo(
        starsRef.current,
        { opacity: 0, scale: 0, rotation: -180 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "elastic.out(1, 0.5)",
        }
      );
    }
  }, [courseData]);

  const handleStarHover = (index) => {
    // Stars sparkle animation on hover
    gsap.to(starsRef.current[index], {
      rotation: 360,
      scale: 1.3,
      duration: 0.8,
      ease: "elastic.out(1, 0.3)",
    });
  };

  const handleStarLeave = (index) => {
    // Reset stars
    gsap.to(starsRef.current[index], {
      rotation: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return courseData ? (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left">
        <div className="absolute top-0 left-0 w-full h-[500px] -z-1 bg-gradient-to-b from bg-cyan-100/70"></div>

        {/* Left Column */}
        <div className="max-w-xl z-10 text-gray-500">
          <h1 className="font-semibold text-gray-800 underline mb-2 hover:font-bold animate-bounce text-4xl">
            {courseData.courseTitle}
          </h1>

          <p
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 500),
            }}
            className="pt-4 md:text-base text-sm mb-6"
          ></p>

          <p className="text-sm font-bold mb-6">
            Course Buy
            <span className="text-[lightSeaGreen] font-semibold text-base animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] underline">
              Termi-Evolution
            </span>
          </p>

          {/* Reviews and Rating Section */}
          <div className="flex items-center flex-wrap gap-3 mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-200">
            <motion.span
              className="text-2xl font-bold text-yellow-500"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {calculateRating(courseData)}
            </motion.span>

            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <motion.img
                  key={i}
                  ref={(el) => (starsRef.current[i] = el)}
                  className="w-5 h-5 cursor-pointer"
                  src={
                    i < Math.floor(calculateRating(courseData))
                      ? assets.star
                      : assets.star_blank
                  }
                  alt="star"
                  onMouseEnter={() => handleStarHover(i)}
                  onMouseLeave={() => handleStarLeave(i)}
                  whileHover={{
                    filter: "drop-shadow(0 0 8px #FCD34D)",
                  }}
                />
              ))}
            </div>

            <motion.span
              className="text-sm text-gray-600 font-medium"
              whileHover={{ color: "#3B82F6" }}
            >
              ({courseData.courseRatings.length}{" "}
              {courseData.courseRatings.length === 1 ? "review" : "reviews"})
            </motion.span>
            <p>
              {courseData.enrolledStudents.length}{" "}
              {courseData.enrolledStudents.length > 1 ? " Students" : "Student"}
            </p>
          </div>
          <div className="pt-8 text-gray-800">
            <h1 className="text-xl font-semibold">Course Structure</h1>
            <div className="pt-5">
              {courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-800 bg-white mb-2 rounded"
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        className={`transform transition-transform${
                          openSections[index] ? "rotate-180" : ""
                        }`}
                        src={assets.down_arrow_icon}
                        alt="arrow_icon"
                      />
                      <p className="font-medium md:text-base text-sm">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-sm md:text-default">
                      {chapter.chapterContent.length}-lectures{" "}
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openSections[index] ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-1">
                          <img
                            src={assets.play_icon}
                            alt="play-icon"
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-base">
                            <p>{lecture.lectureTitle}</p>
                          </div>
                          <div className="flex gap-2">
                            {lecture.isPreviewFree && (
                              <p
                                onClick={setPlayerData({
                                  videoId: lecture.lectureUrl.split("/").pop(),
                                })}
                                className="text-[lightSeaGreen] cursor-pointer"
                              >
                                Preview
                              </p>
                            )}
                            <p>
                              {humanizeDuration(
                                lecture.lectureDuration * 60 * 1000,
                                { units: ["h", "m"] }
                              )}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="py-20 text-sm md:text-base">
            <h3 className="text-xl font-semibold text-gray-800">
              Course Description
            </h3>
            <p
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription,
              }}
              className="pt-4 md:text-base text-sm mb-6"
            ></p>
          </div>
        </div>

        {/* Right Column */}
        <div className="max-w-[420px] z-10 rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px] shadow-amber-100">
          {/* How to Integrate Youtube Video in React That's Very Very Important */}
          {playerData ? (
            <Youtube
              videoId={playerData.videoId}
              opts={{ playerVars: { autoplay: 1 } }}
              iframeClassName=" w-full aspect-video"
            />
          ) : (
            <img src={courseData.courseThumbnail} alt="" />
          )}
          <div className="p-5">
            <div className="flex items-center gap-2">
              <img
                className="w-3.5"
                src={assets.time_left_clock_icon}
                alt="time_left_clock_icon"
              />
              <p className="text-red-500">
                {" "}
                <span className="font-medium">5 days</span> left at this price
              </p>
            </div>
            <div className="flex gap-3 items-center pt-2">
              <p className="text-gray-800 md:text-3xl text-2xl font-semibold">
                {currency}
                {(
                  courseData.coursePrice -
                  (courseData.discount * courseData.coursePrice) / 100
                ).toFixed(3)}
              </p>
              <p className="md:text-lg text-gray-500 line-through">
                {currency}
                {courseData.coursePrice}
              </p>
              <p className="text-gray-500 md:text-lg">
                {courseData.discount}% off
              </p>
            </div>
            <div className="flex items-center text-sm md:text-base gap-4 pt-2 md:pt-4 text-gray-500">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="star" />
                <p>{calculateRating(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-500/40"></div>
              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="time_clock_icon" />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-500/40"></div>
              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="lesson_icon" />
                <p>{calculateNoOfLecture(courseData)} lessons</p>
              </div>
            </div>
            <button className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white cursor-pointer font-semibold">
              {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
            </button>

            <div className="pt-6">
              <p className="md:text-xl text-lg font-medium text-gray-800">
                What's in the Course
              </p>
              <ul className="ml-4 pt-2 text-sm md:text-base list-disc">
                <li>Lifetime access with free updates</li>
                <li>Step-by-step,Hand's Project Guidence</li>
                <li>Easy to Download Resource and as well as Code</li>
                <li>Certificate of Completion </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;

// React ka ek prop hai jo HTML content ko directly DOM mein inject karta hai, bina React ke virtual DOM processing ke through gaye.
