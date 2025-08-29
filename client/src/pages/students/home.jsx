import CallToAction from "../../components/students/call-to-action"
import Companies from "../../components/students/companies"
import CoursesSection from "../../components/students/course-section"
import Footer from "../../components/students/footer"
import Hero from "../../components/students/Hero"
import Testimonials from "../../components/students/testimonials"

const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-6 text-center">
      <Hero/>
      <Companies/>
      <CoursesSection/>
      <Testimonials/>
      <CallToAction/>
      <Footer/>
    </div>
  )
}

export default Home