import express from "express";
import { validation } from "../../middleware/validation.js";
import { protectedRoutes } from "../../middleware/protectedRoutes.js";
import { addTransactionVal } from "./transaction.validation.js";
import { addTransaction, getAllTransactions } from "./transaction.controller.js";

const transactionRouter = express.Router();

transactionRouter.route("/")
.post(protectedRoutes,validation(addTransactionVal),addTransaction)
.get(protectedRoutes,getAllTransactions)



// transactionRouter.route("/:id")
// .put(protectedRoutes,validation(updateAccountVal),updateAccount)
// .get(protectedRoutes,validation(paramsIdVal),getSingleAccount)
// .delete(protectedRoutes,validation(paramsIdVal),deleteAccount)

export default transactionRouter;
