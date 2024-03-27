import express from "express";
import { validation } from "../../middleware/validation.js";
import { protectedRoutes } from "../../middleware/protectedRoutes.js";
import { addTransactionVal, paramsIdVal, updateTransactionVal } from "./transaction.validation.js";
import { addTransaction, deleteTransaction, getAllTransactions, getSingleTransaction, updateTransaction } from "./transaction.controller.js";

const transactionRouter = express.Router();

transactionRouter.route("/")
.post(protectedRoutes,validation(addTransactionVal),addTransaction)
.get(protectedRoutes,getAllTransactions)



transactionRouter.route("/:id")
.put(protectedRoutes,validation(updateTransactionVal),updateTransaction)
.get(protectedRoutes,validation(paramsIdVal),getSingleTransaction)
.delete(protectedRoutes,validation(paramsIdVal),deleteTransaction)

export default transactionRouter;


