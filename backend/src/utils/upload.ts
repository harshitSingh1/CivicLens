// backend\src\utils\upload.ts
import { Request } from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import {ApiError} from './apiError';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Please upload only images'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const uploadToCloudinary = async (file: Express.Multer.File) => {
  return new Promise((resolve, reject) => {
    const uniqueFilename = `${uuidv4()}`;

    cloudinary.v2.uploader
      .upload_stream(
        {
          resource_type: 'image',
          public_id: uniqueFilename,
          folder: 'civiclens',
        },
        (error, result) => {
          if (error) {
            reject(new ApiError(500, 'Image upload failed'));
          } else {
            resolve(result?.secure_url);
          }
        }
      )
      .end(file.buffer);
  });
};

export { upload, uploadToCloudinary };