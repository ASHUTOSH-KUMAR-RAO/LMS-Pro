import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const location = useLocation();
  const isCourseListPage = location.pathname.includes("/courses-list");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { openSignIn } = useClerk();
  const { user } = useUser();
  
  // Refs for GSAP animations
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const buttonRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const navbar = navRef.current;
    const logo = logoRef.current;
    const links = linksRef.current;
    const button = buttonRef.current;

    // Initial navbar entrance animation
    gsap.fromTo(navbar, 
      { 
        y: -100, 
        opacity: 0 
      },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: "power2.out" 
      }
    );

    // Logo entrance animation
    gsap.fromTo(logo,
      { 
        scale: 0, 
        rotation: -180 
      },
      { 
        scale: 1, 
        rotation: 0, 
        duration: 0.8, 
        ease: "back.out(1.7)",
        delay: 0.3 
      }
    );

    // Links staggered animation
    gsap.fromTo(links,
      { 
        x: 50, 
        opacity: 0 
      },
      { 
        x: 0, 
        opacity: 1, 
        duration: 0.6, 
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.5 
      }
    );

    // Button entrance animation
    if (button) {
      gsap.fromTo(button,
        { 
          scale: 0, 
          opacity: 0 
        },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.6, 
          ease: "back.out(1.7)",
          delay: 0.7 
        }
      );
    }

    // Scroll trigger for navbar background
    ScrollTrigger.create({
      start: "top -50",
      end: 99999,
      onUpdate: (self) => {
        if (self.progress > 0 && !isScrolled) {
          setIsScrolled(true);
          gsap.to(navbar, {
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            duration: 0.3
          });
        } else if (self.progress === 0 && isScrolled) {
          setIsScrolled(false);
          gsap.to(navbar, {
            backgroundColor: isCourseListPage 
              ? "rgba(249, 250, 251, 0.8)" 
              : "rgba(236, 254, 255, 0.6)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(209, 213, 219, 0.3)",
            duration: 0.3
          });
        }
      }
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isScrolled, isCourseListPage]);

  // Logo hover animation
  const handleLogoHover = () => {
    gsap.to(logoRef.current.querySelector('img'), {
      rotation: 360,
      scale: 1.1,
      duration: 0.6,
      ease: "power2.out"
    });
    
    gsap.to(logoRef.current.querySelector('p'), {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleLogoLeave = () => {
    gsap.to(logoRef.current.querySelector('img'), {
      rotation: 0,
      scale: 1,
      duration: 0.6,
      ease: "power2.out"
    });
    
    gsap.to(logoRef.current.querySelector('p'), {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  // Link hover animations
  const handleLinkHover = (index) => {
    gsap.to(linksRef.current[index], {
      y: -3,
      color: "#2563eb",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleLinkLeave = (index) => {
    gsap.to(linksRef.current[index], {
      y: 0,
      color: "#6b7280",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  // Button hover animation
  const handleButtonHover = () => {
    gsap.to(buttonRef.current, {
      scale: 1.05,
      boxShadow: "0 20px 40px rgba(37, 99, 235, 0.3)",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleButtonLeave = () => {
    gsap.to(buttonRef.current, {
      scale: 1,
      boxShadow: "0 10px 25px rgba(37, 99, 235, 0.2)",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    
    if (!isMobileMenuOpen) {
      gsap.fromTo(mobileMenuRef.current,
        { 
          height: 0, 
          opacity: 0 
        },
        { 
          height: "auto", 
          opacity: 1, 
          duration: 0.4, 
          ease: "power2.out" 
        }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in"
      });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-36 py-4 transition-all duration-300 ${
          isCourseListPage
            ? "bg-gray-50/80 border-gray-300/30"
            : "bg-cyan-50/60 border-gray-300/30"
        } border-b backdrop-blur-sm`}
        style={{ willChange: 'transform' }}
      >
        {/* Logo Section */}
        <div
          ref={logoRef}
          className="flex items-center gap-x-3 sm:gap-x-4 text-xl sm:text-2xl font-bold text-gray-800 cursor-pointer"
          onMouseEnter={handleLogoHover}
          onMouseLeave={handleLogoLeave}
        >
          <img
            src="/teachUs.png"
            alt="Logo"
            className="w-8 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-xl shadow-lg object-cover"
          />
          <p className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-extrabold tracking-tight">
            <span className="hidden sm:inline">EduSphere</span>
            <span className="sm:hidden">Edu</span>
          </p>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-gray-600">
          <div className="flex items-center gap-8">
            {user && (
              <>
                <div
                  ref={(el) => linksRef.current[0] = el}
                  className="relative font-medium cursor-pointer group"
                  onMouseEnter={() => handleLinkHover(0)}
                  onMouseLeave={() => handleLinkLeave(0)}
                >
                  Become Educator
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
                </div>

                <span className="text-gray-400">|</span>

                <Link
                  to="/my-enrollment"
                  ref={(el) => linksRef.current[1] = el}
                  className="relative font-medium group"
                  onMouseEnter={() => handleLinkHover(1)}
                  onMouseLeave={() => handleLinkLeave(1)}
                >
                  My Enrollments
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
                </Link>
              </>
            )}
          </div>

          {user ? (
            <div className="ml-4">
              <UserButton />
            </div>
          ) : (
            <button
              ref={buttonRef}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg cursor-pointer"
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
              onClick={openSignIn}
            >
              Create An Account
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1 p-2"
          onClick={toggleMobileMenu}
        >
          <span className="w-6 h-0.5 bg-gray-600 transition-all duration-300"></span>
          <span className="w-6 h-0.5 bg-gray-600 transition-all duration-300"></span>
          <span className="w-6 h-0.5 bg-gray-600 transition-all duration-300"></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="md:hidden fixed top-[72px] left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40 overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="px-4 py-6 space-y-4">
          {user ? (
            <>
              <div className="text-gray-600 font-medium py-2 hover:text-blue-600 transition-colors cursor-pointer">
                Become Educator
              </div>
              <Link
                to="/my-enrollment"
                className="block text-gray-600 font-medium py-2 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Enrollments
              </Link>
              <div className="pt-4">
                <UserButton />
              </div>
            </>
          ) : (
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium"
              onClick={openSignIn}
            >
              Create An Account
            </button>
          )}
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-20 sm:h-24"></div>
    </>
  );
};

export default Navbar;