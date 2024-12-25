import { sendResponse } from "../middlewares/sendResponse.js";
import userModel from "../models/user.model.js";
import oauth2Client from "../config/oauth.js";
import userCredentials from "../models/user-credentials.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { ADMIN_NOTIFICATION, SIGNUP_EMAIL } from "../constants/email.constant.js";
import { sendEmailToAllAdmins, sendWelcomeEmail } from "../utils/sendMail.js";
import { createToken } from "../utils/token-manager.js";



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
    // ! Uncomment the below lines to send welcome email to the user and notification email to all admins
    // await sendWelcomeEmail(SIGNUP_EMAIL.subject, SIGNUP_EMAIL.html(newUser.name), newUser);
    // await sendEmailToAllAdmins(ADMIN_NOTIFICATION.subject, ADMIN_NOTIFICATION.html(newUser)); 
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password

    const token = createToken({ id: newUser._id, email: newUser.email }, "7d");
    return sendResponse(res, {
        status: 201,
        message: `Thank you for registering, ${newUser.name}`,
        data: userWithoutPassword,
        token,
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
    const token = createToken({ id: user._id, email: user.email }, "7d");

    return sendResponse(res, {
        status: 200,
        message: `Welcome ${user.name} !`,
        data: {
            name: user.name,
            email: user.email,
            image: user.image,
            id: user._id,
            token,
        },
    });
});


export const handleGoogleSignin = catchAsyncErrors(async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return sendResponse(res, {
            status: 400,
            message: "Invalid code",
        });
    }
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



    //! Uncomment the below lines to send welcome email to the user and notification email to all admins
    // if (!userExists) {
    //     await sendWelcomeEmail(SIGNUP_EMAIL.subject, SIGNUP_EMAIL.html(userDoc.name), userDoc);
    //     await sendEmailToAllAdmins(ADMIN_NOTIFICATION.subject, ADMIN_NOTIFICATION.html(userDoc));

    // }
    const token = createToken({ id: userDoc._id, email: userDoc.email }, "7d");
    return sendResponse(res, {
        status: 200,
        message: `Welcome back ${userDoc.name} `,
        data: {
            name: userDoc.name,
            email: userDoc.email,
            image: userDoc.image,
            _id: userDoc._id,
        },
        token,
    });
});

export const userProfile = catchAsyncErrors(async (req, res) => {
    const id = res.locals.jwtData.id;

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