
import { userModel } from "../../database/models/user.model.js";
import { labelModel } from "../../database/models/label.model.js";
import { AppError } from "../utils/appError.js";
import { accountModel } from "../../database/models/account.model.js";




export const checkEmail = async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });

  if (user) return next(new AppError("email already exists",409))


  next()
}

export const checkResetEmail = async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });

  if (!user) return next(new AppError("email is not found",409))


  next()
}


export const checkLabel = async (req, res, next) => {
  let user = await labelModel.findOne({ name: req.body.name });

  if (user) return next(new AppError("label name already exists",409))


  next()
}


export const checkAccount = async (req, res, next) => {
  let user = await accountModel.findOne({ name: req.body.name });

  if (user) return next(new AppError("account name already exists",409))


  next()
}