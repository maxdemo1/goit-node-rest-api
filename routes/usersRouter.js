import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getUserData,
  updateSubscription,
} from "../controllers/usersController/usersController.js";
import {
  UserDataValidation,
  subscriptionTypeValidation,
} from "../middlewares/userValidationMiddleware.js";
import { checkToken } from "../middlewares/checkTokenMiddleware.js";

const usersRouter = express.Router();

usersRouter.post("/register", UserDataValidation, registerUser);
usersRouter.post("/login", UserDataValidation, loginUser);
usersRouter.post("/logout", checkToken, logoutUser);
usersRouter.get("/current", checkToken, getUserData);
usersRouter.patch(
  "/",
  subscriptionTypeValidation,
  checkToken,
  updateSubscription
);

export default usersRouter;
