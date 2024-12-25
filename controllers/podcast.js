import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendResponse } from "../middlewares/sendResponse.js";
import { Podcast } from "../models/podcast.model.js";
import getDataUri from "../utils/dataUri.js";
import { deleteFile, uploadFile } from "../utils/uploadFile.js";

export const createPodcast = catchAsyncErrors(async (req, res) => {
    const { name, description, category } = req.body;
    const bannerimage = req.files.bannerimage[0];
    const recordingfile = req.files.recordingfile[0];
    if (!name || !description || !category || !bannerimage || !recordingfile) {
        return sendResponse(res, {
            status: 400,
            message: "Please fill all fields",
        });
    }
    const banner = bannerimage
        ? await uploadFile(getDataUri(bannerimage).content, getDataUri(bannerimage).fileName, "podcast-banners")
        : {};

    const recording = recordingfile
        ? await uploadFile(getDataUri(recordingfile).content, getDataUri(recordingfile).fileName, "podcast-recordings")
        : {};
    const podcast = new Podcast({
        name,
        description,
        category,
        bannerimage: banner,
        recordingfile: recording,
    });
    await podcast.save();
    return sendResponse(res, {
        status: 201,
        message: "Podcast created successfully",
        data: podcast,
    });
});


export const getPodcasts = catchAsyncErrors(async (req, res) => {
    const podcasts = await Podcast.find();
    return sendResponse(res, {
        status: 200,
        data: podcasts,
    });
});
export const getPodcast = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return sendResponse(res, {
            status: 400,
            message: "Please provide podcast id",
        });
    }
    const podcast = await Podcast.findById(id);
    if (!podcast) {
        return sendResponse(res, {
            status: 404,
            message: "Podcast not found",
        });
    }
    return sendResponse(res, {
        status: 200,
        data: podcast,
    });
});
export const updatePodcast = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, category } = req.body;
    const podcast = await Podcast.findById(id);

    if (!podcast) {
        return sendResponse(res, {
            status: 404,
            message: "Podcast not found",
        });
    }
    const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (category) updateFields.category = category;

    // Handle banner image update
    if (req.files && req.files.bannerimage) {
        const file = req.files.bannerimage[0];
        if (podcast.bannerimage) {
            await deleteFile(podcast.bannerimage.fileId);
        }
        const banner = await uploadFile(getDataUri(file).content, getDataUri(file).fileName, "podcast-banners");
        updateFields.bannerimage = banner;
        console.log(getDataUri(file).fileName);
    }

    // Handle recording file update
    if (req.files && req.files.recordingfile) {
        const file = req.files.recordingfile[0];
        if (podcast.recordingfile) {
            await deleteFile(podcast.recordingfile.fileId);
        }
        const recording = await uploadFile(getDataUri(file).content, getDataUri(file).fileName, "podcast-recordings");
        updateFields.recordingfile = recording;
    }

    // Check if there are any fields to update
    if (Object.keys(updateFields).length === 0 && !req.files) {
        return next(new ErrorHandler("No fields provided for update", 400));
    }

    const updatedPodcast = await Podcast.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true }
    );

    return sendResponse(res, {
        status: 200,
        message: "Podcast updated successfully",
        data: updatedPodcast,
    });
});

export const deletePodcast = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    const podcast = await Podcast.findById(id);
    if
        (!podcast) {
        return sendResponse(res, {
            status: 404,
            message: "Podcast not found",
        });
    }
    if (podcast.bannerimage) {
        await deleteFile(podcast.bannerimage.fileId);
    }
    if (podcast.recordingfile) {
        await deleteFile(podcast.recordingfile.fileId);
    }
    await podcast.deleteOne();
    return sendResponse(res, {
        status: 200,
        message: "Podcast deleted successfully",
    });
});

export const getPodcastByCategory = catchAsyncErrors(async (req, res) => {
    const { category } = req.params;

    if (!category) {
        return sendResponse(res, {
            status: 400,
            message: "Please provide category",
        });
    }
    const podcasts = await Podcast.find({ category });

    if (podcasts.length === 0) {
        return sendResponse(res, {
            status: 404,
            message: "No podcasts found in this category",
        });
    }

    return sendResponse(res, {
        status: 200,
        data: podcasts,
    });
});