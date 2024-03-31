import Joi from "joi";

const addBudgetVal = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  amount: Joi.number().positive().required(),

  period: Joi.string().valid(
    'weekly', 'monthly', 'yearly', 'one time'
  ).required(),

  accounts: Joi.array().items(Joi.string().hex().length(24)).required(),
  startDate: Joi.date().iso(), 
  endDate: Joi.date().iso().min(Joi.ref('startDate')),
  amountSpent: Joi.number().default(0),

});



const updateBudgetVal = Joi.object({
  id: Joi.string().hex().length(24).required(),

  name: Joi.string().min(2).max(30),
  amount: Joi.number().positive(),
  accounts: Joi.array().items(Joi.string().hex().length(24)),


});

const paramsIdVal = Joi.object({
  id: Joi.string().min(2).max(30).required(),
});

export { addBudgetVal, updateBudgetVal, paramsIdVal };
