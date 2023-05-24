import { Router } from "express"
import {shortenUrl} from "../controllers/url.controller.js"
import authMiddleware from "../middleware/authMiddleware.js"


const routerUrl = Router();

routerUrl.post("/urls/shorten", shortenUrl, authMiddleware);

export default routerUrl;