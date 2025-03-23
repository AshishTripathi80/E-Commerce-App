import mongoose from 'mongoose';

const connectDB = async (uri: string = process.env.MONGO_URI || '') => {
    try {
        if (mongoose.connection.readyState === 1) {
            return; // Already connected
        }
        
        if (!uri) {
            throw new Error('MongoDB URI is not defined');
        }

        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;