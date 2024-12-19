import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary and cleans up the local file.
 * @param {string} localFilePath - The local file path to upload.
 * @returns {object|null} - The Cloudinary response or null if upload fails.
 */
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("No file path provided for upload.");
      return null;
    }

    console.log("Starting Cloudinary upload for file:", localFilePath);

    // Attempt upload to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Detect file type automatically
    });

    console.log("File successfully uploaded to Cloudinary:", response.url);

    // Delete the local file after a successful upload
    await fs.unlink(localFilePath);
    console.log("Local file deleted after successful upload.");

    return response;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);

    // Clean up local file after failed upload
    try {
      await fs.unlink(localFilePath);
      console.log("Local file deleted after upload failure.");
    } catch (unlinkError) {
      console.error("Failed to delete local file:", unlinkError.message);
    }

    // Additional debug information for Cloudinary errors
    console.log("Debug Info:");
    console.log("Cloudinary Config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? "****" : null,
    });
    console.log("Local File Path:", localFilePath);
    console.log("Error Stack:", error.stack);

    return null; // Return null to indicate upload failure
  }
};

export { uploadOnCloudinary };
