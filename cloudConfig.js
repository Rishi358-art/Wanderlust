import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Load environment variables
import dotenv from "dotenv";
dotenv.config(); // make sure .env is at project root

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "Wanderlust",        // folder in Cloudinary
        allowed_formats: ["jpeg", "png", "jpg"],  // allowed file types
    },
});

export { cloudinary, storage };
