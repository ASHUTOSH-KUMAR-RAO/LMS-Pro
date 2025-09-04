import { useContext, useState } from "react";
import { AppContext } from "../../context/app-context";
import { Line } from "rc-progress";
import Footer from "../../components/students/footer";
import { Play, Clock, Trophy, TrendingUp, BookOpen } from "lucide-react";

const Enrollment = () => {
  const { enrolledCourses, calculateCourseDuration, navigate } = useContext(AppContext);
  
  // Extended dummy data for progress
  const [progressArray, setProgressArray] = useState([
    { lectureCompleted: 2, totalLectures: 4 },
    { lectureCompleted: 8, totalLectures: 12 },
    { lectureCompleted: 15, totalLectures: 20 },
    { lectureCompleted: 6, totalLectures: 8 },
    { lectureCompleted: 12, totalLectures: 12 },
    { lectureCompleted: 3, totalLectures: 16 },
    { lectureCompleted: 9, totalLectures: 14 },
    { lectureCompleted: 5, totalLectures: 7 },
  ]);

  const [hoveredRow, setHoveredRow] = useState(null);

  const getProgressPercentage = (index) => {
    return progressArray[index]
      ? (progressArray[index].lectureCompleted * 100) / progressArray[index].totalLectures
      : 0;
  };

  const getStatusColor = (percentage) => {
    if (percentage === 100) return "bg-green-500 hover:bg-green-600";
    if (percentage >= 50) return "bg-blue-500 hover:bg-blue-600";
    return "bg-orange-500 hover:bg-orange-600";
  };

  const getStatusText = (index) => {
    const percentage = getProgressPercentage(index);
    if (percentage === 100) return "Completed";
    if (percentage >= 50) return "In Progress";
    return "Just Started";
  };

  return (
    <>
      <div className="md:px-26 px-8 pt-10 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        {/* Modern Header with gradient */}
        <div className="relative mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Learning Environment
          </h1>
          <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-800">{enrolledCourses.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-800">
                  {progressArray.filter(p => (p.lectureCompleted / p.totalLectures) === 1).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-800">
                  {progressArray.filter(p => (p.lectureCompleted / p.totalLectures) < 1 && p.lectureCompleted > 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Table with glassmorphism */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md">
                <tr className="border-b border-white/20">
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 max-sm:hidden">Course</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 max-sm:hidden">Duration</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 max-sm:hidden">Progress</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {enrolledCourses.map((course, index) => (
                  <tr 
                    key={index}
                    className={`border-b border-white/10 transition-all duration-300 hover:bg-white/40 hover:scale-[1.01] hover:shadow-lg ${
                      hoveredRow === index ? 'bg-gradient-to-r from-blue-50/50 to-purple-50/50' : ''
                    }`}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="md:px-6 px-4 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative group">
                          <img
                            src={course.courseThumbnail}
                            className="w-16 sm:w-20 md:w-24 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                            alt={course.courseTitle}
                          />
                          <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 mb-2 max-sm:text-sm truncate">
                            {course.courseTitle}
                          </p>
                          {/* Enhanced Progress Bar */}
                          <div className="relative">
                            <div className="bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                                style={{ width: `${getProgressPercentage(index)}%` }}
                              >
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                              </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>{getProgressPercentage(index).toFixed(0)}% Complete</span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>2-3 hrs remaining</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 max-sm:hidden">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{calculateCourseDuration(course)}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 max-sm:hidden">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">
                          {progressArray[index] && 
                            `${progressArray[index].lectureCompleted}/${progressArray[index].totalLectures}`
                          }
                        </div>
                        <div className="text-sm text-gray-500">Lectures</div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 max-sm:text-right">
                      <button
                        onClick={() => navigate("/player/" + course._id)}
                        className={`
                          relative overflow-hidden px-6 py-3 rounded-2xl text-white font-semibold
                          transform transition-all duration-300 hover:scale-105 hover:shadow-lg
                          ${getStatusColor(getProgressPercentage(index))}
                          before:absolute before:top-0 before:left-0 before:w-full before:h-full
                          before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
                          before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
                          max-sm:text-xs max-sm:px-4 max-sm:py-2
                        `}
                      >
                        <span className="relative z-10 flex items-center space-x-2">
                          {getProgressPercentage(index) === 100 ? (
                            <>
                              <Trophy className="w-4 h-4" />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              <span>{getStatusText(index)}</span>
                            </>
                          )}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/25 transform hover:scale-110 transition-all duration-300">
            <TrendingUp className="w-6 h-6" />
          </button>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Enrollment;