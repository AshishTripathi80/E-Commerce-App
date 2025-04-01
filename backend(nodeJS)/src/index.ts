import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import connectDB from './database/db';
import router from './routes/index';
import { swaggerSpec } from './config/swagger';
import logger, { stream } from './config/logger';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || '3000';

// Request logging middleware
app.use(morgan('combined', { stream }));

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL ||'http://localhost:4200',
    exposedHeaders: ['Authorization'], // Expose the Authorization header
  }));  // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Documentation in JSON format
app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Routes
app.use('/api', router);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('Unhandled error:', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip
    });
    res.status(500).json({ message: 'Something went wrong!' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Performing graceful shutdown...');
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Only connect to MongoDB and start server if this file is run directly
if (require.main === module) {
    // Connect to MongoDB
    connectDB();

    // Start server
    app.listen(port, () => {
        logger.info(`Server is running at http://localhost:${port}`);
        logger.info(`API Documentation available at http://localhost:${port}/api-docs`);
    });
}

export default app;