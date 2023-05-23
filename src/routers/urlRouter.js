import shortenUrl from "../controllers/url.controller"

const routerURL = Router();

routerURL.post("/urls/shorten", shortenUrl);


export default routerURL
