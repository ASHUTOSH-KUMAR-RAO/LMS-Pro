import { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../../context/app-context";
import CourseCard from "../../components/students/course-card";
import Footer from "../../components/students/footer";
import { useParams, } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  FunnelIcon,
  BookOpenIcon,
  HomeIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

const CourseList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState(input || "");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const searchRef = useRef(null);

  // GSAP animations on mount
  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(headerRef.current, 
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    )
    .fromTo(searchRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
      "-=0.4"
    );
  }, []);

  // Get unique categories
  const categories = ["all", ...new Set(allCourses?.map(course => course.category?.toLowerCase()).filter(Boolean))];

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      setIsLoading(true);
      
      let filtered = [...allCourses];
      
      // Category filter
      if (selectedCategory !== "all") {
        filtered = filtered.filter(course => 
          course.category?.toLowerCase() === selectedCategory
        );
      }
      
      // Search filter
      if (searchQuery && searchQuery.trim()) {
        filtered = filtered.filter((item) =>
          item.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.instructor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Sort
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "title":
            return a.courseTitle?.localeCompare(b.courseTitle);
          case "instructor":
            return a.instructor?.localeCompare(b.instructor);
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          case "students":
            return (b.enrolledStudents || 0) - (a.enrolledStudents || 0);
          default:
            return 0;
        }
      });
      
      setFilteredCourses(filtered);
      
      // Animate grid when courses change
      if (gridRef.current) {
        gsap.fromTo(gridRef.current.children,
          { y: 20, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.6, 
            stagger: 0.1, 
            ease: "power2.out",
            delay: 0.2
          }
        );
      }
      
      setIsLoading(false);
    } else if (allCourses && allCourses.length === 0) {
      setIsLoading(false);
      setFilteredCourses([]);
    }
  }, [allCourses, searchQuery, selectedCategory, sortBy]);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("title");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || sortBy !== "title";

  // Container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Loading state with modern spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <motion.div 
            className="flex items-center justify-center min-h-96"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-cyan-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <motion.p 
                className="text-gray-600 font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Loading amazing courses...
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        
        {/* Header Section */}
        <motion.div 
          ref={headerRef}
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <motion.button
              onClick={() => navigate("/")}
              className="flex items-center space-x-1 hover:text-indigo-600 transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </motion.button>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">Course List</span>
          </nav>

          {/* Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Discover 
                <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  {" "}Amazing{" "}
                </span>
                Courses
              </h1>
              <p className="text-gray-600 text-lg">Expand your knowledge with our curated collection</p>
            </div>
            <motion.div 
              className="flex items-center space-x-2 text-sm text-gray-500"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <BookOpenIcon className="w-5 h-5" />
              <span>{allCourses?.length || 0} courses available</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div 
          ref={searchRef}
          className="mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search courses, instructors, or topics..."
                  className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5 text-gray-500" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors self-start"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FunnelIcon className="w-4 h-4 text-indigo-600" />
                <span className="text-indigo-600 font-medium">Filters</span>
                {hasActiveFilters && (
                  <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">Active</span>
                )}
              </motion.button>

              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={clearAllFilters}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors self-start sm:self-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <XMarkIcon className="w-4 h-4" />
                  <span>Clear All Filters</span>
                </motion.button>
              )}
            </div>

            {/* Filter Options */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-white/50 backdrop-blur-sm"
                      >
                        <option value="all">All Categories</option>
                        {categories.slice(1).map(category => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sort Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-white/50 backdrop-blur-sm"
                      >
                        <option value="title">Course Title</option>
                        <option value="instructor">Instructor</option>
                        <option value="rating">Highest Rated</option>
                        <option value="students">Most Popular</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Results Info */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-gray-600">
              {searchQuery && searchQuery.trim() 
                ? (
                  <span>
                    Found <span className="font-semibold text-indigo-600">{filteredCourses.length}</span> course(s) for 
                    <span className="font-semibold text-gray-900"> "{searchQuery}"</span>
                  </span>
                ) : (
                  <span>
                    Showing <span className="font-semibold text-indigo-600">{filteredCourses.length}</span> courses
                    {selectedCategory !== "all" && (
                      <span> in <span className="font-semibold text-gray-900">{selectedCategory}</span></span>
                    )}
                  </span>
                )
              }
            </p>
          </div>
        </motion.div>

        {/* Course Grid */}
        <AnimatePresence mode="wait">
          {filteredCourses.length > 0 ? (
            <motion.div
              ref={gridRef}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id || index}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  layout
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center min-h-96 text-center"
            >
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-full p-8">
                  <BookOpenIcon className="w-16 h-16 text-indigo-400" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <XMarkIcon className="w-4 h-4" />
                </motion.div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No courses found
              </h3>
              
              <p className="text-gray-600 mb-8 max-w-md">
                {searchQuery && searchQuery.trim()
                  ? `We couldn't find any courses matching "${searchQuery}". Try adjusting your search or filters.`
                  : "No courses are available with the current filters."}
              </p>
              
              {hasActiveFilters && (
                <motion.button
                  onClick={clearAllFilters}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear All Filters
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer/>
    </div>
  );
};

export default CourseList;