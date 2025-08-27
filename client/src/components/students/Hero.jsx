import React, { useState } from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";
import SearchBar from "./search-bar";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  // Floating animation variants
  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-8 text-center bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 min-h-screen overflow-hidden">
      
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-cyan-300/30 to-blue-300/30 rounded-full blur-xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-40 right-10 w-32 h-32 bg-gradient-to-r from-purple-300/30 to-pink-300/30 rounded-full blur-xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1.2, 1, 1.2]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main Content Container */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="relative z-10 flex flex-col items-center space-y-8"
      >
        
        {/* Main Heading with Enhanced Animation */}
        <motion.div
          variants={textVariants}
          className="relative"
        >
          <motion.h1 
            className="md:text-6xl text-3xl font-bold text-gray-800 max-w-4xl mx-auto leading-tight"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            Ready to{" "}
            <motion.span
              className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Transform
            </motion.span>{" "}
            Your Future?{" "}
            <br className="md:hidden" />
            Discover Courses{" "}
            <motion.span
              className="relative text-cyan-500"
              whileHover={{
                scale: 1.05,
                textShadow: "0 0 20px rgba(6, 182, 212, 0.5)"
              }}
            >
              Built Just for You
              {/* Animated underline */}
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
              />
            </motion.span>
            
            {/* Floating sketch with animation */}
            <motion.img
              src={assets.sketch}
              alt="sketch"
              className="md:block hidden absolute -bottom-7 right-0"
              variants={floatingVariants}
              animate="animate"
              whileHover={{ rotate: 15, scale: 1.1 }}
            />
          </motion.h1>
        </motion.div>

        {/* Description Paragraphs with Stagger Animation */}
        <motion.div
          variants={textVariants}
          className="space-y-4"
        >
          {/* Desktop Description */}
          <motion.p 
            className="md:block text-xl hidden text-gray-600 max-w-3xl mx-auto leading-relaxed"
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <motion.span
              className="inline-block"
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ duration: 0.3 }}
            >
              🎯
            </motion.span>{" "}
            We create the ultimate learning ecosystem: renowned experts{" "}
            <motion.span
              className="inline-block"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3 }}
            >
              👨‍🏫
            </motion.span>
            , innovative content{" "}
            <motion.span
              className="inline-block"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3 }}
            >
              💡
            </motion.span>
            , and meaningful connections{" "}
            <motion.span
              className="inline-block"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3 }}
            >
              🤝
            </motion.span>{" "}
            that drive real results.{" "}
            <motion.span
              className="inline-block"
              whileHover={{ scale: 1.2, rotate: 15 }}
              transition={{ duration: 0.3 }}
            >
              🚀
            </motion.span>
          </motion.p>

          {/* Mobile Description */}
          <motion.p 
            className="md:hidden text-gray-600 max-w-sm mx-auto leading-relaxed"
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <motion.span
              className="inline-block"
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ duration: 0.3 }}
            >
              🎯
            </motion.span>{" "}
            Learn from top experts{" "}
            <motion.span
              className="inline-block"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3 }}
            >
              👨‍🏫
            </motion.span>
            , engage with interactive content{" "}
            <motion.span
              className="inline-block"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3 }}
            >
              💡
            </motion.span>
            , and connect with like-minded learners{" "}
            <motion.span
              className="inline-block"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3 }}
            >
              🤝
            </motion.span>
            . Your success story starts here!{" "}
            <motion.span
              className="inline-block"
              whileHover={{ scale: 1.2, rotate: 15 }}
              transition={{ duration: 0.3 }}
            >
              🚀
            </motion.span>
          </motion.p>
        </motion.div>

        {/* Enhanced SearchBar */}
            <SearchBar/>
        {/* Call-to-Action Stats */}
        <motion.div
          variants={textVariants}
          className="flex flex-wrap justify-center gap-8 mt-12 text-center"
        >
          {[
            { number: "50K+", label: "Happy Students" },
            { number: "200+", label: "Expert Instructors" },
            { number: "500+", label: "Courses Available" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center"
              whileHover={{
                scale: 1.1,
                y: -5
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
              >
                {stat.number}
              </motion.span>
              <span className="text-gray-600 font-medium">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
          whileHover={{ borderColor: "#06b6d4" }}
        >
          <motion.div
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            animate={{
              scaleY: [1, 1.5, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;