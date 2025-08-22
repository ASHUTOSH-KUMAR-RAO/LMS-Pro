import { Outlet } from "react-router-dom";

const Educator = () => {
  return (
    <div>
      <h1>Educator</h1>

      {/* Outlet ek placeholder hai jo parent component mein child routes ko render karne ke liye use hota hai,Bina Outlet ke nested routing incomplete hai! 👀 */}

      {/* parent ka mtlb to yehi hua ki haar page per rander hoga aur ye pehle rander hoga, phir iske baad diffrent-diffrent route per diffrent- diffrent child rander honge  aise hi  treat krta hai outlet child ke sath means parent route child route ke sath,kyuki Outlet child routes ko parent ke andar treat krta hai 😒 */}

      {/* Aur pta hai jiss component ke andar hum outlet ko rander krte ye usi component ko parent component samjh leta hai ,jaise ki maine Educator ke andar rander kiya hai to ye isko parent samjh liya ,same as yedi main student-enrolled ke andar outlet ko rander krta to ye isko parent samjh leta 👉*/}

      <div>{<Outlet />}</div>
    </div>
  );
};

export default Educator;
