import { Router } from "express"
import {shortenUrl, getUrlById, redirectToUrl, deleteUrl} from "../controllers/url.controller.js"
import authMiddleware from "../middleware/authMiddleware.js"


const routerUrl = Router();

routerUrl.post("/urls/shorten", shortenUrl, authMiddleware);
routerUrl.get("urls/:id", getUrlById)
routerUrl.get("urls/open/:shortUrl", redirectToUrl)
routerUrl.delete("urls/:id", deleteUrl)

export default routerUrl;