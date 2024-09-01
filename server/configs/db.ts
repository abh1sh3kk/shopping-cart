import mongoose from "mongoose";
import { config } from "dotenv";
config();

(async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING || "");
        console.log("Connection Successful");
    } catch (e) {
        console.log("Erorr in connection.", e);
    }
})();