import { google } from "googleapis";
import ENV_CONFIG from "../config/config.js";

const oauth2Client = new google.auth.OAuth2(
    ENV_CONFIG.GOOGLE_CLIENT_ID,
    ENV_CONFIG.GOOGLE_CLIENT_SECRET,
    "postmessage"
);


export default oauth2Client;
