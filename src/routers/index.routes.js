import { Router } from "express"
import routerUser from "./userRouter.js"
import urlRouter from "./urlRouter.js"

const router = Router()
router.use(routerUser)
router.use(urlRouter)


export default router
