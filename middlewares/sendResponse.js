import ENV_CONFIG from "../config/config.js";
import { STATUS } from "../constants/status.constant.js";

/**
 * @typedef {Object} IResponse
 * @property {number} status - HTTP status code
 * @property {string} [message] - Optional message
 * @property {string} [statusText] - Optional status text
 * @property {any} [error] - Optional error information
 * @property {any} [data] - Optional data to send in response
 * @property {boolean} [forceError] - Force error to show in response in production
 */

/**
 * Sends an HTTP response in a structured format.
 * @param {import("express").Response} res - Express response object
 * @param {IResponse} responseData - Response data object
 * @returns {import("express").Response} - Express response
 */
export const sendResponse = (res, responseData) => {
    let error = undefined;

    if (responseData.error) {
        if (ENV_CONFIG.NODE_ENV === "development" || responseData.forceError) {
            error = responseData.error;
        } else {
            error =
                "The actual error has been hidden for security reasons, Please report the administrator for more information.";
        }
    }

    return res.status(responseData.status).json({
        ...STATUS[responseData.status || 200],
        ...responseData,
        error,
    });
};
