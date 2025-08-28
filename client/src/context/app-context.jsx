import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

  const [allCourses,setAllCourses] = useState([])

  // Fetching all Courses

  const fetchAllCourse = async()=>{
    setAllCourses(dummyCourses)
  }

  useEffect(()=>{
    fetchAllCourse()
  },[])
  const currency = import.meta.env.VITE_CURRENCY

    const value = {
        currency,allCourses
    }
  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
