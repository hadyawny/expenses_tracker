import { catchError } from "../../middleware/catchError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { budgetModel } from "../../../database/models/budget.model.js";
import moment from "moment";
import { transactionModel } from "../../../database/models/transaction.model.js";
import { userModel } from "../../../database/models/user.model.js";

const addBudget = catchError(async (req, res, next) => {
  req.body.user = req.user._id;

  if (req.body.period === "weekly") {
    req.body.startDate = moment().startOf("week").format("YYYY-MM-DD");
    req.body.endDate = moment().endOf("week").format("YYYY-MM-DD");
  } else if (req.body.period === "monthly") {
    req.body.startDate = moment().startOf("month").format("YYYY-MM-DD");
    req.body.endDate = moment().endOf("month").format("YYYY-MM-DD");
  } else if (req.body.period === "yearly") {
    req.body.startDate = moment().startOf("year").format("YYYY-MM-DD");
    req.body.endDate = moment().endOf("year").format("YYYY-MM-DD");
  } else if (
    req.body.period === "one time" &&
    (!req.body.startDate || !req.body.endDate)
  ) {
    return res.status(404).json({
      message: "Please enter start and end Dates or choose another period",
    });
  }

  let budget = new budgetModel(req.body);
  await budget.save();

  let user = await userModel.findByIdAndUpdate(req.user._id, {
    $push: { budgetsList: budget._id },
  });

  for (let i = 0; i < budget.accounts.length; i++) {
    let transactions = await transactionModel.find({
      user: req.user._id,
      account: budget.accounts[i],
      type: "expense",
      date: {
        $gte: budget.startDate,
        $lte: budget.endDate,
      },
    });

    for (let j = 0; j < transactions.length; j++) {
      await budgetModel.findByIdAndUpdate(budget._id, {
        $inc: { amountSpent: transactions[j].amount },
      });
    }
  }
  budget= await budgetModel.findOne({user: req.user._id, _id: budget._id });

  res.json({ message: "success", budget,user });
});

const updateBudget = catchError(async (req, res, next) => {
  let budget = await budgetModel.findOneAndUpdate(
    { user: req.user._id, _id: req.params.id },
    req.body,
    { new: true }
  );

  if (req.body.accounts) {
    await budgetModel.findByIdAndUpdate(budget._id, { amountSpent: 0 });
    for (let i = 0; i < budget.accounts.length; i++) {
      let transactions = await transactionModel.find({
        user: req.user._id,
        account: budget.accounts[i],
        type: "expense",
        date: {
          $gte: budget.startDate,
          $lte: budget.endDate,
        },
      });

      for (let j = 0; j < transactions.length; j++) {
        await budgetModel.findByIdAndUpdate(budget._id, {
          $inc: { amountSpent: transactions[j].amount },
        });
      }
    }

    budget= await budgetModel.findOne({user: req.user._id, _id: req.params.id });
  }

  !budget && res.status(404).json({ message: "budget not found" });
  budget && res.json({ message: "success", budget });
});

const getAllBudgets = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(
    budgetModel.find({ user: req.user._id }),
    req.query
  )
    .fields()
    .filter()
    .pagination()
    .search()
    .sort();

  let budgets = await apiFeatures.mongooseQuery;

  if (budgets) {
    for (let n = 0; n < budgets.length; n++) {
      await budgetModel.findByIdAndUpdate(budgets[n]._id, { amountSpent: 0 });
      for (let i = 0; i < budgets[n].accounts.length; i++) {
        let transactions = await transactionModel.find({
          user: req.user._id,
          account: budgets[n].accounts[i],
          type: "expense",
          date: {
            $gte: budgets[n].startDate,
            $lte: budgets[n].endDate,
          },
        });

        for (let j = 0; j < transactions.length; j++) {
          await budgetModel.findByIdAndUpdate(budgets[n]._id, {
            $inc: { amountSpent: transactions[j].amount },
          });
        }
      }
    }
    apiFeatures = new ApiFeatures(
      budgetModel.find({ user: req.user._id }),
      req.query
    )
      .fields()
      .filter()
      .pagination()
      .search()
      .sort();
  
    budgets = await apiFeatures.mongooseQuery;
  }
  
  !budgets && res.status(404).json({ message: "budgets not found" });
  budgets &&
    res.json({ message: "success", page: apiFeatures.pageNumber, budgets });
});

const getSingleBudget = catchError(async (req, res, next) => {
  let budget = await budgetModel.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (budget.accounts) {
    await budgetModel.findByIdAndUpdate(budget._id, { amountSpent: 0 });
    for (let i = 0; i < budget.accounts.length; i++) {
      let transactions = await transactionModel.find({
        user: req.user._id,
        account: budget.accounts[i],
        type: "expense",
        date: {
          $gte: budget.startDate,
          $lte: budget.endDate,
        },
      });

      for (let j = 0; j < transactions.length; j++) {
        await budgetModel.findByIdAndUpdate(budget._id, {
          $inc: { amountSpent: transactions[j].amount },
        });
      }
    }
    budget = await budgetModel.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
  }
  !budget && res.status(404).json({ message: "budget not found" });
  budget && res.json({ message: "success", budget });
});

const deleteBudget = catchError(async (req, res, next) => {
  let budget = await budgetModel.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  let user = await userModel.findByIdAndUpdate(req.user._id, {
    $pull: { budgetsList: req.params.id },
  });

  !budget && res.status(404).json({ message: "budget not found" });
  budget && res.json({ message: "success", budget , user });
});

export {
  addBudget,
  getAllBudgets,
  getSingleBudget,
  deleteBudget,
  updateBudget,
};
