import express from "express";
import { validation } from "../../middleware/validation.js";
import {
  addUser,
  changePassword,
  deleteUser,
  forgotPassword,
  getAllUsers,
  getSingleUser,
  resetPassword,
  signin,
  updateUser,
  verifyEmail,
} from "./user.controller.js";
import {
  addUserVal,
  changePasswordVal,
  forgotPasswordVal,
  paramsIdVal,
  resetPasswordVal,
  signinSchemaVal,
  updateUserVal,
} from "./user.validation.js";
import { checkEmail, checkResetEmail } from "../../middleware/checkExist.js";
import { protectedRoutes } from "../../middleware/protectedRoutes.js";

const userRouter = express.Router();

userRouter
  .route("/")
  .post(validation(addUserVal), checkEmail, addUser)
  .get(protectedRoutes, getAllUsers)
  .put(protectedRoutes, validation(updateUserVal), updateUser)
  .delete(protectedRoutes, deleteUser);

userRouter.post("/signin", validation(signinSchemaVal), signin);
userRouter.patch(
  "/changepassword/",
  protectedRoutes,
  validation(changePasswordVal),
  changePassword
);

userRouter.get("/verifyEmail/:token", verifyEmail);
userRouter.put(
  "/forgotPassword",
  validation(forgotPasswordVal),
  checkResetEmail,
  forgotPassword
);
userRouter.put(
  "/resetPassword",
  validation(resetPasswordVal),
  checkResetEmail,
  resetPassword
);

userRouter
  .route("/:id")
  .get(protectedRoutes, validation(paramsIdVal), getSingleUser);

export default userRouter;
