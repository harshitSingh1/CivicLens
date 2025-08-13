import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 5000;

export default {
  env,
  port,
  mongoose: {
    url: process.env.MONGODB_URI as string,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expire: process.env.JWT_EXPIRE as string,
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};