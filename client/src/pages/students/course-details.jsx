import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/app-context";
import Loading from "../../components/students/loading";
import { assets } from "../../assets/assets";
import { motion } from "framer-motion";
import gsap from "gsap";

const CourseDetails = ({ course }) => {
  const starsRef = useRef([]);
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);

  const { allCourses, calculateRating } = useContext(AppContext);

  const fetchCourseData = async () => {
    const findCourse = allCourses.find((course) => course._id === id);
    setCourseData(findCourse);
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

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

          <p className="text-sm font-bold">
            Course Buy
            <span className="text-[lightSeaGreen] font-semibold text-base animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] underline">
              Termi-Evolution
            </span>
          </p>
          <p
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 500),
            }}
            className="pt-4 md:text-base text-sm"
          ></p>
        </div>

        {/* Right Column */}
        <div></div>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
