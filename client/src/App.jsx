import { Route, Routes, useMatch } from "react-router-dom";
import Home from "./pages/students/home";
import CourseList from "./pages/students/courses-list";
import CoourseDetails from "./pages/students/course-details";
import Enrollment from "./pages/students/my-enrollment";
import Player from "./pages/students/player";
import Loading from "./components/students/loading";
import Educator from "./pages/educator/educator";
import Dashboard from "./pages/educator/dashboard";
import AddCourse from "./pages/educator/add-course";
import MyCourses from "./pages/educator/my-courses";
import StudentEnrolled from "./pages/educator/students-enrolled";
import Navbar from "./components/students/Navbar";

import {ToastContainer,toast} from "react-toastify"
import "quill/dist/quill.snow.css"

const App = () => {
  const isEducatorRoute = useMatch("/educator/*");

  return (
    <div className="text-base min-h-screen bg-white">
    <ToastContainer/>
      {!isEducatorRoute && <Navbar />}

      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input" element={<CourseList />} />
        <Route path="/course/:id" element={<CoourseDetails />} />
        <Route path="/my-enrollments" element={<Enrollment />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />

        {/* Educator Routes - Fixed Structure */}
        <Route path="/educator" element={<Educator />}>
          {/* Index route - shows Dashboard when URL is exactly /educator */}
          <Route index element={<Dashboard />} />

          {/* Child routes - relative paths */}
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentEnrolled />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
