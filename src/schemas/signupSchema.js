import joi from "joi"

export const signupValidation = joi.object({
      name: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().required(),
      confirmPassword: joi.string().valid(joi.ref("password")).required(),
});