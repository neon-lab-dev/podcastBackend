import { app } from "./app.js";
import ENV_CONFIG from "./config/config.js";
import { connectToDB } from "./db/index.js";

// app
connectToDB()
    .then((res) => {
        console.log(res);
        app.listen(ENV_CONFIG.PORT, () => {
            console.log(`Server is running on PORT :${ENV_CONFIG.PORT} and the url is http://localhost:${ENV_CONFIG.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });