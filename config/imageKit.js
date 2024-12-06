import ImageKit from "imagekit";
import ENV_CONFIG from "./config.js";
const ik = new ImageKit({
    urlEndpoint: ENV_CONFIG.IMAGE_KIT_ENDPOINT,
    publicKey: ENV_CONFIG.IMAGE_KIT_PUBLIC_KEY,
    privateKey: ENV_CONFIG.IMAGE_KIT_PRIVATE_KEY,
});

export default ik;