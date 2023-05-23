import express from "express"
import { validateSignup } from "../middleware/userMiddleware.js"
import { signup } from "../controllers/userController.js"

const router = express.Router();

router.post("/signup", validateSignup, signup);

export default router;