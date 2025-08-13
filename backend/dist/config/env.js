"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 5000;
exports.default = {
    env,
    port,
    mongoose: {
        url: process.env.MONGODB_URI,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expire: process.env.JWT_EXPIRE,
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
