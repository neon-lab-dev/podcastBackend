
import { Router } from "express";
import { createRoom, deleteRoom, getRoomByID, getRooms } from "../controllers/room.js";
import { verifyToken } from "../utils/token-manager.js";

const roomRouter = Router();

roomRouter.get("/", verifyToken, getRooms);
roomRouter.get("/:id", verifyToken, getRoomByID).delete("/:id", verifyToken, deleteRoom);
roomRouter.post("/", verifyToken, createRoom);



export default roomRouter;