import Joi from "joi";

const addUserVal = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .required(),
  rePassword: Joi.valid(Joi.ref("password")).required(),
  role: Joi.string().valid("user", "admin"),
});

const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const updateUserVal = Joi.object({
  id: Joi.string().hex().length(24).required(),

  name: Joi.string().min(2).max(30),
  email: Joi.string().email(),
  password: Joi.string().pattern(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  ),
  role: Joi.string().valid("user", "admin"),
});



const signinSchemaVal = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  ),
});

const changePasswordVal = Joi.object({
  password: Joi.string().pattern(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  ),
  newPassword: Joi.string().pattern(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  ),
});

const forgotPasswordVal = Joi.object({

  email: Joi.string().email().required(),
});

const resetPasswordVal = Joi.object({

  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  password: Joi.string().pattern(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  ).required(),
});

export {
  addUserVal,
  paramsIdVal,
  updateUserVal,
  changePasswordVal,
  signinSchemaVal,
  forgotPasswordVal,resetPasswordVal,
};
