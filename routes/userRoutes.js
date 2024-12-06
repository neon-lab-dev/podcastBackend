
import { Router } from "express";
import { handleEmailLogin, handleEmailRegister, handleGoogleSignin, userProfile } from "../controllers/user.js";
import { verifyTokenUser } from "../utils/token-manager.js";

const userRouter = Router();

userRouter.post("/user/register", handleEmailRegister);
userRouter.post("/user/login", handleEmailLogin);
userRouter.post("/user/google", handleGoogleSignin);
userRouter.get("/user/me", verifyTokenUser, userProfile);
export default userRouter;