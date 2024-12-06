import { Router } from "express";
import { createPodcast, deletePodcast, getPodcast, getPodcasts, updatePodcast } from "../controllers/podcast.js";
import podcastUpload from "../middlewares/multer.js";
import { verifyTokenAdmin } from "../utils/token-manager.js";

const podcastRouter = Router();

podcastRouter.post("/create", podcastUpload, verifyTokenAdmin, createPodcast);
podcastRouter.get("/", getPodcasts);
podcastRouter.get("/:id", getPodcast);
podcastRouter.put("/:id", podcastUpload, verifyTokenAdmin, updatePodcast);
podcastRouter.delete("/:id", verifyTokenAdmin, deletePodcast);

export default podcastRouter;