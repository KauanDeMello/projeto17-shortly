import { signinValidation } from "./signinSchema.js";

export const validateSignin = (req, res, next) => {
  const { error } = signinValidation.validate(req.body);

  if (error) {
    return res.status(422).json({ error: error.details[0].message });
  }

  next();
};