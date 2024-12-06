import ENV_CONFIG from "../config/config.js";
import devLog from "../utils/dev-log.js";
import { connect, disconnect } from "mongoose";

export const connectToDB = () => {
    return new Promise(async (resolve, reject) => {
        console.log("Connecting to MongoDB...");
        try {
            await connect(ENV_CONFIG.MONGO_URI);
            resolve("MongoDB connected!🚀");
        } catch (err) {
            devLog(err);
            reject("MongoDB connection failed!");
        }
    });
};

export const disconnectFromDB = async () => {
    try {
        await disconnect();
        console.log("MongoDB disconnected!");
    } catch (err) {
        console.log("MongoDB disconnection failed!");
        devLog(err);
    }
};