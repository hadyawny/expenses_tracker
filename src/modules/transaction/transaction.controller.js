import { accountModel } from "../../../database/models/account.model.js";
import { transactionModel } from "../../../database/models/transaction.model.js";
import { catchError } from "../../middleware/catchError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";

const addTransaction = catchError(async (req, res, next) => {
  req.body.user = req.user._id;
  let transaction = new transactionModel(req.body);
  await transaction.save();

  if (req.body.type == "income") {
    await accountModel.findByIdAndUpdate(req.body.account, {
      $inc: { currentBalance: req.body.amount },
    });
  } else if (req.body.type == "expense") {
    await accountModel.findByIdAndUpdate(req.body.account, {
      $inc: { currentBalance: -req.body.amount },
    });
  }

  res.json({ message: "success", transaction });
});

const getAllTransactions = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(
    transactionModel.find({ user: req.user._id }),
    req.query
  )
    .fields()
    .filter()
    .pagination()
    .search()
    .sort();

  let transactions = await apiFeatures.mongooseQuery;

  !transactions && res.status(404).json({ message: "transactions not found" });
  transactions &&
    res.json({
      message: "success",
      page: apiFeatures.pageNumber,
      transactions,
    });
});

const updateTransaction = catchError(async (req, res, next) => {
  // Find the original transaction
  const originalTransaction = await transactionModel.findOne({
    user: req.user._id,
    _id: req.params.id,
  });

  // Check if the original transaction exists
  if (!originalTransaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  // Update the transaction with the new data
  let updatedTransaction = await transactionModel.findOneAndUpdate(
    { user: req.user._id, _id: req.params.id },
    req.body,
    { new: true }
  );

  // Calculate the amount difference based on the original and updated transaction types
  let amountDifference = 0;
  if (
    originalTransaction.type === "income" &&
    updatedTransaction.type === "expense"
  ) {
    // If changing from income to expense, subtract the full amount
    amountDifference = -originalTransaction.amount - updatedTransaction.amount;
  } else if (
    originalTransaction.type === "expense" &&
    updatedTransaction.type === "income"
  ) {
    // If changing from expense to income, add the full amount
    amountDifference = originalTransaction.amount + updatedTransaction.amount;
  } else if (
    originalTransaction.type === "income" &&
    updatedTransaction.type === "income"
  ) {
    // For same type income , calculate the difference
    amountDifference = updatedTransaction.amount - originalTransaction.amount;
  } else if (
    originalTransaction.type === "expense" &&
    updatedTransaction.type === "expense"
  ) {
    // For same type expense , calculate the difference
    amountDifference = originalTransaction.amount - updatedTransaction.amount;
  }

  // Update the current balance of the associated account
  await accountModel.findByIdAndUpdate(
    updatedTransaction.account,
    { $inc: { currentBalance: amountDifference } } // Adjust balance based on the amount difference
  );

  res.json({ message: "Success", transaction: updatedTransaction });
});

const getSingleTransaction = catchError(async (req, res, next) => {
  let transaction = await transactionModel.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  !transaction && res.status(404).json({ message: "transaction not found" });
  transaction && res.json({ message: "success", transaction });
});

const deleteTransaction = catchError(async (req, res, next) => {
  let transaction = await transactionModel.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  !transaction && res.status(404).json({ message: "transaction not found" });
  transaction && res.json({ message: "success", transaction });
});

export { addTransaction, getAllTransactions, updateTransaction,getSingleTransaction ,deleteTransaction};
