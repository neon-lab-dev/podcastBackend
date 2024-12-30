import { Router } from "express";
import userRouter from "./userRoutes.js";
import podcastRouter from "./podcastRoutes.js";
import adminRouter from "./admin.js";
import roomRouter from './roomRoutes.js'

const appRouter = Router();
appRouter.use("/auth", userRouter);
appRouter.use("/podcast", podcastRouter);
appRouter.use("/auth", adminRouter);
appRouter.use("/room", roomRouter);

export default appRouter;