// utils/cloudinary.js
/* eslint-disable no-undef */
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
}); 

const uploadToCloudinary = async (localFilePath, folder = "Medifit_Images") => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder, // <-- dynamic folder
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath); 
    return response;
  } catch (error) {
    console.error("Cloudinary Upload Failed:", error);
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

// Delete from Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return result.result === "ok";
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return false;
  }
};

export { cloudinary, uploadToCloudinary, deleteFromCloudinary };
