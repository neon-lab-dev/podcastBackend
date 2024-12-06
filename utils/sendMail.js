import adminModel from "../models/admin.model.js";
import sendEmail from "./mailService.js";

// Cache for storing admin data
let adminCache = null;
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes in milliseconds
let lastCacheUpdate = 0;

// Function to get all admin data with caching
const getAdmins = async () => {
    const now = Date.now();
    if (!adminCache || now - lastCacheUpdate > CACHE_EXPIRY) {
        adminCache = await adminModel.find();
        lastCacheUpdate = now;
    }
    return adminCache;
};

export const sendEmailToAllAdmins = async (subject, html) => {
    const admins = await getAdmins();
    if (admins.length > 0) {
        const emailPromises = admins.map(admin =>
            sendEmail({
                to: admin.email,
                subject,
                html,
            })
        );
        await Promise.all(emailPromises);
    }
};

export const sendWelcomeEmail = async (subject, html, user) => {
    await sendEmail({
        to: user.email,
        subject,
        html,
    });
};