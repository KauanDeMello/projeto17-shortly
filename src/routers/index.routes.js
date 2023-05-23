import { Router } from "express"
import routerUser from "../routers/userRouter"

const router = Router()

router.use(routerUser)

export default router
