import express from "express";
import { validation } from "../../middleware/validation.js";
import { protectedRoutes } from "../../middleware/protectedRoutes.js";
import { addBudgetVal, paramsIdVal, updateBudgetVal } from "./budget.validation.js";
import { addBudget, deleteBudget, getAllBudgets, getSingleBudget, updateBudget } from "./budget.controller.js";


const budgetRouter = express.Router();

budgetRouter
  .route("/")
  .post(protectedRoutes, validation(addBudgetVal), addBudget)
  .get(protectedRoutes, getAllBudgets);

budgetRouter
  .route("/:id")
  .put(protectedRoutes, validation(updateBudgetVal), updateBudget)
  .get(protectedRoutes, validation(paramsIdVal), getSingleBudget)
  .delete(protectedRoutes, validation(paramsIdVal), deleteBudget);

export default budgetRouter;
