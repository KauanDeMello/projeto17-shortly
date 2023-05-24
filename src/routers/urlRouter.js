import { Router } from "express"
import {shortenUrl, getUrlById, redirectToUrl, deleteUrl, getUserProfile, getTopUsers} from "../controllers/url.controller.js"
import authMiddleware from "../middleware/authMiddleware.js"


const routerUrl = Router();

routerUrl.post("/urls/shorten", shortenUrl, authMiddleware);
routerUrl.get("urls/:id", getUrlById)
routerUrl.get("urls/open/:shortUrl", redirectToUrl)
routerUrl.delete("urls/:id", deleteUrl)
routerUrl.get("/users/me",getUserProfile)
routerUrl.get("/ranking",getTopUsers)

export default routerUrl;