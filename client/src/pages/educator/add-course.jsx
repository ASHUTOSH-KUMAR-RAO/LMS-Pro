import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Mock assets - replace with your actual assets
const assets = {
  file_upload_icon:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'/%3E%3C/svg%3E",
  dropdown_icon:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E",
  cross_icon:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12'/%3E%3C/svg%3E",
};

gsap.registerPlugin(ScrollTrigger);

const AddCourse = () => {
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );

      // Stagger animation for form elements
      gsap.fromTo(
        ".form-element",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.3,
        }
      );

      // Scroll-triggered animations
      gsap.utils.toArray(".chapter-item").forEach((chapter, i) => {
        gsap.fromTo(
          chapter,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: chapter,
              start: "top bottom-=100",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [chapters]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title) {
        const newChapter = {
          chapterId: generateId(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(
        chapters.filter((chapter) => chapter.chapterId !== chapterId)
      );
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1,
            lectureId: generateId(),
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your submit logic here
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 pt-24 px-4 md:px-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Create Your Course
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Build engaging learning experiences with our intuitive course
            creation platform
          </p>
        </motion.div>

        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Course Title */}
          <motion.div variants={itemVariants} className="form-element">
            <div className="group relative">
              <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors">
                Course Title
              </label>
              <input
                onChange={(e) => setCourseTitle(e.target.value)}
                value={courseTitle}
                type="text"
                placeholder="Enter an engaging course title..."
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white/70 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:shadow-lg"
                required
              />
            </div>
          </motion.div>

          {/* Course Description */}
          <motion.div variants={itemVariants} className="form-element">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Course Description
            </label>
            <div
              ref={editorRef}
              className="border-2 border-gray-200 rounded-xl min-h-[250px] bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-200"
            >
              <div className="p-4 text-gray-500">
                Rich text editor would be initialized here...
              </div>
            </div>
          </motion.div>

          {/* Price and Discount Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="form-element">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Course Price ($)
              </label>
              <input
                onChange={(e) => setCoursePrice(e.target.value)}
                value={coursePrice}
                type="number"
                placeholder="99"
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white/70 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants} className="form-element">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Discount (%)
              </label>
              <input
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                type="number"
                placeholder="10"
                min={0}
                max={100}
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white/70 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300"
                required
              />
            </motion.div>
          </div>

          {/* Course Thumbnail */}
          <motion.div variants={itemVariants} className="form-element">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Course Thumbnail
            </label>
            <div className="relative">
              <label
                htmlFor="thumbnailImage"
                className="group flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white/50 backdrop-blur-sm hover:bg-white/70 hover:border-blue-500 transition-all duration-300"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 mb-4 text-blue-500"
                  >
                    <img
                      src={assets.file_upload_icon}
                      alt="Upload"
                      className="w-full h-full"
                    />
                  </motion.div>
                  <p className="mb-2 text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG or WEBP (MAX. 5MB)
                  </p>
                </div>
              </label>
              <input
                type="file"
                id="thumbnailImage"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                className="hidden"
              />
              {image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 relative inline-block"
                >
                  <img
                    className="w-32 h-32 object-cover rounded-xl shadow-lg"
                    src={URL.createObjectURL(image)}
                    alt="Course Thumbnail Preview"
                  />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Chapters Section */}
          <motion.div variants={itemVariants} className="form-element">
            <div>
              {chapters.map((chapter, chapterIndex) => (
                <motion.div
                  key={chapterIndex}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="chapter-item bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl mb-4 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center">
                      <motion.button
                        type="button"
                        onClick={() =>
                          handleChapter("toggle", chapter.chapterId)
                        }
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        <motion.img
                          src={assets.dropdown_icon}
                          alt="drop-down"
                          width={14}
                          className="mr-2 cursor-pointer transition-all text-gray-600"
                          animate={{ rotate: chapter.collapsed ? -90 : 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.button>
                      <span className="font-semibold">
                        {chapterIndex + 1}
                        {chapter.chapterTitle}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      {chapter.chapterContent.length}Lectures
                    </span>
                    <motion.button
                      type="button"
                      onClick={() => handleChapter("remove", chapter.chapterId)}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full hover:bg-red-100 transition-colors"
                    >
                      <img
                        src={assets.cross_icon}
                        alt="cross_icon"
                        className="cursor-pointer w-4 h-4 text-red-500"
                      />
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {!chapter.collapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4">
                          <AnimatePresence>
                            {chapter.chapterContent.map(
                              (lecture, lectureIndex) => (
                                <motion.div
                                  key={lectureIndex}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  className="flex justify-between items-center mb-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                  <span>
                                    {lectureIndex + 1}. {lecture.lectureTitle} –{" "}
                                    {lecture.lectureDuration} mins
                                    {" - "}
                                    <a
                                      href={lecture.lectureUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 underline hover:text-blue-600"
                                    >
                                      Link
                                    </a>
                                    {" - "}
                                    {lecture.isPreviewFree
                                      ? "Free Preview"
                                      : "Paid"}
                                  </span>
                                  <motion.button
                                    type="button"
                                    onClick={() =>
                                      handleLecture(
                                        "remove",
                                        chapter.chapterId,
                                        lectureIndex
                                      )
                                    }
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-1 rounded-full hover:bg-red-100 transition-colors"
                                  >
                                    <img
                                      src={assets.cross_icon}
                                      alt="cross_icon"
                                      className="cursor-pointer w-4 h-4 text-red-500"
                                    />
                                  </motion.button>
                                </motion.div>
                              )
                            )}
                          </AnimatePresence>

                          <motion.div
                            onClick={() =>
                              handleLecture("add", chapter.chapterId)
                            }
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                          >
                            + Add Lectures
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              <motion.div
                onClick={() => handleChapter("add")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer hover:bg-blue-200 transition-all duration-300"
              >
                + Add chapter
              </motion.div>{" "}
              {showPopup && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm z-50"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 50 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="bg-white text-gray-700 p-4 rounded-2xl relative w-full max-w-md shadow-2xl"
                  >
                    <h2 className="text-lg font-semibold mb-4">Add Lectures</h2>
                    <div className="mb-2">
                      <p className="font-medium">Lecture Title</p>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-400 rounded py-1 px-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={lectureDetails.lectureTitle}
                        onChange={(e) =>
                          setLectureDetails({
                            ...lectureDetails,
                            lectureTitle: e.target.value,
                          })
                        }
                        placeholder="Enter lecture title"
                      />
                    </div>
                    <div className="mb-2">
                      <p className="font-medium">Duration (minutes)</p>
                      <input
                        type="number"
                        className="mt-1 block w-full border border-gray-400 rounded py-1 px-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={lectureDetails.lectureDuration}
                        onChange={(e) =>
                          setLectureDetails({
                            ...lectureDetails,
                            lectureDuration: e.target.value,
                          })
                        }
                        placeholder="Enter lecture Duration"
                      />
                    </div>
                    <div className="mb-2">
                      <p className="font-medium">Lecture Url</p>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-400 rounded py-1 px-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={lectureDetails.lectureUrl}
                        onChange={(e) =>
                          setLectureDetails({
                            ...lectureDetails,
                            lectureUrl: e.target.value,
                          })
                        }
                        placeholder="Enter lecture URL"
                      />
                    </div>
                    <div className="flex items-center gap-2 my-4">
                      <input
                        type="checkbox"
                        className="mt-1 scale-125 accent-blue-500 cursor-pointer"
                        checked={lectureDetails.isPreviewFree}
                        onChange={(e) =>
                          setLectureDetails({
                            ...lectureDetails,
                            isPreviewFree: e.target.checked,
                          })
                        }
                      />
                      <label className="text-gray-700 font-medium">
                        Is Preview Free?
                      </label>
                    </div>

                    <motion.button
                      type="button"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
                      onClick={addLecture}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Add
                    </motion.button>
                    <motion.button
                      type="button"
                      className="absolute top-4 right-4 w-6 h-6 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
                      onClick={() => setShowPopup(false)}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <img
                        className="w-4 h-4"
                        alt="Close"
                        src={assets.cross_icon}
                      />
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            variants={itemVariants}
            className="form-element flex justify-start pt-4"
          >
            <motion.button
              className="bg-black text-white w-max py-2.5 px-8 rounded my-4 hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};

export default AddCourse;
