import { accountModel } from "../../../database/models/account.model.js";
import { transactionModel } from "../../../database/models/transaction.model.js";
import { catchError } from "../../middleware/catchError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";

const addTransaction = catchError(async (req, res, next) => {

  req.body.user = req.user._id;
  let transaction = new transactionModel(req.body);
  await transaction.save();

  if(req.body.type == "income"){

    await accountModel.findByIdAndUpdate(req.body.account,{$inc: { currentBalance: req.body.amount }})


  }
  else if(req.body.type == "expense"){
    await accountModel.findByIdAndUpdate(req.body.account,{$inc: { currentBalance: -req.body.amount }})
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
    res.json({ message: "success", page: apiFeatures.pageNumber, transactions });
});

// const updateTransaction = catchError(async (req, res, next) => {
//   let transaction = await transactionModel.findOneAndUpdate(
//     { user: req.user._id, _id: req.params.id },
//     req.body,
//     { new: true }
//   );
//   !transaction && res.status(404).json({ message: "transaction not found" });
//   transaction && res.json({ message: "success", transaction });
// });



// const getSingleTransaction = catchError(async (req, res, next) => {
//   let transaction = await transactionModel.findOne({
//     _id: req.params.id,
//     user: req.user._id,
//   });
//   !transaction && res.status(404).json({ message: "transaction not found" });
//   transaction && res.json({ message: "success", transaction });
// });

// const deleteTransaction = catchError(async (req, res, next) => {
//   let transaction = await transactionModel.findOneAndDelete({
//     _id: req.params.id,
//     user: req.user._id,
//   });



//   !transaction && res.status(404).json({ message: "transaction not found" });
//   transaction && res.json({ message: "success", transaction });
// });

export { addTransaction ,getAllTransactions};
