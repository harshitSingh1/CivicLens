"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend\src\server.ts
const app_1 = __importDefault(require("./app"));
const env_1 = __importDefault(require("./config/env"));
const db_1 = __importDefault(require("./config/db"));
const logger_1 = require("./utils/logger");
const startServer = async () => {
    try {
        await (0, db_1.default)();
        const server = app_1.default.listen(env_1.default.port, () => {
            logger_1.logger.info(`Server running on port ${env_1.default.port}`);
        });
        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    logger_1.logger.info('Server closed');
                    process.exit(1);
                });
            }
            else {
                process.exit(1);
            }
        };
        const unexpectedErrorHandler = (error) => {
            logger_1.logger.error(`Unhandled error: ${error}`);
            exitHandler();
        };
        process.on('uncaughtException', unexpectedErrorHandler);
        process.on('unhandledRejection', unexpectedErrorHandler);
        process.on('SIGTERM', () => {
            logger_1.logger.info('SIGTERM received');
            if (server) {
                server.close();
            }
        });
    }
    catch (error) {
        logger_1.logger.error(`Failed to start server: ${error}`);
        process.exit(1);
    }
};
startServer();
