import jwt from "jsonwebtoken";
import { userModel } from "../../../database/models/user.model.js";
import bcrypt from "bcrypt";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";

const addUser = catchError(async (req, res, next) => {
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

export {
  addUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  changePassword,
  signin,
};
