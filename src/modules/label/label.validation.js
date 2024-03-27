import Joi from "joi";

const addLabelVal = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  color: Joi.string().valid(
    "red",
    "green",
    "blue",
    "yellow",
    "orange",
    "purple",
    "pink"
  ),
});

const updateLabelVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
  color: Joi.string().valid(
    "red",
    "green",
    "blue",
    "yellow",
    "orange",
    "purple",
    "pink"
  ),
  name: Joi.string().min(2).max(30),
});

const paramsIdVal = Joi.object({
  id: Joi.string().min(2).max(30).required(),
});

export { addLabelVal, updateLabelVal, paramsIdVal };
