import express from "express";
import { validation } from "../../middleware/validation.js";
import { protectedRoutes } from "../../middleware/protectedRoutes.js";
import { checkAccount } from "../../middleware/checkExist.js";
import { addAccount, deleteAccount, getAllAccounts, getSingleAccount, updateAccount } from "./account.controller.js";
import { addAccountVal, paramsIdVal, updateAccountVal } from "./account.validation.js";

const accountRouter = express.Router();

accountRouter.route("/")
.post(protectedRoutes,validation(addAccountVal),checkAccount,addAccount)
.get(protectedRoutes,getAllAccounts)

accountRouter.route("/:id")
.put(protectedRoutes,validation(updateAccountVal),updateAccount)
.get(protectedRoutes,validation(paramsIdVal),getSingleAccount)
.delete(protectedRoutes,validation(paramsIdVal),deleteAccount)

export default accountRouter;
