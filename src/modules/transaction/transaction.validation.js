import Joi from "joi";

const addTransactionVal = Joi.object({
  note: Joi.string().min(2).max(300),
  type: Joi.string().valid("income", "expense").required(),
  amount: Joi.number().required(),
  category: Joi.string()
    .valid(
      "Food and Drinks",
      "Groceries",
      "Utilities",
      "Rent/Mortgage",
      "Transportation",
      "Healthcare",
      "Insurance",
      "Education",
      "Entertainment",
      "Dining Out",
      "Shopping",
      "Travel",
      "Savings",
      "Investments",
      "Gifts/Donations",
      "Personal Care",
      "Home Improvement",
      "Taxes",
      "Fees/Charges",
      "Income",
      "Other"
    )
    .required(),

  location: Joi.string().min(2).max(100),
  label: Joi.string().hex().length(24),
  account: Joi.string().hex().length(24).required(),
  date: Joi.date(),
});

// const updateAccountVal = Joi.object({
//   id: Joi.string().hex().length(24).required(),
//   type: Joi.string().valid(
//     'cash', 'bank', 'credit card', 'investment', 'savings', 'checking', 'loan', 'retirement', 'expense'
//   ),
//   name: Joi.string().min(2).max(30),
//   currentBalance: Joi.number(),
// });

// const paramsIdVal = Joi.object({
//   id: Joi.string().min(2).max(30).required(),
// });

export { addTransactionVal };
