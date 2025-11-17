// backend\src\server.ts
import app from './app';
import config from './config/env';
import connectDB from './config/db';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          logger.info('Server closed');
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    };

    const unexpectedErrorHandler = (error: Error) => {
      logger.error(`Unhandled error: ${error}`);
      exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received');
      if (server) {
        server.close();
      }
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
};

startServer();