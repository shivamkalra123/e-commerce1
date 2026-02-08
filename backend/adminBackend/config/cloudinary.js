import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Re-load environment variables here just in case
dotenv.config();

// Verify before configuring
if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
  console.error("❌ Cloudinary environment variables are missing!");
  console.log({
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "***" + process.env.CLOUDINARY_API_KEY.slice(-4) : "undefined",
    CLOUDINARY_SECRET_KEY: process.env.CLOUDINARY_SECRET_KEY ? "***" + process.env.CLOUDINARY_SECRET_KEY.slice(-4) : "undefined",
  });
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true
});

console.log("✅ Cloudinary configured for cloud:", process.env.CLOUDINARY_NAME);

export default cloudinary;