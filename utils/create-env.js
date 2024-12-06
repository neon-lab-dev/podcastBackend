import { z } from "zod";
import { fromError } from "zod-validation-error";

/**
 * @typedef {Object} IEnv
 * @property {string} value - The environment variable value
 * @property {boolean} [required] - Whether the variable is required
 * @property {"string" | "number" | "boolean" | "array"} [type] - The type of the variable
 * @property {boolean} [isUrl] - Whether the variable is a URL and needs trailing slash removed
 */

/**
 * Create a typed environment object from a schema
 * @param {Object.<string, IEnv>} env - Environment schema
 * @returns {Object.<string, string | number | boolean | string[]>} - Parsed environment variables
 */
const createEnv = (env) => {
    const envKeys = Object.keys(env);

    const parsedEnv = envKeys.reduce((acc, key) => {
        const schema = createSchema(env[key], key);
        const { value } = env[key];

        let parsed = "";

        try {
            parsed = schema.parse(value);
        } catch (e) {
            const message = fromError(e).toString();
            console.error("\nENVIRONMENT VARIABLES ERROR:");
            console.error(message);
        }

        acc[key] = parsed;
        return acc;
    }, {});

    return parsedEnv;
};

/**
 * Create a validation schema based on the environment variable configuration
 * @param {IEnv} env - The environment variable schema
 * @param {string} key - The environment variable name
 * @returns {import("zod").ZodSchema} - Zod schema for validation
 */
const createSchema = (env, key) => {
    const { required = true, type = "string", isUrl = false } = env;

    // if the value is not provided, throw an error
    const schema = z
        .string({
            message: `${key} must be a string`,
        })
        .refine((val) => {
            if (required && !val) {
                return `${key} is required`;
            }

            if (type === "number" && isNaN(Number(val))) {
                return `${key} must be a number`;
            }

            if (type === "boolean" && !["true", "false"].includes(val)) {
                return `${key} must be a boolean`;
            }

            if (isUrl && !val.startsWith("http")) {
                return `${key} must be a URL`;
            }

            if (type === "array" && val.split(",").length < 1) {
                return `${key} must be a comma separated string`;
            }

            return true;
        })
        .transform((val) => {
            if (type === "number") {
                return Number(val);
            }

            if (type === "boolean") {
                return val === "true";
            }

            if (type === "array") {
                return val.split(",").map((v) => v.trim());
            }

            return val;
        })
        .transform((val) => {
            if (isUrl) {
                // remove trailing slash
                if (typeof val === "string") {
                    return val.replace(/\/$/, "");
                }

                if (Array.isArray(val)) {
                    return val.map((v) => v.replace(/\/$/, ""));
                }
            }
            return val;
        });

    return schema;
};

export default createEnv;
