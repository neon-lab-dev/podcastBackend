import ENV_CONFIG from "../config/config.js";
import { ADMIN_AUTH_TOKEN, USER_AUTH_TOKEN } from "../constants/cookies.constant.js";
import { sendResponse } from "../middlewares/sendResponse.js";
import jwt from "jsonwebtoken";
import adminModel from "../models/admin.model.js";


// export const createToken = (id, expiresIn) => {
//     const payload = { userId: id };
//     const token = jwt.sign(payload, ENV_CONFIG.JWT_SECRET, {
//         expiresIn,
//     });
//     return token;
// };


/**
 * Creates a JWT token.
 * @param {object} payload - The payload containing user data.
 * @param {string} expiresIn - Token expiry time.
 * @returns {string} - Signed JWT token.
 */
export const createToken = (payload, expiresIn) => {
    const token = jwt.sign(payload, ENV_CONFIG.JWT_SECRET, {
        expiresIn,
    });
    return token;
};


// export const verifyTokenUser = async (req, res, next) => {
//     const token = req.signedCookies[USER_AUTH_TOKEN];

//     if (!token || token.trim() === "") {
//         const response = {
//             status: 401,
//             message: "Auth Error, Cookies not found",
//         };
//         return sendResponse(res, response);
//     }

//     return new Promise((resolve, reject) => {
//         jwt.verify(token, ENV_CONFIG.JWT_SECRET, (err, data) => {
//             if (err) {
//                 reject(err.message);
//                 return sendResponse(res, {
//                     status: 401,
//                     message: "Auth Error, Invalid token",
//                 });
//             } else {
//                 resolve();
//                 res.locals.jwtData = data;
//                 return next();
//             }
//         });
//     });
// };

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;


    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return sendResponse(res, {
            status: 401,
            message: "Authorization token missing or invalid",
        });
    }

    const token = authHeader.split(" ")[1];
    console.log(token)
    try {
        const decoded = jwt.verify(token, ENV_CONFIG.JWT_SECRET);
        res.locals.jwtData = decoded;
        next();
    } catch (error) {
        return sendResponse(res, {
            status: 401,
            message: "Invalid or expired token",
        });
    }
};
// export const verifyTokenAdmin = async (req, res, next) => {
//     const token = req.signedCookies[ADMIN_AUTH_TOKEN];

//     if (!token || token.trim() === "") {
//         const response = {
//             status: 401,
//             message: "Auth Error, Cookies not found",
//         };
//         return sendResponse(res, response);
//     }


//     return new Promise((resolve, reject) => {
//         jwt.verify(token, ENV_CONFIG.JWT_SECRET, async (err, data) => {
//             if (err) {
//                 reject(err.message);
//                 return sendResponse(res, {
//                     status: 401,
//                     message: "Auth Error, Invalid token",
//                 });
//             } else {
//                 resolve();
//                 res.locals.jwtData = data;
//                 const admin = await adminModel.findOne({ _id: data.userId.id });
//                 if (!admin) {
//                     return sendResponse(res, {
//                         status: 404,
//                         message: "You are not an admin",
//                     });
//                 }
//                 return next();
//             }
//         });
//     });
// };


export const verifyTokenAdmin = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return sendResponse(res, {
            status: 401,
            message: "Authorization token missing or invalid",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, ENV_CONFIG.JWT_SECRET);
        res.locals.jwtData = decoded;
        console.log(decoded)
        const admin = await adminModel.findOne({ _id: decoded.id });
        if (!admin) {
            return sendResponse(res, {
                status: 404,
                message: "You are not an admin",
            });
        }
        next();
    } catch (error) {
        return sendResponse(res, {
            status: 401,
            message: "Invalid or expired token",
        });
    }
}