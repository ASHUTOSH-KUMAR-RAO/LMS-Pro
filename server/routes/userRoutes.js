import express from "express";

import {
  userEnrolledCourses,
  getUserData,
  purchaseCourse,
} from "../controllers/userContoller.js";

const userRouter = express.Router();

userRouter.get("/data", getUserData);
userRouter.get("/enrolled-courses", userEnrolledCourses);
userRouter.post("/purchase", purchaseCourse);

export default userRouter;
