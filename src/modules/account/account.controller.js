import { accountModel } from "../../../database/models/account.model.js";
import { userModel } from "../../../database/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";

const addAccount = catchError(async (req, res, next) => {
  req.body.user = req.user._id;
  let account = new accountModel(req.body);
  await account.save();

  let user = await userModel.findByIdAndUpdate(req.user._id, {
    $push: { accountsList: account._id },
  });

  res.json({ message: "success", account ,user});
});

const updateAccount = catchError(async (req, res, next) => {
  let account = await accountModel.findOneAndUpdate(
    { user: req.user._id, _id: req.params.id },
    req.body,
    { new: true }
  );
  !account && res.status(404).json({ message: "account not found" });
  account && res.json({ message: "success", account });
});

const getAllAccounts = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(
    accountModel.find({ user: req.user._id }),
    req.query
  )
    .fields()
    .filter()
    .pagination()
    .search()
    .sort();

  let accounts = await apiFeatures.mongooseQuery;

  !accounts && res.status(404).json({ message: "accounts not found" });
  accounts &&
    res.json({ message: "success", page: apiFeatures.pageNumber, accounts });
});

const getSingleAccount = catchError(async (req, res, next) => {
  let account = await accountModel.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  !account && res.status(404).json({ message: "account not found" });
  account && res.json({ message: "success", account });
});

const deleteAccount = catchError(async (req, res, next) => {
  let account = await accountModel.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  let user = await userModel.findByIdAndUpdate(req.user._id, {
    $pull: { accountsList: req.params.id },
  });

  !account && res.status(404).json({ message: "account not found" });
  account && res.json({ message: "success", account });
});

const getTotalBalance = catchError(async (req, res, next) => {
  let balance = 0;

  let accountsList = await accountModel.find({ user: req.user._id });
  for (let i = 0; i < accountsList.length; i++) {
    balance += accountsList[i].currentBalance;
  }

  res.json({ message: "success", "Total Balance": balance });
});

const transferBalance = catchError(async (req, res, next) => {
  let fromAccount = await accountModel.findOneAndUpdate(
    { _id: req.body.fromAccount, user: req.user._id },
    { $inc: { currentBalance: -req.body.amount } }
  );
  if (!fromAccount) {
    return res.status(404).json({ message: "fromAccount not found" });
  }

  let toAccount = await accountModel.findOneAndUpdate(
    { _id: req.body.toAccount, user: req.user._id },
    { $inc: { currentBalance: req.body.amount } }
  );
  if (!toAccount) {
    return res.status(404).json({ message: "toAccount not found" });
  }

  res.json({ message: "success", fromAccount, toAccount });
});

export {
  addAccount,
  getAllAccounts,
  getSingleAccount,
  deleteAccount,
  updateAccount,
  getTotalBalance,
  transferBalance,
};
