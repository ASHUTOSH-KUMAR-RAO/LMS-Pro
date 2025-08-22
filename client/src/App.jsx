
import { Route, Routes } from "react-router-dom";
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

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input" element={<CourseList />} />
        <Route path="/course/:id" element={<CoourseDetails />} />
        <Route path="/my-enrollments" element={<Enrollment />} />
        <Route path="/player/courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />
        <Route path="/educator" element={<Educator/>}>
        {/* "Parent route = layout wrapper, Child routes = content inside layout, URLs automatically merge ho jate hain! */}
        <Route path="educator" element={<Dashboard/>}/>
        <Route path="add-course" element={<AddCourse/>}/>
        <Route path="my-course" element={<MyCourses/>}/>
        <Route path="student-enrolled" element={<StudentEnrolled/>}/>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
