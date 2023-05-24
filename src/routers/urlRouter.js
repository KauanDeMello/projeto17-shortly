import { Router } from "express"
import {shortenUrl, getUrlById} from "../controllers/url.controller.js"
import authMiddleware from "../middleware/authMiddleware.js"


const routerUrl = Router();

routerUrl.post("/urls/shorten", shortenUrl, authMiddleware);
routerUrl.get("url/:id", getUrlById)

export default routerUrl;