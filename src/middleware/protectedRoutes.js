import { userModel } from "../../database/models/user.model.js";
import { AppError } from "../utils/appError.js";
import { catchError } from "./catchError.js";
import jwt from "jsonwebtoken";


export const protectedRoutes = catchError(async (req, res, next) => {
    let { token } = req.headers;
    if (!token) return next(new AppError("token is not provided", 401));
  
    let decoded = jwt.verify(token, process.env.JWT_KEY);
    let user = await userModel.findById(decoded.userId);
    if (!user) return next(new AppError("user is not found", 401));
  
    if (user.passwordChangedAt) {
      let time = parseInt(user.passwordChangedAt.getTime() / 1000);
      if (time > decoded.iat)
        return next(new AppError("invalid token log in again", 401));
    }
  
    req.user = user;
  
    next();
  });