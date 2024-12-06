import { ADMIN_AUTH_TOKEN } from "../constants/cookies.constant.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendResponse } from "../middlewares/sendResponse.js";
import adminModel from "../models/admin.model.js";
import userModel from "../models/user.model.js";
import { registerCookies, clearCookies } from "../utils/cookies.js";

export const createAdmin = catchAsyncErrors(async (req, res) => {
    const { email, password, full_name } = req.body;
    if (!email || !password || !full_name) {
        return sendResponse(res, {
            status: 400,
            message: "Please fill all fields",
        });
    }
    const adminExists = await adminModel.findOne({ email });
    if (adminExists) {
        return sendResponse(res, {
            status: 400,
            message: "Admin already exists",
        });
    }
    const admin = new adminModel({
        email,
        password,
        full_name,
    });
    await admin.save();
    const adminWithoutPassword = admin.toObject();
    delete adminWithoutPassword.password;
    return sendResponse(res, {
        status: 201,
        message: `Welcome ${admin.full_name}, You are now registered as an Admin`,
        data: adminWithoutPassword,
    });
}
);

export const adminLogin = catchAsyncErrors(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return sendResponse(res, {
            status: 400,
            message: "Please fill all fields",
        });
    }
    const admin = await adminModel.findOne({ email }).select("+password");
    if (!admin || !(await admin.comparePassword(password))) {
        return sendResponse(res, {
            status: 401,
            message: "Invalid credentials",
        });
    }

    registerCookies(res, ADMIN_AUTH_TOKEN, {
        id: admin._id.toString(),
        email: admin.email,
    });
    return sendResponse(res, {
        status: 200,
        message: `Welcome ${admin.full_name} to mail matrix!`,
        data: {
            name: admin.full_name,
            email: admin.email,
            id: admin._id,
        },
    });
})

export const adminLogout = catchAsyncErrors(async (req, res) => {
    clearCookies(res, ADMIN_AUTH_TOKEN);
    return sendResponse(res, {
        status: 200,
        message: "Admin logged out successfully",
    });
});

export const adminMe = catchAsyncErrors(async (req, res) => {
    const id = res.locals.jwtData.userId.id;

    const admin = await adminModel.findById(id);
    return sendResponse(res, {
        status: 200,
        data: admin,
    });
}
);

export const getAllUsers = catchAsyncErrors(async (req, res) => {
    const users = await userModel.find();
    const userCount = await userModel.countDocuments();
    return sendResponse(res, {
        status: 200,
        data: users,
        count: userCount,
    });
});
