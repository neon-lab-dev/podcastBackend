// import multer, { memoryStorage } from "multer";


// const storage = memoryStorage();

// const singleUpload = multer({ storage }).single("file");

// export default singleUpload;
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB limit for each file
    },
});

const podcastUpload = upload.fields([
    { name: 'bannerimage', maxCount: 1 },
    { name: 'recordingfile', maxCount: 1 }
]);

export default podcastUpload;