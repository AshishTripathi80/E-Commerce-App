import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import connectDB, { disconnectDB } from '../database/db';

let mongod: MongoMemoryServer;

beforeAll(async () => {
    // Create an in-memory MongoDB server
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    // Connect to the in-memory database
    await connectDB(uri);
});

afterAll(async () => {
    // Disconnect and cleanup
    await disconnectDB();
    await mongod.stop();
});

afterEach(async () => {
    // Clear all collections after each test
    if (mongoose.connection.readyState === 1) {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    }
}); 