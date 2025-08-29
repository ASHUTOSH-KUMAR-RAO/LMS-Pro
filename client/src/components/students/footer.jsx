import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const footerRef = useRef(null);
  const logoRef = useRef(null);

  // GSAP animation on mount
  useEffect(() => {
    // Simulating GSAP animations with CSS transitions
    if (footerRef.current) {
      footerRef.current.style.opacity = "0";
      footerRef.current.style.transform = "translateY(50px)";

      setTimeout(() => {
        footerRef.current.style.transition = "all 1s ease-out";
        footerRef.current.style.opacity = "1";
        footerRef.current.style.transform = "translateY(0)";
      }, 100);
    }
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("contact@edusphere.com").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleLogoClick = () => {
    // Navigate to "/" route
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <footer
      ref={footerRef}
      className={`relative transition-all duration-500 ${
        isDark
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800"
      }`}
    >
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4 z-10">
        <motion.button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors duration-300 ${
            isDark
              ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400"
              : "bg-gray-800 text-yellow-400 hover:bg-gray-700"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
      </div>

      {/* Decorative Top Wave */}
      <div
        className={`w-full h-16 ${
          isDark ? "bg-gray-800" : "bg-white"
        } relative`}
      >
        <svg
          className="absolute bottom-0 w-full h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
            fill={isDark ? "#1f2937" : "#3b82f6"}
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              ref={logoRef}
              onClick={handleLogoClick}
              className="flex items-center mb-6 cursor-pointer"
            >
              <motion.img
                src="/teachUs.png"
                alt="EduSphere Logo"
                className="h-12 w-auto mr-3"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              />
              <motion.h2
                className={`text-3xl font-bold bg-gradient-to-r ${
                  isDark
                    ? "from-blue-400 to-purple-400"
                    : "from-blue-600 to-purple-600"
                } bg-clip-text text-transparent`}
                whileHover={{ scale: 1.05 }}
              >
                EduSphere
              </motion.h2>
            </div>

            <p
              className={`text-lg mb-6 leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              EduSphere - Transforming education through innovative technology
              and personalized learning experiences. Join thousands of students
              and educators on their journey to academic excellence.
            </p>

            <div className="space-y-3">
              <motion.div
                className="flex items-center group cursor-pointer"
                onClick={copyEmail}
                whileHover={{ scale: 1.02 }}
              >
                <Mail
                  className={`mr-3 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                  size={20}
                />
                <span
                  className={`${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  contact@edusphere.com
                </span>
                {copied ? (
                  <Check className="ml-2 text-green-500" size={16} />
                ) : (
                  <Copy
                    className={`ml-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                    size={16}
                  />
                )}
              </motion.div>

              <div className="flex items-center">
                <Phone
                  className={`mr-3 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                  size={20}
                />
                <span
                  className={`${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  +91 98765 43210
                </span>
              </div>

              <div className="flex items-center">
                <MapPin
                  className={`mr-3 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                  size={20}
                />
                <span
                  className={`${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Lucknow, Uttar Pradesh, India
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3
              className={`text-xl font-semibold mb-6 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                "Courses",
                "About Us",
                "Teachers",
                "Students",
                "Blog",
                "Contact",
              ].map((item, index) => (
                <motion.li key={item} whileHover={{ x: 5 }}>
                  <a
                    href="#"
                    className={`${
                      isDark
                        ? "text-gray-300 hover:text-blue-400"
                        : "text-gray-600 hover:text-blue-600"
                    } transition-colors duration-300`}
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3
              className={`text-xl font-semibold mb-6 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Stay Connected
            </h3>

            <div className="mb-6">
              <div className="flex flex-col space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className={`px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-400 focus:border-blue-400"
                      : "bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                <motion.button
                  onClick={handleNewsletterSubmit}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={16} />
                  <span>Subscribe</span>
                </motion.button>
              </div>
            </div>

            {isSubscribed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-green-500 text-sm font-medium mb-4"
              >
                ✓ Successfully subscribed!
              </motion.div>
            )}

            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Get latest updates, courses, and educational resources directly in
              your inbox.
            </p>
          </motion.div>
        </div>

        {/* Social Media Links */}
        <motion.div
          className="flex justify-center space-x-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {[
            { icon: Facebook, color: "#1877f2", name: "Facebook" },
            { icon: Twitter, color: "#1da1f2", name: "Twitter" },
            { icon: Instagram, color: "#e4405f", name: "Instagram" },
            { icon: Linkedin, color: "#0077b5", name: "LinkedIn" },
            { icon: Youtube, color: "#ff0000", name: "YouTube" },
          ].map(({ icon: Icon, color, name }, index) => (
            <motion.div
              key={name}
              className={`p-3 rounded-full transition-all duration-300 cursor-pointer ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-white hover:bg-gray-50"
              } shadow-lg`}
              whileHover={{
                scale: 1.1,
                backgroundColor: color,
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => console.log(`Navigate to ${name}`)}
            >
              <Icon
                size={24}
                className={isDark ? "text-gray-300" : "text-gray-600"}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className={`border-t pt-8 ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start space-x-6">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "Support",
              ].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  className={`text-sm ${
                    isDark
                      ? "text-gray-400 hover:text-blue-400"
                      : "text-gray-500 hover:text-blue-600"
                  } transition-colors duration-300`}
                  whileHover={{ scale: 1.05 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
            <div
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              &copy; {new Date().getFullYear()} Ashutosh Kumar Rao. All rights reserved.
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer
