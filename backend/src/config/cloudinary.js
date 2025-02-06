// src/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    // Remove file from local storage after upload
    fs.unlinkSync(filePath);
    return result.secure_url;
  } catch (error) {
    // Remove file from local storage if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error('Image upload failed');
  }
};