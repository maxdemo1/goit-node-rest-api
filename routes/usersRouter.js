import express from "express";
import { registerUserSchema } from "../schemas/usersValidationSchema.js";
import { registerUser } from "../controllers/usersController/usersController.js";
import validateBody from "../helpers/validateBody.js";

const registerUserValidation = validateBody(registerUserSchema);

const usersRouter = express.Router();

usersRouter.post("/register", registerUserValidation, registerUser);

export default usersRouter;
