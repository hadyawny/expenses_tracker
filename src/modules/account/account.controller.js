import { accountModel } from "../../../database/models/account.model.js";
import { userModel } from "../../../database/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";

const addAccount = catchError(async (req, res, next) => {
  req.body.user = req.user._id;
  let account = new accountModel(req.body);
  await account.save();

  let user = await userModel.findByIdAndUpdate(req.user._id,{$push:{accountsList:account._id}});


  res.json({ message: "success", account });
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

  let user = await userModel.findByIdAndUpdate(req.user._id,{$pull:{accountsList:req.params.id}});


  !account && res.status(404).json({ message: "account not found" });
  account && res.json({ message: "success", account });
});

export { addAccount, getAllAccounts, getSingleAccount, deleteAccount, updateAccount };
