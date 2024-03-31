import jwt from "jsonwebtoken";
import { userModel } from "../../../database/models/user.model.js";
import bcrypt from "bcrypt";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import {
  sendResetPassword,
  sendVerifyEmail,
} from "../../services/emails/sendEmails.js";
import otpGenerator from "otp-generator";

const addUser = catchError(async (req, res, next) => {
  sendVerifyEmail(req.body.email);

  let user = new userModel(req.body);
  await user.save();
  let token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_KEY
  );
  res.json({
    message: "success",
    user: { name: user.name, email: user.email, token: token },
  });
});

const signin = catchError(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    let token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_KEY
    );
    return res.json({ message: "success", token });
  }

  next(new AppError("incorrect email or password", 401));
});

const changePassword = catchError(async (req, res, next) => {
  let user = await userModel.findById(req.user._id);
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    let token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_KEY
    );
    await userModel.findByIdAndUpdate(req.user._id, {
      password: req.body.newPassword,
      passwordChangedAt: Date.now(),
    });
    return res.json({ message: "success", token });
  }

  next(new AppError("incorrect email or password", 401));
});

const updateUser = catchError(async (req, res, next) => {
  let user = await userModel.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });
  !user && res.status(404).json({ message: "user not found" });
  user && res.json({ message: "success", user });
});

const getAllUsers = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(userModel.find(), req.query)
    .fields()
    .filter()
    .pagination()
    .search()
    .sort();

  let users = await apiFeatures.mongooseQuery;

  !users && res.status(404).json({ message: "users not found" });
  users &&
    res.json({ message: "success", page: apiFeatures.pageNumber, users });
});

const getSingleUser = catchError(async (req, res, next) => {
  let user = await userModel.findById(req.params.id);
  !user && res.status(404).json({ message: "user not found" });
  user && res.json({ message: "success", user });
});

const deleteUser = catchError(async (req, res, next) => {
  let user = await userModel.findOneAndDelete(req.user._id);
  !user && res.status(404).json({ message: "user not found" });
  user && res.json({ message: "success", user });
});

const verifyEmail = catchError(async (req, res, next) => {
  
  let verifyEmail = jwt.verify(
    req.params.token,
    process.env.EMAIL_KEY
  ).email;

  if (verifyEmail) {
    await userModel.findOneAndUpdate(
      { email: verifyEmail },
      { confirmEmail: true }
    );
    res.json({ message: "Success" });
  } else {
    next(new AppError("invalid token", 401));
  }
});

const forgotPassword = catchError(async (req, res, next) => {
  const generatedOtp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  let user = await userModel.findOneAndUpdate(
    { email: req.body.email },
    {
      otp: generatedOtp,
    }
  );
  if (user) {
    sendResetPassword(user.email, generatedOtp);
    res.json({ message: "Success" });
  } else {
    next(new AppError("email not found", 401));
  }
});

const resetPassword = catchError(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });

  if (user.otp === req.body.otp) {
    await userModel.findOneAndUpdate(
      { email: req.body.email },
      { password: req.body.password, otp: "" }
    );
    res.json({ message: "successfully changed password " });
  } else {
    res.status(404).json({ message: "otp is wrong" });
  }
});

export {
  addUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  changePassword,
  signin,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
