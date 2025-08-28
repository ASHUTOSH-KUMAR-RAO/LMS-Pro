import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assets } from "../../assets/assets";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Companies = () => {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const logosRef = useRef([]);
  const gradientRef = useRef(null);
  const timelineRef = useRef(null);

  // Clear and reset refs properly
  const addToRefs = (el) => {
    if (el && !logosRef.current.includes(el)) {
      logosRef.current.push(el);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    
    const ctx = gsap.context(() => {
      // Create a master timeline for better control
      timelineRef.current = gsap.timeline({ paused: true });

      // Smooth gradient animation
      if (gradientRef.current) {
        gsap.set(gradientRef.current, { backgroundPosition: "0% center" });
        gsap.to(gradientRef.current, {
          backgroundPosition: "200% center",
          duration: 4,
          repeat: -1,
          ease: "none"
        });
      }

      // Optimized ScrollTrigger animations
      if (titleRef.current) {
        gsap.fromTo(titleRef.current, 
          { 
            opacity: 0, 
            y: 30,
            scale: 0.95
          },
          { 
            opacity: 1, 
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Enhanced logo animations with error handling
      if (logosRef.current.length > 0) {
        // Initial state
        gsap.set(logosRef.current, {
          opacity: 0,
          y: 40,
          scale: 0.8
        });

        // Entry animation
        gsap.to(logosRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.4)",
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play none none reverse"
          }
        });

        // Subtle floating animation with performance optimization
        logosRef.current.forEach((logo, index) => {
          if (logo) {
            gsap.to(logo, {
              y: -5,
              duration: 2.5 + (index * 0.2),
              repeat: -1,
              yoyo: true,
              ease: "power1.inOut",
              delay: index * 0.15
            });
          }
        });
      }

    }, containerRef);

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ctx.revert();
    };
  }, [isMounted]);

  // Handle company website click
  const handleCompanyClick = (website) => {
    window.open(website, '_blank', 'noopener,noreferrer');
  };
  // Optimized animation variants
  const logoVariants = {
    hover: {
      scale: 1.05,
      y: -3,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 20
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const companies = [
    { 
      src: assets.microsoft_logo, 
      alt: "Microsoft", 
      name: "Microsoft",
      website: "https://www.microsoft.com"
    },
    { 
      src: assets.paypal_logo, 
      alt: "PayPal", 
      name: "PayPal",
      website: "https://www.paypal.com"
    },
    { 
      src: assets.walmart_logo, 
      alt: "Walmart", 
      name: "Walmart",
      website: "https://www.walmart.com"
    },
    { 
      src: assets.accenture_logo, 
      alt: "Accenture", 
      name: "Accenture",
      website: "https://www.accenture.com"
    },
    { 
      src: assets.adobe_logo, 
      alt: "Adobe", 
      name: "Adobe",
      website: "https://www.adobe.com"
    }
  ];

  if (!isMounted) {
    return null; // Prevent SSR issues
  }

  return (
    <section ref={containerRef} className="relative w-full py-12 md:py-20 px-4 overflow-hidden">
      {/* Optimized background gradient */}
      <div 
        ref={gradientRef}
        className="absolute inset-0 opacity-3 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
          backgroundSize: "200% 100%",
          willChange: "background-position"
        }}
      />
      
      {/* Main content with proper constraints */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Enhanced title section */}
        <div
          ref={titleRef}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Trusted by Professionals
            </span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg lg:text-xl max-w-3xl mx-auto px-4 leading-relaxed">
            Join thousands of learners from world's leading companies who trust our platform
          </p>
        </div>

        {/* Responsive logos container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          {/* Mobile: Stack vertically, Tablet: 2-3 columns, Desktop: All in row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:justify-center lg:items-center gap-4 md:gap-6 lg:gap-8 xl:gap-12">
            {companies.map((company, index) => (
              <motion.div
                key={`${company.name}-${index}`}
                ref={addToRefs}
                variants={logoVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleCompanyClick(company.website)}
                className="flex justify-center items-center"
              >
                {/* Logo container with improved responsive sizing */}
                <div className="relative group cursor-pointer w-full max-w-[120px] md:max-w-[140px] transition-transform duration-200 hover:scale-105 active:scale-95">
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Logo card */}
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 lg:p-6 border border-gray-100 shadow-sm group-hover:shadow-lg group-hover:border-blue-200 transition-all duration-300 aspect-square flex items-center justify-center">
                    <img 
                      src={company.src} 
                      alt={company.alt}
                      loading="lazy"
                      className="w-full h-full max-w-[60px] max-h-[60px] md:max-w-[80px] md:max-h-[80px] lg:max-w-[100px] lg:max-h-[100px] object-contain filter grayscale-[50%] group-hover:grayscale-0 transition-all duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    
                    {/* Click indicator */}
                    <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {/* Enhanced Tooltip with click hint */}
                  <div className="hidden md:block absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                    <div className="font-medium">{company.name}</div>
                    <div className="text-gray-300 text-[10px]">Click to visit website</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Animated indicator dots - optimized */}
        <motion.div
          className="flex justify-center items-center space-x-1.5 mt-8 md:mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`dot-${i}`}
              className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Companies;