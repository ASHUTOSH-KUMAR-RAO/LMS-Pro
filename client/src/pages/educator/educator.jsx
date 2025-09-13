import { Outlet } from "react-router-dom";
import Navbar from "../../components/educator/navbar";
import Sidebar from "../../components/educator/sidebar";
import Footer from "../../components/students/footer";

const Educator = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Main content area - flex-1 ensures it takes remaining space */}
      <div className="flex flex-1">
        <Sidebar />

        {/* Content area */}
        <div className="flex-1 flex flex-col">
          {/* Outlet content - flex-1 to push footer down */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Footer - Will stick to bottom naturally */}
      <Footer/>
    </div>
  );
};

export default Educator;
