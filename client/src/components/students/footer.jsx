import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Send,
  Copy,
  Check,
  Moon,
  Sun,
  ArrowUp,
  Sparkles,
  Heart,
  Star,
  Zap,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [particles, setParticles] = useState([]);
  const [heartClicks, setHeartClicks] = useState(0);
  
  const footerRef = useRef(null);
  const logoRef = useRef(null);
  const particlesRef = useRef([]);
  const isInView = useInView(footerRef, { once: false, amount: 0.2 });
  const controls = useAnimation();

  // Floating particles animation
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      }));
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Enhanced entrance animation
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      
      // Confetti effect
      createConfetti();
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  const createConfetti = () => {
    const confetti = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: 0,
    }));
    // Confetti animation logic would go here
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("contact@edusphere.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy email");
    }
  };

  const handleLogoClick = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    // Add theme change animation
    document.body.style.transition = "all 0.5s ease";
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHeartClick = () => {
    setHeartClicks(prev => prev + 1);
    // Create heart animation
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const socialIcons = [
    { icon: Facebook, color: "#1877f2", name: "Facebook", hover: "hover:shadow-blue-500/50" },
    { icon: Twitter, color: "#1da1f2", name: "Twitter", hover: "hover:shadow-cyan-500/50" },
    { icon: Instagram, color: "#e4405f", name: "Instagram", hover: "hover:shadow-pink-500/50" },
    { icon: Linkedin, color: "#0077b5", name: "LinkedIn", hover: "hover:shadow-blue-600/50" },
    { icon: Youtube, color: "#ff0000", name: "YouTube", hover: "hover:shadow-red-500/50" },
  ];

  return (
    <>
      {/* Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute w-1 h-1 rounded-full ${
              isDark ? "bg-blue-400/20" : "bg-purple-400/20"
            }`}
            initial={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              scale: 0,
            }}
            animate={{
              y: [0, -20, 0],
              scale: [0, particle.size, 0],
              opacity: [0, particle.opacity, 0],
            }}
            transition={{
              duration: particle.speed + 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-lg transition-all duration-300 ${
          isDark
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500"
            : "bg-gradient-to-r from-white to-gray-100 text-gray-800 hover:shadow-xl border border-gray-200"
        }`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{
          scale: showScrollTop ? 1 : 0,
          rotate: showScrollTop ? 0 : -180,
        }}
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)" 
        }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <ArrowUp size={20} />
      </motion.button>

      <footer
        ref={footerRef}
        className={`relative transition-all duration-700 overflow-hidden ${
          isDark
            ? "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white"
            : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800"
        }`}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className={`absolute -top-10 -right-10 w-40 h-40 rounded-full ${
              isDark ? "bg-blue-600/10" : "bg-purple-400/10"
            }`}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className={`absolute -bottom-10 -left-10 w-32 h-32 rounded-full ${
              isDark ? "bg-purple-600/10" : "bg-blue-400/10"
            }`}
            animate={{
              scale: [1, 1.3, 1],
              rotate: [360, 180, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Theme Toggle Button with Enhanced Animation */}
        <div className="absolute top-6 right-6 z-20">
          <motion.button
            onClick={toggleTheme}
            className={`relative p-3 rounded-full transition-all duration-500 overflow-hidden ${
              isDark
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 shadow-lg shadow-yellow-500/25"
                : "bg-gradient-to-r from-gray-800 to-gray-900 text-yellow-400 shadow-lg shadow-gray-800/25"
            }`}
            whileHover={{ 
              scale: 1.15,
              rotate: 360,
              boxShadow: "0 0 30px rgba(255, 193, 7, 0.4)"
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <motion.div
              animate={{ rotate: isDark ? 0 : 180 }}
              transition={{ duration: 0.5 }}
            >
              {isDark ? <Sun size={22} /> : <Moon size={22} />}
            </motion.div>
            
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0, 0.5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        </div>

        {/* Enhanced Decorative Top Wave */}
        <div className={`w-full h-20 ${isDark ? "bg-gray-800/50" : "bg-white/50"} relative`}>
          <svg
            className="absolute bottom-0 w-full h-20"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
              fill={isDark ? "url(#darkGradient)" : "url(#lightGradient)"}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="darkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: "#8b5cf6", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="lightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: "#8b5cf6", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <motion.div
          className="max-w-7xl mx-auto px-6 py-12 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            {/* Enhanced Company Info */}
            <motion.div
              className="lg:col-span-2"
              variants={itemVariants}
            >
              <motion.div
                onClick={handleLogoClick}
                className="flex items-center mb-8 cursor-pointer group"
                whileHover={{ scale: 1.05 }}
              >
                <motion.img
                  ref={logoRef}
                  src="/teachUs.png"
                  alt="EduSphere Logo"
                  className="h-14 w-auto mr-4 filter drop-shadow-lg"
                  whileHover={{ 
                    rotate: 360,
                    filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))"
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
                <motion.h2
                  className={`text-4xl font-bold bg-gradient-to-r ${
                    isDark
                      ? "from-blue-400 via-purple-400 to-pink-400"
                      : "from-blue-600 via-purple-600 to-indigo-600"
                  } bg-clip-text text-transparent`}
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                  EduSphere
                </motion.h2>
                <motion.div
                  className="ml-2"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="text-yellow-500" size={24} />
                </motion.div>
              </motion.div>

              <motion.p
                className={`text-lg mb-8 leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
                variants={itemVariants}
              >
                EduSphere - Transforming education through innovative technology
                and personalized learning experiences. Join thousands of students
                and educators on their journey to academic excellence. 🚀
              </motion.p>

              {/* Enhanced Contact Info */}
              <div className="space-y-4">
                <motion.div
                  className="flex items-center group cursor-pointer p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                  onClick={copyEmail}
                  whileHover={{ scale: 1.02, x: 10 }}
                  variants={itemVariants}
                >
                  <Mail
                    className={`mr-4 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                    size={22}
                  />
                  <span className={`${isDark ? "text-gray-300" : "text-gray-600"} text-lg`}>
                    contact@edusphere.com
                  </span>
                  <motion.div
                    className="ml-auto"
                    animate={{ opacity: copied ? 1 : 0 }}
                  >
                    {copied ? (
                      <motion.div
                        className="flex items-center text-green-500"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check size={18} className="mr-1" />
                        <span className="text-sm">Copied!</span>
                      </motion.div>
                    ) : (
                      <Copy
                        className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                        size={18}
                      />
                    )}
                  </motion.div>
                </motion.div>

                <motion.div
                  className="flex items-center p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.02, x: 10 }}
                  variants={itemVariants}
                >
                  <Phone
                    className={`mr-4 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                    size={22}
                  />
                  <span className={`${isDark ? "text-gray-300" : "text-gray-600"} text-lg`}>
                    +91 98765 43210
                  </span>
                </motion.div>

                <motion.div
                  className="flex items-center p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.02, x: 10 }}
                  variants={itemVariants}
                >
                  <MapPin
                    className={`mr-4 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                    size={22}
                  />
                  <span className={`${isDark ? "text-gray-300" : "text-gray-600"} text-lg`}>
                    Lucknow, Uttar Pradesh, India
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Quick Links */}
            <motion.div variants={itemVariants}>
              <h3
                className={`text-2xl font-bold mb-8 flex items-center ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                <Zap className="mr-2 text-yellow-500" size={24} />
                Quick Links
              </h3>
              <ul className="space-y-4">
                {[
                  { name: "Courses", icon: "📚" },
                  { name: "About Us", icon: "🎯" },
                  { name: "Teachers", icon: "👨‍🏫" },
                  { name: "Students", icon: "👨‍🎓" },
                  { name: "Blog", icon: "📝" },
                  { name: "Contact", icon: "📞" },
                ].map((item, index) => (
                  <motion.li
                    key={item.name}
                    whileHover={{ x: 15, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.a
                      href="#"
                      className={`flex items-center p-2 rounded-lg transition-all duration-300 ${
                        isDark
                          ? "text-gray-300 hover:text-blue-400 hover:bg-white/5"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                      whileHover={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(59,130,246,0.1)" }}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.name}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Enhanced Newsletter */}
            <motion.div variants={itemVariants}>
              <h3
                className={`text-2xl font-bold mb-8 flex items-center ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                <Star className="mr-2 text-yellow-500" size={24} />
                Stay Connected
              </h3>

              <form onSubmit={handleNewsletterSubmit} className="mb-8">
                <div className="space-y-4">
                  <motion.input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className={`w-full px-6 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 text-lg ${
                      isDark
                        ? "bg-gray-800/50 border-gray-600 text-white focus:ring-blue-400 focus:border-blue-400 placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                    }`}
                    whileFocus={{ scale: 1.02 }}
                    required
                  />
                  <motion.button
                    type="submit"
                    className={`w-full px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                      isDark
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25"
                    }`}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 30px rgba(147, 51, 234, 0.4)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!email}
                  >
                    <Send size={20} />
                    <span>Subscribe Now</span>
                  </motion.button>
                </div>
              </form>

              <AnimatePresence>
                {isSubscribed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl"
                  >
                    <div className="flex items-center text-green-400 font-medium">
                      <Check className="mr-2" size={20} />
                      <span>Successfully subscribed! 🎉</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Get latest updates, courses, and educational resources directly in
                your inbox. Join our community of learners! 💌
              </p>
            </motion.div>
          </div>

          {/* Enhanced Social Media Links */}
          <motion.div
            className="flex justify-center space-x-6 mb-12"
            variants={itemVariants}
          >
            {socialIcons.map(({ icon: Icon, color, name, hover }, index) => (
              <motion.div
                key={name}
                className={`relative p-4 rounded-full cursor-pointer transition-all duration-300 ${
                  isDark
                    ? "bg-gray-800/50 hover:bg-gray-700/50"
                    : "bg-white hover:bg-gray-50"
                } shadow-lg backdrop-blur-sm ${hover}`}
                whileHover={{
                  scale: 1.15,
                  y: -5,
                  boxShadow: `0 15px 35px ${color}40`,
                }}
                whileTap={{ scale: 0.9 }}
                onClick={() => console.log(`Navigate to ${name}`)}
              >
                <Icon
                  size={28}
                  className={`transition-colors duration-300 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                />
                
                {/* Hover effect ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-transparent"
                  whileHover={{
                    borderColor: color,
                    scale: 1.2,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Bottom Section */}
          <motion.div
            className={`border-t pt-10 ${
              isDark ? "border-gray-700/50" : "border-gray-200/50"
            }`}
            variants={itemVariants}
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
              <div className="flex flex-wrap justify-center md:justify-start gap-8">
                {[
                  "Privacy Policy",
                  "Terms of Service", 
                  "Cookie Policy",
                  "Support",
                ].map((item) => (
                  <motion.a
                    key={item}
                    href="#"
                    className={`text-sm font-medium ${
                      isDark
                        ? "text-gray-400 hover:text-blue-400"
                        : "text-gray-500 hover:text-blue-600"
                    } transition-all duration-300 relative`}
                    whileHover={{ scale: 1.1, y: -2 }}
                  >
                    {item}
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}
              </div>
              
              <motion.div
                className={`text-sm flex items-center ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <span>&copy; {new Date().getFullYear()} Ashutosh Kumar Rao. Made with</span>
                <motion.button
                  onClick={handleHeartClick}
                  className="mx-2 text-red-500"
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.8 }}
                  animate={{
                    scale: heartClicks > 0 ? [1, 1.2, 1] : 1,
                  }}
                >
                  <Heart size={16} fill="currentColor" />
                </motion.button>
                <span>in India</span>
                {heartClicks > 0 && (
                  <motion.span
                    className="ml-2 text-yellow-500"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    +{heartClicks}
                  </motion.span>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </footer>
    </>
  );
};

export default Footer;