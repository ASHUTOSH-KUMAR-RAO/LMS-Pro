import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Fetching all Courses

  const fetchAllCourse = async () => {
    setAllCourses(dummyCourses);
  };

  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }

    let totaoRAting = 0;
    course.courseRatings.forEach((rating) => {
      totaoRAting += rating.rating;
    });

    return totaoRAting / course.courseRatings.length;
  };
  // Fnction For Calculating Course Chapter time

  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Function For Calculating the total Duration:-

  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    // todo=> Jaab bhi hum humanizeDuration ki baat kerte hai then iska mtlb hota hai ki ,by default time rwa ke form mein deta hai that means (400000 millisecond,45000 second,400 minutes),then isi chij ko remove krne ke liye hum humanizeDuration ka use krte hai ye isese kya hota hai raw ke form mein n convert ho ker simple 1h34m30s aise ho jata hai jisko hum easly read kr sekte hai aur ye ek package hai jisko hume install krna padta hai {npm i humanize-duration}
  };

  // How To Calculating Number of lecture in a Course

  const calculateNoOfLecture = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };
  const fetchUserEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses);
  };
  useEffect(() => {
    fetchAllCourse();
    fetchUserEnrolledCourses();
  }, []);

  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();

  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLecture,
    enrolledCourses,
    fetchUserEnrolledCourses
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
