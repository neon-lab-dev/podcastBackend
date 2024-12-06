import { Schema, model } from "mongoose";
import ENV_CONFIG from "../config/config.js";
import { compare, hash } from "bcrypt";

const userSchema = new Schema(
    {

        name: {
            type: String,
            required: [true, "Please Enter Your full Name"],
            maxLength: [50, "Name cannot exceed 50 characters"],
        },
        username: {
            type: String,
        },

        email: {
            type: String,
            required: [true, "Please Enter Your Email"],
            unique: true,
            validate: {
                validator: function (v) {
                    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
                },
                message: (props) => `${props.value} is not a valid email address!`,
            },
        },
        password: {
            type: String,
            required: [true, "Please Enter your password"],
            minLength: [8, "Password should be greater than 8 characters"],
            select: false,
        },
        image: {
            type: String, // Google profile image, or user-uploaded image for email users
        },
        preferences: {
            type: [String],
        },
    },
    {
        timestamps: true,
        collection: "users",
    }
);
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await hash(this.password, 10);
});
userSchema.methods.getJWTToken = function () {
    return sign({ id: this._id }, ENV_CONFIG.JWT_SECRET, {
        expiresIn: ENV_CONFIG.JWT_EXPIRE,
    });
};
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await compare(enteredPassword, this.password);
};
export default model("User", userSchema);
