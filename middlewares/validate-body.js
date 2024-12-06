import { fromError } from "zod-validation-error";
import { sendRes } from "./send-response.js";

/**
 * Middleware to validate request body with a Zod schema
 * @param {ZodSchema} schema - The Zod schema for validation
 * @returns {function(Request, Response, NextFunction): void}
 */
export const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            let parsed = schema.parse(req.body);
            req.body = parsed;
            next();
        } catch (e) {
            const message = fromError(e).toString();
            return sendRes(res, {
                status: 400,
                message,
                error: e.errors,
                forceError: true,
            });
        }
    };
};
