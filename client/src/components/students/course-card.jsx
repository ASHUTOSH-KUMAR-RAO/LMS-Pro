import { useContext, useEffect, useRef } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/app-context";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const CourseCard = ({ course, index }) => {
  const { currency } = useContext(AppContext);
  const cardRef = useRef(null);
  const priceRef = useRef(null);

  useEffect(() => {
    // Entrance animation (GSAP only once, no hover conflict)
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: index * 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
        },
      }
    );

    // Price Count-Up (GSAP text only)
    const finalPrice = (
      course.coursePrice -
      (course.discount * course.coursePrice) / 100
    ).toFixed(2);

    gsap.fromTo(
      priceRef.current,
      { textContent: 0 },
      {
        textContent: finalPrice,
        duration: 1,
        ease: "power1.out",
        snap: { textContent: 0.1 },
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
        },
      }
    );
  }, [course, index]);

  return (
    <motion.div
      ref={cardRef}
      className="rounded-xl bg-white border border-gray-200 overflow-hidden will-change-transform will-change-opacity"
      whileHover={{
        scale: 1.05,
        boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 220, damping: 15 }}
    >
      <Link to={"/course/" + course._id} onClick={() => scrollTo(0, 0)}>
        {/* Thumbnail */}
        <motion.div className="overflow-hidden">
          <motion.img
            src={course.courseThumbnail}
            alt=""
            className="w-full h-40 object-cover will-change-transform"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>

        {/* Content */}
        <div className="p-4 text-left space-y-2">
          <h3 className="text-lg font-semibold">{course.courseTitle}</h3>
          <p className="text-gray-500">{course.educator.name}</p>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <p>5</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <motion.img
                  className="w-4 h-4"
                  key={i}
                  src={assets.star}
                  alt="star"
                  whileHover={{
                    scale: 1.2,
                    rotate: 10,
                  }}
                  transition={{ type: "spring", stiffness: 300, delay: i * 0.05 }}
                />
              ))}
            </div>
            <p className="text-gray-500">22</p>
          </div>

          {/* Price */}
          <p className="text-lg font-semibold text-gray-800">
            {currency}
            <span ref={priceRef}></span>
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
