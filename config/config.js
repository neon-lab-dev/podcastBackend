import createEnv from "../utils/create-env.js";
import { config } from "dotenv";

config();

const ENV_CONFIG = createEnv({
    MONGO_URI: {
        value: process.env.MONGO_URI,
        required: true,
    },
    PORT: {
        value: process.env.PORT || "5000",
        required: false,
        type: "number",
    },
    MAX_REQUEST_SIZE: {
        value: process.env.MAX_REQUEST_SIZE || "10mb",
        required: false,
    },
    COOKIE_SECRET: {
        value: process.env.COOKIE_SECRET,
        required: true,
    },
    FRONTEND_DOMAIN: {
        value: process.env.FRONTEND_DOMAIN,
        required: true,
    },
    FRONTEND_URL: {
        value: process.env.FRONTEND_URL,
        required: true,
        type: "array",
        isUrl: true,
    },
    JWT_SECRET: {
        value: process.env.JWT_SECRET,
        required: true,
    },
    AUTH_TOKEN_COOKIE_NAME: {
        value: process.env.AUTH_TOKEN_COOKIE_NAME,
        required: true,
    },
    NODE_ENV: {
        value: process.env.NODE_ENV || "development",
        required: false,
    },
    JWT_EXPIRE: {
        value: process.env.JWT_EXPIRE || "3d",
        required: false,
    },

    GOOGLE_CLIENT_ID: {
        value: process.env.GOOGLE_CLIENT_ID,
        required: true,
    },
    GOOGLE_CLIENT_SECRET: {
        value: process.env.GOOGLE_CLIENT_SECRET,
        required: true,
    },
    IMAGE_KIT_PUBLIC_KEY: {
        value: process.env.IMAGE_KIT_PUBLIC_KEY,
        required: true,
    },
    IMAGE_KIT_PRIVATE_KEY: {
        value: process.env.IMAGE_KIT_PRIVATE_KEY,
        required: true,
    },
    IMAGE_KIT_ENDPOINT: {
        value: process.env.IMAGE_KIT_ENDPOINT,
        required: true,
    },
});

export default ENV_CONFIG;