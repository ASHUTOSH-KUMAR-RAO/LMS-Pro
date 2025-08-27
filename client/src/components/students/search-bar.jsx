import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : "");
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const onSearchHandel = (e) => {
    e.preventDefault();
    navigate("/course-list/" + input);
  };

  // Popular searches for suggestion animation
  const popularSearches = [
    "Web Development",
    "Data Science", 
    "UI/UX Design",
    "Digital Marketing",
    "Machine Learning"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="relative w-full max-w-2xl"
    >
      <motion.form
        onSubmit={onSearchHandel}
        className="relative max-w-xl w-full md:h-16 h-14 flex items-center bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-2xl shadow-xl overflow-hidden"
        animate={{
          borderColor: isFocused ? "#06b6d4" : "transparent",
          scale: isFocused ? 1.02 : 1,
          boxShadow: isFocused 
            ? "0 20px 40px rgba(6, 182, 212, 0.3)" 
            : "0 10px 30px rgba(0, 0, 0, 0.1)"
        }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20"
          animate={{
            opacity: isFocused || isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Search Icon with Animation */}
        <motion.div
          className="relative z-10 px-4"
          animate={{
            rotate: isFocused ? 360 : 0,
            scale: isFocused ? 1.1 : 1
          }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={assets.search_icon}
            alt="search_icon"
            className="md:w-6 w-5 opacity-60"
          />
        </motion.div>

        {/* Input Field */}
        <input
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={input}
          type="text"
          placeholder="Search for amazing courses..."
          className="relative z-10 w-full h-full outline-none text-gray-700 bg-transparent placeholder-gray-500 font-medium"
        />

        {/* Animated Submit Button */}
        <motion.button
          type="submit"
          className="relative z-10 bg-gradient-to-r from-cyan-500 to-blue-600 text-white md:px-8 px-6 md:py-4 py-3 mx-2 rounded-xl font-semibold cursor-pointer overflow-hidden"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(6, 182, 212, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {/* Button Background Animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ x: "-100%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3 }}
          />
          <span className="relative z-10">Search</span>
        </motion.button>

        {/* Floating Search Suggestions */}
        <AnimatePresence>
          {isFocused && !input && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 p-4 z-50"
            >
              <p className="text-sm text-gray-500 mb-3 font-medium">Popular Searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <motion.span
                    key={search}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-3 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-full text-sm cursor-pointer hover:from-cyan-200 hover:to-blue-200 transition-all duration-200"
                    onClick={() => setInput(search)}
                    whileHover={{ scale: 1.05 }}
                  >
                    {search}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </motion.div>
  );
};

export default SearchBar;