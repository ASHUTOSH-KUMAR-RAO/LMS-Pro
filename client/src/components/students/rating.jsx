import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

const Rating = ({
  initialRating = 0,
  onRate,
  size = "large",
  showFeedback = true,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const starsRef = useRef([]);
  const containerRef = useRef();
  const feedbackRef = useRef();

  const sizeClasses = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-3xl",
    xl: "text-4xl",
  };

  const handleRating = (value) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setRating(value);

    if (onRate) onRate(value);

    // Create explosion effect for the selected star
    const selectedStar = starsRef.current[value - 1];
    if (selectedStar) {
      // Create sparkles around the clicked star
      createSparkles(selectedStar);

      // Animate the clicked star
      gsap.to(selectedStar, {
        scale: 1.5,
        rotation: 360,
        duration: 0.6,
        ease: "back.out(1.7)",
        onComplete: () => {
          gsap.to(selectedStar, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
          });
        },
      });

      // Wave animation for other stars
      starsRef.current.forEach((star, index) => {
        if (index !== value - 1 && star) {
          gsap.to(star, {
            scale: index < value ? 1.2 : 0.9,
            y: -10,
            duration: 0.4,
            delay: Math.abs(index - (value - 1)) * 0.1,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(star, {
                scale: 1,
                y: 0,
                duration: 0.3,
              });
            },
          });
        }
      });
    }

    // Show thank you message
    if (showFeedback) {
      setTimeout(() => {
        setShowThankYou(true);
        setTimeout(() => {
          setShowThankYou(false);
        }, 2500);
      }, 800);
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 1200);
  };

  const createSparkles = (element) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create multiple sparkle elements
    for (let i = 0; i < 8; i++) {
      const sparkle = document.createElement("div");
      sparkle.innerHTML = "✨";
      sparkle.style.position = "fixed";
      sparkle.style.left = centerX + "px";
      sparkle.style.top = centerY + "px";
      sparkle.style.fontSize = "20px";
      sparkle.style.pointerEvents = "none";
      sparkle.style.zIndex = "9999";
      document.body.appendChild(sparkle);

      // Random direction for sparkles
      const angle = (i / 8) * Math.PI * 2;
      const distance = 50 + Math.random() * 30;
      const endX = centerX + Math.cos(angle) * distance;
      const endY = centerY + Math.sin(angle) * distance;

      gsap.to(sparkle, {
        left: endX,
        top: endY,
        opacity: 0,
        scale: 0,
        rotation: 360,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          document.body.removeChild(sparkle);
        },
      });
    }
  };

  const handleHover = (value) => {
    if (isAnimating) return;

    setHoveredRating(value);

    // Gentle hover animation
    starsRef.current.forEach((star, index) => {
      if (star) {
        if (index < value) {
          gsap.to(star, {
            scale: 1.15,
            y: -3,
            duration: 0.2,
            ease: "power2.out",
          });
        } else {
          gsap.to(star, {
            scale: 0.95,
            y: 0,
            duration: 0.2,
            ease: "power2.out",
          });
        }
      }
    });
  };

  const handleMouseLeave = () => {
    if (isAnimating) return;

    setHoveredRating(0);

    // Reset all stars to normal state
    starsRef.current.forEach((star) => {
      if (star) {
        gsap.to(star, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });
  };

  useEffect(() => {
    if (initialRating !== rating) {
      setRating(initialRating);
    }
  }, [initialRating]);

  // Initial animation when component mounts
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        starsRef.current,
        {
          opacity: 0,
          scale: 0,
          rotation: -180,
          y: 50,
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          delay: 0.2,
        }
      );
    }
  }, []);

  const getRatingText = (rating) => {
    const texts = {
      1: { text: "Poor", color: "text-red-500", emoji: "😞" },
      2: { text: "Fair", color: "text-orange-500", emoji: "😐" },
      3: { text: "Good", color: "text-yellow-500", emoji: "🙂" },
      4: { text: "Great", color: "text-green-500", emoji: "😊" },
      5: { text: "Excellent", color: "text-purple-500", emoji: "🤩" },
    };
    return texts[rating] || { text: "", color: "", emoji: "" };
  };

  const currentRating = hoveredRating || rating;
  const ratingInfo = getRatingText(currentRating);

  return (
    <motion.div
      ref={containerRef}
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Stars Container */}
      <motion.div
        className="flex items-center gap-2 p-4 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/60"
        onMouseLeave={handleMouseLeave}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        }}
      >
        {Array.from({ length: 5 }, (_, index) => {
          const starValue = index + 1;
          const isActive = starValue <= currentRating;
          const isRated = starValue <= rating;

          return (
            <motion.span
              key={index}
              ref={(el) => (starsRef.current[index] = el)}
              className={`${
                sizeClasses[size]
              } cursor-pointer select-none transition-all duration-200 relative ${
                isActive
                  ? isRated
                    ? "text-yellow-400 drop-shadow-lg"
                    : "text-yellow-300"
                  : "text-gray-300 hover:text-gray-400"
              }`}
              onClick={() => handleRating(starValue)}
              onMouseEnter={() => handleHover(starValue)}
              whileHover={{
                filter: "drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))",
              }}
              whileTap={{ scale: 0.9 }}
              style={{
                textShadow: isActive
                  ? "0 0 20px rgba(251, 191, 36, 0.5)"
                  : "none",
              }}
            >
              ⭐{/* Glow effect for active stars */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 text-yellow-200 -z-10"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  ⭐
                </motion.div>
              )}
            </motion.span>
          );
        })}
      </motion.div>

      {/* Rating Text and Emoji */}
      <AnimatePresence>
        {currentRating > 0 && (
          <motion.div
            className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/50"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.3, ease: "back.out(1.7)" }}
          >
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              {ratingInfo.emoji}
            </motion.span>
            <span className={`font-bold ${ratingInfo.color} text-lg`}>
              {ratingInfo.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thank You Message */}
      <AnimatePresence>
        {showThankYou && showFeedback && (
          <motion.div
            ref={feedbackRef}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-lg"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.5,
              y: -20,
            }}
            transition={{
              duration: 0.5,
              ease: "back.out(1.7)",
            }}
          >
            <motion.div
              className="flex items-center gap-2"
              animate={{ x: [0, 5, -5, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              🎉 Thank you for rating! 🎉
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating particles effect */}
      {rating > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-300 text-sm"
              initial={{
                x: Math.random() * 200 - 100,
                y: 50,
                opacity: 0,
              }}
              animate={{
                y: -50,
                opacity: [0, 1, 0],
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeOut",
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Rating;
