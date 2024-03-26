import Joi from "joi";

const addAccountVal = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  type: Joi.string().valid(
    'cash', 'bank', 'credit card', 'investment', 'savings', 'checking', 'loan', 'retirement', 'expense'
  ),
  currentBalance: Joi.number(),
});

const updateAccountVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
  type: Joi.string().valid(
    'cash', 'bank', 'credit card', 'investment', 'savings', 'checking', 'loan', 'retirement', 'expense'
  ),
  name: Joi.string().min(2).max(30),
  currentBalance: Joi.number(),
});

const paramsIdVal = Joi.object({
  id: Joi.string().min(2).max(30).required(),
});



export {
  addAccountVal,
  updateAccountVal,
  paramsIdVal
};
