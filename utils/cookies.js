import { createToken } from "./token-manager.js";
import ENV_CONFIG from "../config/config.js";

/**
 * Registers the authentication token as a signed cookie.
 * @param {import("express").Response} res - Express response object
 * @param {import("./token-manager.helper.js").TokenPayload} payload - Token payload containing user data
 */
export const registerCookies = (res, cookie_token, payload) => {
    const token = createToken(payload, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie(cookie_token, token, {
        path: "/",
        domain: ENV_CONFIG.FRONTEND_DOMAIN,
        expires: expires,
        httpOnly: true,
        signed: true,
        sameSite: "none",
        secure: true,
    });
};

/**
 * Clears the authentication cookie.
 * @param {import("express").Response} res - Express response object
 */
export const clearCookies = (res, cookie_token) => {
    res.clearCookie(cookie_token, {
        httpOnly: true,
        domain: ENV_CONFIG.FRONTEND_DOMAIN,
        signed: true,
        path: "/",
        sameSite: "none",
        secure: true,
    });
};
