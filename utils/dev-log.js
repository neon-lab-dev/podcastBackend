import ENV_CONFIG from '../config/config.js';

const devLog = (...args) => {
    if (ENV_CONFIG.NODE_ENV === "development") {
        console.log("DEV LOG:");
        console.log(...args);
    }
};

export default devLog;
