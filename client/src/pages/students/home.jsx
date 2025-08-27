import Companies from "../../components/students/companies"
import CoursesSection from "../../components/students/course-section"
import Hero from "../../components/students/Hero"

const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-6 text-center">
      <Hero/>
      <Companies/>
      <CoursesSection/>
    </div>
  )
}

export default Home