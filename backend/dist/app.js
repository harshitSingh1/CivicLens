"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend\src\app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = __importDefault(require("./config/env"));
const routes_1 = __importDefault(require("./routes"));
const logger_1 = require("./utils/logger");
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        const allowedOrigins = [
            'http://localhost:5173',
            'https://civiclens-frontend.onrender.com',
            env_1.default.frontendUrl
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
app.options('*', (0, cors_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// Logging
app.use((0, morgan_1.default)('combined', {
    stream: {
        write: (message) => logger_1.logger.info(message.trim()),
    },
}));
// Body parsers
app.use(express_1.default.json({ limit: '10kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
// Routes
app.use('/api', routes_1.default);
// Health check endpoint
app.get('/health', (_, res) => {
    res.status(200).json({ status: 'ok' });
});
// 404 handler
app.use((_req, res) => {
    res.status(404).json({ message: 'Not Found' });
});
exports.default = app;
