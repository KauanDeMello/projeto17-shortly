import express from "express"
import { validateSignup, validateSigin } from "../middleware/userMiddleware.js"
import { signup, signin } from "../controllers/userController.js"
import { signinValidation } from "../schemas/signinSchema.js";
import {signupValidation} from "../schemas/signupSchema.js"

const routerUser = express.Router();

routerUser.post("/signup", validateSignup(signupValidation), signup);
routerUser.post("/signin", validateSigin(signinValidation), signin);

export default routerUser; 