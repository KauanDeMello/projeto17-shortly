import { Router } from "express"
import routerUser from "./userRouter.js"

const router = Router()
router.use(routerUser)


export default router
