import { USER_AUTH_TOKEN } from "../constants/cookies.constant.js";
import { sendResponse } from "../middlewares/sendResponse.js";
import userModel from "../models/user.model.js";
import { registerCookies } from "../utils/cookies.js";
import oauth2Client from "../config/oauth.js";
import userCredentials from "../models/user-credentials.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { ADMIN_NOTIFICATION, SIGNUP_EMAIL } from "../constants/email.constant.js";
import { sendEmailToAllAdmins, sendWelcomeEmail } from "../utils/sendMail.js";



export const handleEmailRegister = catchAsyncErrors(async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return sendResponse(res, {
            status: 400,
            message: "Please fill all fields",
        });

    };
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return sendResponse(res, {
            status: 400,
            message: "User already exists",
        });
    }
    const newUser = await userModel.create({ name, email, password });
    await sendWelcomeEmail(SIGNUP_EMAIL.subject, SIGNUP_EMAIL.html(newUser.name), newUser);
    await sendEmailToAllAdmins(ADMIN_NOTIFICATION.subject, ADMIN_NOTIFICATION.html(newUser));
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password
    return sendResponse(res, {
        status: 201,
        message: `Thank you for registering, ${newUser.name}`,
        data: userWithoutPassword,
    });
});


export const handleEmailLogin = catchAsyncErrors(async (req, res) => {


    const { email, password } = req.body;
    if (!email || !password) {

        return sendResponse(res, {
            status: 400,
            message: "Please fill all fields",
        });
    }
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
        return sendResponse(res, {
            status: 404,
            message: "User not found",
        });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return sendResponse(res, {
            status: 401,
            message: "Invalid Credentials",
        });
    }
    registerCookies(res, USER_AUTH_TOKEN, {
        id: user._id.toString(),

        email: user.email,
    });
    return sendResponse(res, {
        status: 200,
        message: `Welcome ${user.given_name} to mail matrix!`,
        data: {
            name: user.name,
            email: user.email,
            image: user.image,
            id: user._id,
        },
    });
});


export const handleGoogleSignin = catchAsyncErrors(async (req, res) => {
    const { code } = req.body;
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const userRes = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
        {
            method: "GET",
        }
    );

    const user = await userRes.json();

    if (!userRes.ok) {
        return sendResponse(res, {
            status: 400,
            message: "Failed to login, Try again!",
        });
    }
    const userExists = await userModel.findOne({ email: user.email });
    const userDoc = await userModel.findOneAndUpdate(
        {
            email: user.email,
        },
        {
            email: user.email,
            name: user.name,
            image: user.picture,
        },
        {
            new: true,
            upsert: true, // create a new doc if does not exist
        }
    );

    await userCredentials.findOneAndUpdate(
        {
            userId: userDoc._id,
        },
        {
            accessToken: tokens.access_token,
            expiresAt: tokens.expiry_date,
            idToken: tokens.id_token,
            refreshToken: tokens.refresh_token,
            scope: tokens.scope,
        },
        {
            new: true,
            upsert: true, // create a new doc if does not exist
        }
    );




    if (!userExists) {
        await sendWelcomeEmail(SIGNUP_EMAIL.subject, SIGNUP_EMAIL.html(userDoc.name), userDoc);
        await sendEmailToAllAdmins(ADMIN_NOTIFICATION.subject, ADMIN_NOTIFICATION.html(userDoc));

    }
    registerCookies(res, {
        _id: userDoc._id.toString(),
        email: userDoc.email,
    });
    return sendResponse(res, {
        status: 200,
        message: `Welcome back ${userDoc.name} `,
        data: {
            name: userDoc.name,
            email: userDoc.email,
            image: userDoc.image,
            _id: userDoc._id,
        },
    });
});

export const userProfile = catchAsyncErrors(async (req, res) => {
    const id = res.locals.jwtData.userId.id;
    const user = await userModel
        .findById(id)
        .select("-password")
        .lean();
    if (!user) {
        return sendResponse(res, {
            status: 404,
            message: "User not found",
        });
    }
    return sendResponse(res, {
        status: 200,
        data: user,
    });
});