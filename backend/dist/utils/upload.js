"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const uuid_1 = require("uuid");
const apiError_1 = require("./apiError");
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = multer_1.default.memoryStorage();
const fileFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb(new apiError_1.ApiError(400, 'Please upload only images'), false);
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
exports.upload = upload;
const uploadToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
        const uniqueFilename = `${(0, uuid_1.v4)()}`;
        cloudinary_1.default.v2.uploader
            .upload_stream({
            resource_type: 'image',
            public_id: uniqueFilename,
            folder: 'civiclens',
        }, (error, result) => {
            if (error) {
                reject(new apiError_1.ApiError(500, 'Image upload failed'));
            }
            else {
                resolve(result?.secure_url);
            }
        })
            .end(file.buffer);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
