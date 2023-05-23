import joi from "joi"
import {signupValidation} from "../schemas/signupSchema.js"

export const validateSignup = (req, res, next) => {
    const { error } = signupValidation.validate(req.body);
  
    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }
  
    next();
  };