import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : "");
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const searchRef = useRef(null);
  const btnRef = useRef(null);
  const suggestionRef = useRef(null);
  const underlineRef = useRef(null);

  const onSearchHandel = (e) => {
    e.preventDefault();
    navigate("/course-list/" + input);
  };

  const popularSearches = [
    "Web Development",
    "Data Science",
    "UI/UX Design",
    "Digital Marketing",
    "Machine Learning",
  ];

  // Initial animation
  useEffect(() => {
    gsap.fromTo(
      searchRef.current,
      { y: 60, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 1, ease: "elastic.out(1,0.6)" }
    );
  }, []);

  // Focus glow
  useEffect(() => {
    if (isFocused) {
      gsap.to(searchRef.current, {
        boxShadow: "0 0 30px rgba(6,182,212,0.6)",
        borderColor: "#06b6d4",
        duration: 0.4,
      });
    } else {
      gsap.to(searchRef.current, {
        boxShadow: "0 0 15px rgba(0,0,0,0.15)",
        borderColor: "transparent",
        duration: 0.4,
      });
    }
  }, [isFocused]);

  // Suggestions stagger
  useEffect(() => {
    if (isFocused && !input && suggestionRef.current) {
      gsap.fromTo(
        suggestionRef.current.children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          ease: "back.out(1.7)",
          duration: 0.5,
        }
      );
    }
  }, [isFocused, input]);

  // Typing underline effect
  useEffect(() => {
    if (underlineRef.current) {
      gsap.to(underlineRef.current, {
        scaleX: input.length > 0 ? 1 : 0,
        transformOrigin: "left center",
        duration: 0.3,
        ease: "power3.out",
      });
    }
  }, [input]);

  // Magnetic button
  const handleMouseMove = (e) => {
    if (btnRef.current) {
      const { left, top, width, height } =
        btnRef.current.getBoundingClientRect();
      const x = e.clientX - (left + width / 2);
      const y = e.clientY - (top + height / 2);
      gsap.to(btnRef.current, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
      });
    }
  };
  const handleMouseLeave = () => {
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.3 });
  };

  return (
    <div className="relative w-full max-w-2xl">
      <motion.form
        ref={searchRef}
        onSubmit={onSearchHandel}
        className="relative max-w-xl w-full md:h-16 h-14 flex items-center bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-2xl shadow-xl overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Search Icon */}
        <motion.div
          className="relative z-10 px-4"
          animate={{
            rotate: isFocused ? 360 : 0,
            scale: isFocused ? 1.2 : 1,
          }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={assets.search_icon}
            alt="search_icon"
            className="md:w-6 w-5 opacity-60"
          />
        </motion.div>

        {/* Input */}
        <div className="relative w-full h-full flex flex-col justify-center">
          <input
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={input}
            type="text"
            placeholder="Search for amazing courses..."
            className="relative z-10 w-full h-full outline-none text-gray-700 bg-transparent placeholder-gray-500 font-medium"
          />
          {/* Underline */}
          <span
            ref={underlineRef}
            className="absolute bottom-1 left-0 h-[2px] w-full bg-gradient-to-r from-cyan-500 to-blue-600 scale-x-0"
          />
        </div>

        {/* Button */}
        <motion.button
          ref={btnRef}
          type="submit"
          className="relative z-10 bg-gradient-to-r from-cyan-500 to-blue-600 text-white md:px-8 px-6 md:py-4 py-3 mx-2 rounded-xl font-semibold cursor-pointer overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileTap={{ scale: 0.9 }}
        >
          <span className="relative z-10">Search</span>
        </motion.button>

        {/* Suggestions */}
        <AnimatePresence>
          {isFocused && !input && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 p-4 z-50"
            >
              <p className="text-sm text-gray-500 mb-3 font-medium">
                Popular Searches:
              </p>
              <div ref={suggestionRef} className="flex flex-wrap gap-2">
                {popularSearches.map((search) => (
                  <motion.span
                    key={search}
                    className="px-3 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-full text-sm cursor-pointer"
                    onClick={() => setInput(search)}
                    whileHover={{
                      scale: 1.1,
                      rotate: 3,
                      boxShadow: "0 5px 15px rgba(6,182,212,0.3)",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {search}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  );
};

export default SearchBar;
