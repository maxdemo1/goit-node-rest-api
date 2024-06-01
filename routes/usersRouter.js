import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getUserData,
  updateSubscription,
  setNewAvatar,
} from "../controllers/usersController/usersController.js";
import {
  UserDataValidation,
  subscriptionTypeValidation,
} from "../middlewares/userValidationMiddleware.js";
import { checkToken } from "../middlewares/checkTokenMiddleware.js";
import uploadAvatars from "../middlewares/uploadAvatars.js";

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
usersRouter.patch(
  "/avatar",
  checkToken,
  uploadAvatars.single("avatar"),
  setNewAvatar
);

export default usersRouter;
