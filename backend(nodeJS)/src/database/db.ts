import mongoose from 'mongoose';
import logger from '../config/logger';

const connectDB = async (uri: string = process.env.MONGO_URI || '') => {
    try {
        if (mongoose.connection.readyState === 1) {
            logger.info('MongoDB already connected');
            return;
        }
        
        if (!uri) {
            throw new Error('MongoDB URI is not defined');
        }

        await mongoose.connect(uri);
        logger.info('MongoDB connected successfully');
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        logger.info('MongoDB disconnected successfully');
    } catch (error) {
        logger.error('MongoDB disconnection error:', error);
    }
}

export default connectDB;