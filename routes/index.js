import { Router } from "express";
import userRouter from "./userRoutes.js";
import podcastRouter from "./podcastRoutes.js";
import adminRouter from "./admin.js";


const appRouter = Router();
appRouter.use("/auth", userRouter);
appRouter.use("/podcast", podcastRouter);
appRouter.use("/auth", adminRouter);

export default appRouter;