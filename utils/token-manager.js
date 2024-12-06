import ENV_CONFIG from "../config/config.js";
import { ADMIN_AUTH_TOKEN, USER_AUTH_TOKEN } from "../constants/cookies.constant.js";
import { sendResponse } from "../middlewares/sendResponse.js";
import jwt from "jsonwebtoken";
import adminModel from "../models/admin.model.js";

/**
 * @typedef {Object} TokenPayload
 * @property {string} _id - The user's ID
 * @property {string} email - The user's email
 * @property {string} accountId - The user's account ID
 */

/**
 * Create a JWT token.
 * @param {TokenPayload} id - The payload containing user data
 * @param {string} expiresIn - Token expiry time
 * @returns {string} - Signed JWT token
 */
export const createToken = (id, expiresIn) => {
    const payload = { userId: id };
    const token = jwt.sign(payload, ENV_CONFIG.JWT_SECRET, {
        expiresIn,
    });
    return token;
};

/**
 * Middleware to verify JWT token in signed cookies.
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @param {import("express").NextFunction} next - Express next function
 * @returns {Promise<void>} - Calls next middleware or sends an error response
 */
export const verifyTokenUser = async (req, res, next) => {
    const token = req.signedCookies[USER_AUTH_TOKEN];

    if (!token || token.trim() === "") {
        const response = {
            status: 401,
            message: "Auth Error, Cookies not found",
        };
        return sendResponse(res, response);
    }

    return new Promise((resolve, reject) => {
        jwt.verify(token, ENV_CONFIG.JWT_SECRET, (err, data) => {
            if (err) {
                reject(err.message);
                return sendResponse(res, {
                    status: 401,
                    message: "Auth Error, Invalid token",
                });
            } else {
                resolve();
                res.locals.jwtData = data;
                return next();
            }
        });
    });
};


export const verifyTokenAdmin = async (req, res, next) => {
    const token = req.signedCookies[ADMIN_AUTH_TOKEN];

    if (!token || token.trim() === "") {
        const response = {
            status: 401,
            message: "Auth Error, Cookies not found",
        };
        return sendResponse(res, response);
    }


    return new Promise((resolve, reject) => {
        jwt.verify(token, ENV_CONFIG.JWT_SECRET, async (err, data) => {
            if (err) {
                reject(err.message);
                return sendResponse(res, {
                    status: 401,
                    message: "Auth Error, Invalid token",
                });
            } else {
                resolve();
                res.locals.jwtData = data;
                const admin = await adminModel.findOne({ _id: data.userId.id });
                if (!admin) {
                    return sendResponse(res, {
                        status: 404,
                        message: "You are not an admin",
                    });
                }
                return next();
            }
        });
    });
};