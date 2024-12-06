
import { Schema, model } from "mongoose";
import { FileSchema } from "./file.model.js";
//name,description category, bannerimage,recoding file(imagekit.io)
const podcastSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        bannerimage: FileSchema,
        recordingfile: FileSchema,
    });
export const Podcast = model("Podcast", podcastSchema);