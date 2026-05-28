import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} fileBuffer
 * @param {string} folder
 * @param {Object} options
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadToCloudinary = (
  fileBuffer,
  folder = 'placements',
  options = {}
) => {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      folder,
      resource_type: 'auto',
      public_id: crypto.randomBytes(12).toString('hex'),
    };

    const uploadOptions = { ...defaultOptions, ...options };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export default cloudinary;