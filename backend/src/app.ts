// backend\src\app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import config from './config/env';
import router from './routes';
import { logger } from './utils/logger';


const app = express();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      config.frontendUrl
    ];
    
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      return callback(null, true);
    }
    
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routes
app.use('/api', router);

// Health check endpoint
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

export default app;