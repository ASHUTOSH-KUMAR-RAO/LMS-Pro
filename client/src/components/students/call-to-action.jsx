
import {assets} from "../../assets/assets"

const CallToAction = () => {
  return (
    <div className="flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0">
     <h1 className="text-xl md:text-4xl">Learn Anything, Anytime, Anywhere</h1>
        <p className="text-gray-500 sm:text-sm">
            Unlock your potential with flexible, accessible education designed for the modern learner. 
            Break free from traditional constraints and embrace a personalized learning journey that adapts to your schedule, pace, and goals.
        </p>
        <div className="flex items-center font-medium gap-6 mt-4">
          <button className="px-10 py-3 rounded-md text-white bg-cyan-400/30 hover:bg-blue-600 hover:cursor-pointer">Get Started</button>
          <button className="flex items-center gap-2">Learn More <img src={assets.arrow_icon} alt="arrow_icon"/></button>
        </div>
    </div>
  );
};

export default CallToAction;
