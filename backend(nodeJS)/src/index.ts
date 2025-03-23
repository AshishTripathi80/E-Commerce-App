import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import connectDB from './database/db';
import router from './routes/index';
import { swaggerSpec } from './config/swagger';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || '3000';

// Middleware
app.use(cors());  // Enable CORS for all routes
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
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Only connect to MongoDB and start server if this file is run directly
if (require.main === module) {
    // Connect to MongoDB
    connectDB();

    // Start server
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
        console.log(`API Documentation available at http://localhost:${port}/api-docs`);
    });
}

export default app;