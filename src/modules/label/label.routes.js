import express from "express";
import { validation } from "../../middleware/validation.js";
import { protectedRoutes } from "../../middleware/protectedRoutes.js";
import { addLabelVal,paramsIdVal, updateLabelVal } from "./label.validation.js";
import { addLabel, deleteLabel, getAllLabels, getSingleLabel, updateLabel } from "./label.controller.js";
import { checkEmail } from "../../middleware/checkExist.js";

const labelRouter = express.Router();

labelRouter.route("/")
.post(protectedRoutes,validation(addLabelVal),checkEmail,addLabel)
.get(protectedRoutes,getAllLabels)

labelRouter.route("/:id")
.put(protectedRoutes,validation(updateLabelVal),updateLabel)
.get(protectedRoutes,validation(paramsIdVal),getSingleLabel)
.delete(protectedRoutes,validation(paramsIdVal),deleteLabel)

export default labelRouter;
