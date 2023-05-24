import { Router } from "express"

import {signin, signup} from "../controllers/userController.js"
import validateSignin from "../middleware/signin.Middlware.js"


import validateSignup from "../middleware/signup.Middleware.js"



const routerUser = Router()

routerUser.post("/singin", validateSignin,signin)
routerUser.post("/singup", validateSignup,signup)

export default routerUser 