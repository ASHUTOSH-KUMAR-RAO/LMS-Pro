import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);

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

  useEffect(() => {
    fetchAllCourse();
  }, []);
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();

  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
