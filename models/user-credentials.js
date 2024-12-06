import { Schema, model } from "mongoose";

const userCredentialsSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        accessToken: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        scope: {
            type: String,
        },
        idToken: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: "user-credentials",
    }
);

export default model("UserCredentials", userCredentialsSchema);
