import joi from "joi";

export const signinValidation = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});