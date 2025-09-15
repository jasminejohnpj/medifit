import { Router } from "express";
import { SignUp ,SignIn} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post('/SignUp', SignUp);
authRouter.post('/SignIn', SignIn);

export default authRouter;