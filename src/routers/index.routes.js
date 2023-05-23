import { Router } from "express"
import routerUser from "../routers/userRouter"
import routerURL from "../routers/urlRouter"

const router = Router()

router.use(routerUser)
router.use(routerURL)

export default router
